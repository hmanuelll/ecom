<?php
namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Address;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->orders()->with('items.product')->latest()->get());
    }

    public function adminIndex()
    {
        return response()->json(Order::with(['user', 'items.product', 'shippingAddress'])->latest()->paginate(20));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'delivery_method' => 'required|string|in:Home Delivery,Store Pickup',
            'address' => 'required|array',
            'address.full_name' => 'required|string',
            'address.phone_number' => 'required|string',
            'address.email_address' => 'nullable|email',
            'address.province' => 'required|string',
            'address.town' => 'required|string',
            'address.delivery_address' => 'required|string',
            'address.landmark' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1'
        ]);

        DB::beginTransaction();
        try {
            // Create Address
            $address = Address::create([
                'user_id' => $request->user()->id,
                'full_name' => $validated['address']['full_name'],
                'phone_number' => $validated['address']['phone_number'],
                'email_address' => $validated['address']['email_address'] ?? null,
                'address_line1' => $validated['address']['delivery_address'],
                'landmark' => $validated['address']['landmark'] ?? null,
                'city' => $validated['address']['town'],
                'state' => $validated['address']['province'],
                'zip_code' => 'N/A',
                'country' => 'Zambia',
            ]);

            $totalAmount = 0;
            $orderItems = [];

            // Verify stock and calculate total
            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                if ($product->stock_quantity < $item['quantity']) {
                    throw new \Exception("Not enough stock for {$product->name}");
                }
                
                $itemTotal = $product->price * $item['quantity'];
                $totalAmount += $itemTotal;

                $orderItems[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price,
                    'total_price' => $itemTotal,
                ];

                // Deduct stock
                $product->decrement('stock_quantity', $item['quantity']);
            }

            // Create Order
            $order = Order::create([
                'user_id' => $request->user()->id,
                'total_amount' => $totalAmount,
                'shipping_address_id' => $address->id,
                'delivery_method' => $validated['delivery_method'],
                'status' => 'Pending',
                'payment_status' => 'Pending'
            ]);

            // Create Order Items
            foreach ($orderItems as $oi) {
                $oi['order_id'] = $order->id;
                OrderItem::create($oi);
            }

            DB::commit();

            $request->user()->notify(new \App\Notifications\OrderPlaced($order->id));

            return response()->json($order->load('items.product', 'shippingAddress'), 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function show($id, Request $request)
    {
        $order = Order::with(['items.product', 'shippingAddress'])->findOrFail($id);
        if ($order->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return response()->json($order);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:Pending,Confirmed,Awaiting Payment,Payment Submitted,Paid,Processing,Out for Delivery,Ready for Pickup,Delivered,Cancelled'
        ]);

        $order->update(['status' => $validated['status']]);
        
        // Restore stock if cancelled
        if ($validated['status'] === 'Cancelled') {
            foreach ($order->items as $item) {
                $item->product->increment('stock_quantity', $item->quantity);
            }
        }
        
        // Notify customer on payment
        if ($validated['status'] === 'Paid') {
            $order->user->notify(new \App\Notifications\PaymentConfirmed($order->id));
        }

        return response()->json($order);
    }

    public function confirmOrder(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $order->update(['status' => 'Awaiting Payment']);
        $order->user->notify(new \App\Notifications\OrderConfirmed($order->id));
        return response()->json($order);
    }

    public function submitPayment(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'payment_type' => 'required|in:Mobile Money,Pay on Delivery,Store Pickup',
            'transaction_id' => 'nullable|string',
            'proof' => 'nullable|image|max:5048'
        ]);

        $proofPath = null;
        if ($request->hasFile('proof')) {
            $proofPath = $request->file('proof')->store('payments', 'public');
        }

        $status = $validated['payment_type'] === 'Mobile Money' ? 'Payment Submitted' : 'Processing';

        $order->update([
            'payment_type' => $validated['payment_type'],
            'transaction_id' => $validated['transaction_id'] ?? null,
            'payment_proof_path' => $proofPath,
            'status' => $status
        ]);

        return response()->json($order);
    }
}

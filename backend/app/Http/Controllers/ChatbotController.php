<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ChatbotController extends Controller
{
    public function sendMessage(Request $request)
    {
        $message = strtolower($request->input('message', ''));
        
        // 1. Order Tracking
        if (str_contains($message, 'track') || str_contains($message, 'order status')) {
            return response()->json([
                'type' => 'text',
                'text' => 'To track your order, please log into your account and visit the "Orders" tab, or provide your 6-digit Order ID here.'
            ]);
        }

        // 2. Policies
        if (str_contains($message, 'warranty') || str_contains($message, 'guarantee')) {
            return response()->json([
                'type' => 'text',
                'text' => 'All our products come with a standard 1-year manufacturer warranty. You can also purchase an extended 2-year warranty during checkout.'
            ]);
        }
        if (str_contains($message, 'return') || str_contains($message, 'refund')) {
            return response()->json([
                'type' => 'text',
                'text' => 'We offer a 30-day money-back guarantee. If you are not satisfied, you can return the item in its original packaging for a full refund.'
            ]);
        }
        if (str_contains($message, 'delivery') || str_contains($message, 'shipping')) {
            return response()->json([
                'type' => 'text',
                'text' => 'We offer free nationwide shipping on all orders over K500! Standard delivery takes 2-4 business days.'
            ]);
        }
        if (str_contains($message, 'payment')) {
            return response()->json([
                'type' => 'text',
                'text' => 'We accept all major credit cards, Airtel Money, MTN Mobile Money, and bank transfers.'
            ]);
        }

        // 3. Product Recommendations & Search
        // Extract potential price limit
        $priceLimit = 999999;
        if (preg_match('/under (\d+)/', $message, $matches) || preg_match('/under k(\d+)/', $message, $matches)) {
            $priceLimit = (float)$matches[1];
        }

        $query = Product::query();
        $isSearching = false;

        // If they just say "hi" or "hello"
        if (in_array(trim($message), ['hi', 'hello', 'hey', 'help'])) {
            return response()->json([
                'type' => 'text',
                'text' => 'Hello! How can I help you today? I can answer questions about store policies, track your order, or help you find the perfect product.'
            ]);
        }

        if (str_contains($message, 'laptop') || str_contains($message, 'computer')) {
            $query->where('category', 'like', '%laptop%')->orWhere('category', 'like', '%computer%');
            $isSearching = true;
        }
        if (str_contains($message, 'phone') || str_contains($message, 'smartphone') || str_contains($message, 'mobile')) {
            $query->where('category', 'like', '%phone%');
            $isSearching = true;
        }
        if (str_contains($message, 'gaming')) {
            $query->where(function($q) {
                $q->where('category', 'like', '%gaming%')
                  ->orWhere('name', 'like', '%gaming%')
                  ->orWhere('description', 'like', '%gaming%');
            });
            $isSearching = true;
        }
        if (str_contains($message, 'programming') || str_contains($message, 'developer') || str_contains($message, 'coding')) {
            $query->where(function($q) {
                $q->where('description', 'like', '%programming%')
                  ->orWhere('description', 'like', '%developer%')
                  ->orWhere('description', 'like', '%pro%')
                  ->orWhere('category', 'like', '%laptop%');
            });
            $isSearching = true;
        }
        
        // If they type a specific brand or term
        if (!$isSearching && strlen($message) > 3) {
             // Fallback to basic search
             $query->where('name', 'like', '%' . $message . '%')->orWhere('description', 'like', '%' . $message . '%');
             $isSearching = true;
        }

        if ($isSearching) {
            $products = $query->where('price', '<', $priceLimit)->take(3)->get();
            
            if ($products->count() > 0) {
                return response()->json([
                    'type' => 'products',
                    'text' => 'Here are some great options I found for you:',
                    'products' => $products
                ]);
            } else {
                return response()->json([
                    'type' => 'text',
                    'text' => 'I could not find any products matching those exact criteria. Can you try broadening your search?'
                ]);
            }
        }

        // 4. Default Fallback
        return response()->json([
            'type' => 'text',
            'text' => 'I am an AI assistant and I am not quite sure how to answer that yet! Would you like me to connect you with a human agent? You can email us at support@techstore.co.zm or call/WhatsApp +260 97 1234567.'
        ]);
    }
}

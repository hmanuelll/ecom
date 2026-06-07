<?php
namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'images']);

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        if ($request->has('category') && $request->category !== 'featured') {
            $query->whereHas('category', function($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }
        
        // Filter by JSON attributes if provided
        if ($request->has('os')) {
            $query->whereJsonContains('attributes->os', $request->os);
        }
        if ($request->has('type')) {
            $query->whereJsonContains('attributes->type', $request->type);
        }

        // Dynamic attribute filters (cpu, ram, storage, gpu) expected as comma-separated lists
        $attributeFilters = ['cpu', 'ram', 'storage', 'gpu'];
        foreach ($attributeFilters as $attr) {
            if ($request->has($attr)) {
                $values = explode(',', $request->$attr);
                $query->whereIn('attributes->'.$attr, $values);
            }
        }

        // Price range filters
        if ($request->has('min_price') && is_numeric($request->min_price)) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price') && is_numeric($request->max_price)) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        return response()->json($query->paginate(12));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'sku' => 'required|string|unique:products',
            'is_featured' => 'boolean',
            'is_active' => 'boolean'
        ]);
        $validated['slug'] = Str::slug($validated['name']) . '-' . uniqid();
        
        $product = Product::create($validated);
        return response()->json($product, 201);
    }

    public function show($id)
    {
        return response()->json(Product::with(['category', 'images'])->findOrFail($id));
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'category_id' => 'sometimes|exists:categories,id',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'stock_quantity' => 'sometimes|integer|min:0',
            'sku' => 'sometimes|string|unique:products,sku,' . $product->id,
            'is_featured' => 'boolean',
            'is_active' => 'boolean'
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . uniqid();
        }

        $product->update($validated);
        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}

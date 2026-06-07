<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Str;

class SampleDataSeeder extends Seeder
{
    public function run()
    {
        // Define Categories
        $categories = [
            ['name' => 'Smartphones', 'slug' => 'smartphones', 'description' => 'Latest mobile phones and smartphones.'],
            ['name' => 'Laptops', 'slug' => 'laptops', 'description' => 'High performance laptops for work and gaming.'],
            ['name' => 'Gaming', 'slug' => 'gaming', 'description' => 'Consoles, games, and gaming accessories.'],
            ['name' => 'Accessories', 'slug' => 'accessories', 'description' => 'Headphones, smartwatches, and more.'],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(['slug' => $cat['slug']], $cat);
        }

        // Define Products
        $products = [
            // Smartphones
            ['name' => 'iPhone 15 Pro Max', 'category' => 'smartphones', 'description' => 'The ultimate iPhone with titanium design, A17 Pro chip, and 5x optical zoom.', 'price' => 28500.00, 'stock' => 15, 'attributes' => ['os' => 'iOS', 'storage' => '256GB', 'ram' => '8GB', 'screen' => '6.7" OLED', 'color' => 'Natural Titanium', 'condition' => 'Brand New', 'features' => 'Face ID, MagSafe', 'connectivity' => '5G, Wi-Fi 6E']],
            ['name' => 'Samsung Galaxy S24 Ultra', 'category' => 'smartphones', 'description' => 'Galaxy AI is here. Welcome to the era of mobile AI.', 'price' => 29999.00, 'stock' => 20, 'attributes' => ['os' => 'Android', 'storage' => '512GB', 'ram' => '12GB', 'screen' => '6.8" AMOLED', 'color' => 'Titanium Black', 'condition' => 'Brand New', 'features' => 'S Pen, Galaxy AI', 'connectivity' => '5G, Wi-Fi 7']],
            ['name' => 'Google Pixel 8 Pro', 'category' => 'smartphones', 'description' => 'The best of Google AI, built around you.', 'price' => 21500.00, 'stock' => 10, 'attributes' => ['os' => 'Android', 'storage' => '128GB', 'ram' => '12GB', 'screen' => '6.7" OLED', 'color' => 'Obsidian', 'condition' => 'Brand New', 'features' => 'Google AI, Magic Eraser', 'connectivity' => '5G, Wi-Fi 7']],
            ['name' => 'Xiaomi 14 Pro', 'category' => 'smartphones', 'description' => 'Leica optics, Snapdragon 8 Gen 3.', 'price' => 18000.00, 'stock' => 25, 'attributes' => ['os' => 'Android', 'storage' => '256GB', 'ram' => '12GB', 'screen' => '6.73" AMOLED', 'color' => 'White', 'condition' => 'Brand New', 'features' => 'Leica Camera, Fast Charge', 'connectivity' => '5G, Wi-Fi 7']],
            ['name' => 'OnePlus 12', 'category' => 'smartphones', 'description' => 'Smooth beyond belief.', 'price' => 16500.00, 'stock' => 30, 'attributes' => ['os' => 'Android', 'storage' => '512GB', 'ram' => '16GB', 'screen' => '6.82" AMOLED', 'color' => 'Flowy Emerald', 'condition' => 'Brand New', 'features' => 'Hasselblad Camera', 'connectivity' => '5G, Wi-Fi 7']],

            // Laptops
            ['name' => 'Dell Inspiron 15', 'category' => 'laptops', 'description' => 'Reliable everyday laptop.', 'price' => 9500.00, 'stock' => 12, 'attributes' => ['cpu' => 'Intel Core i3', 'ram' => '4GB', 'storage' => '128GB SSD', 'gpu' => 'Intel', 'screen' => '15.6"', 'battery' => '42Wh', 'color' => 'Silver', 'condition' => 'Refurbished', 'features' => 'Webcam, Numeric Keypad', 'connectivity' => 'Wi-Fi 5, Bluetooth']],
            ['name' => 'HP Pavilion 14', 'category' => 'laptops', 'description' => 'Great value for students.', 'price' => 15000.00, 'stock' => 18, 'attributes' => ['cpu' => 'Intel Core i5', 'ram' => '8GB', 'storage' => '256GB SSD', 'gpu' => 'Intel', 'screen' => '14.0"', 'battery' => '50Wh', 'color' => 'Blue', 'condition' => 'Brand New', 'features' => 'Fingerprint Reader', 'connectivity' => 'Wi-Fi 6, Bluetooth']],
            ['name' => 'Lenovo ThinkPad X1 Carbon', 'category' => 'laptops', 'description' => 'Ultralight business laptop with legendary keyboard.', 'price' => 38000.00, 'stock' => 18, 'attributes' => ['cpu' => 'Intel Core i7', 'ram' => '16GB', 'storage' => '512GB SSD', 'gpu' => 'Intel', 'screen' => '14.0"', 'battery' => '57Wh', 'color' => 'Black', 'condition' => 'Brand New', 'features' => 'Backlit Keyboard, Face ID', 'connectivity' => 'Wi-Fi 6E, LTE']],
            ['name' => 'HP Spectre x360', 'category' => 'laptops', 'description' => 'A convertible laptop with stunning design.', 'price' => 32000.00, 'stock' => 15, 'attributes' => ['cpu' => 'Intel Core i7', 'ram' => '16GB', 'storage' => '1TB SSD', 'gpu' => 'Intel', 'screen' => '13.5"', 'battery' => '66Wh', 'color' => 'Nightfall Black', 'condition' => 'Brand New', 'features' => 'Touchscreen, Stylus Pen', 'connectivity' => 'Wi-Fi 6E, Bluetooth 5.3']],
            ['name' => 'Asus ROG Zephyrus G14', 'category' => 'laptops', 'description' => 'Powerful gaming laptop in a compact form factor.', 'price' => 35000.00, 'stock' => 8, 'attributes' => ['cpu' => 'AMD', 'ram' => '32GB', 'storage' => '1TB SSD', 'gpu' => 'Nvidia', 'screen' => '14.0"', 'battery' => '76Wh', 'color' => 'Moonlight White', 'condition' => 'Brand New', 'features' => 'AniMe Matrix, 120Hz Screen', 'connectivity' => 'Wi-Fi 6, Bluetooth']],

            // Gaming
            ['name' => 'PlayStation 5 Console', 'category' => 'gaming', 'description' => 'Lightning speed, breathtaking immersion, stunning games.', 'price' => 12500.00, 'stock' => 50, 'attributes' => null],
            ['name' => 'Xbox Series X', 'category' => 'gaming', 'description' => 'The fastest, most powerful Xbox ever.', 'price' => 12000.00, 'stock' => 40, 'attributes' => null],
            ['name' => 'Nintendo Switch OLED', 'category' => 'gaming', 'description' => 'Play at home or on the go with a vibrant OLED screen.', 'price' => 8500.00, 'stock' => 60, 'attributes' => null],
            ['name' => 'Logitech G Pro X Superlight', 'category' => 'gaming', 'description' => 'Ultra-lightweight wireless gaming mouse.', 'price' => 3200.00, 'stock' => 100, 'attributes' => null],
            ['name' => 'Razer BlackWidow V4 Pro', 'category' => 'gaming', 'description' => 'Mechanical gaming keyboard with RGB lighting.', 'price' => 4500.00, 'stock' => 45, 'attributes' => null],

            // Accessories (Audio & Wearables)
            ['name' => 'AirPods Pro (2nd Gen)', 'category' => 'accessories', 'description' => 'Active Noise Cancellation, personalized spatial audio.', 'price' => 5500.00, 'stock' => 80, 'attributes' => ['type' => 'Audio']],
            ['name' => 'Sony WH-1000XM5', 'category' => 'accessories', 'description' => 'Industry-leading noise canceling headphones.', 'price' => 8500.00, 'stock' => 35, 'attributes' => ['type' => 'Audio']],
            ['name' => 'Bose QuietComfort Ultra', 'category' => 'accessories', 'description' => 'World-class noise cancellation.', 'price' => 9000.00, 'stock' => 25, 'attributes' => ['type' => 'Audio']],
            ['name' => 'JBL Charge 5', 'category' => 'accessories', 'description' => 'Portable waterproof speaker with powerbank.', 'price' => 3500.00, 'stock' => 120, 'attributes' => ['type' => 'Audio']],
            ['name' => 'Sonos Arc', 'category' => 'accessories', 'description' => 'Premium smart soundbar for TV, movies, music, and more.', 'price' => 19500.00, 'stock' => 15, 'attributes' => ['type' => 'Audio']],

            ['name' => 'Apple Watch Ultra 2', 'category' => 'accessories', 'description' => 'Rugged and capable, built to meet the demands of endurance athletes.', 'price' => 19000.00, 'stock' => 20, 'attributes' => ['type' => 'Wearables']],
            ['name' => 'Samsung Galaxy Watch 6 Classic', 'category' => 'accessories', 'description' => 'Timeless style, smart capabilities.', 'price' => 7500.00, 'stock' => 40, 'attributes' => ['type' => 'Wearables']],
            ['name' => 'Garmin Fenix 7 Pro', 'category' => 'accessories', 'description' => 'Ultimate multisport GPS smartwatch.', 'price' => 18500.00, 'stock' => 10, 'attributes' => ['type' => 'Wearables']],
            ['name' => 'Fitbit Charge 6', 'category' => 'accessories', 'description' => 'Advanced fitness and health tracker.', 'price' => 3800.00, 'stock' => 60, 'attributes' => ['type' => 'Wearables']],
            ['name' => 'Oura Ring Gen3', 'category' => 'accessories', 'description' => 'Smart ring for sleep and fitness tracking.', 'price' => 7000.00, 'stock' => 30, 'attributes' => ['type' => 'Wearables']],
        ];

        foreach ($products as $prod) {
            $cat = Category::where('slug', $prod['category'])->first();
            Product::updateOrCreate(
                ['name' => $prod['name']],
                [
                    'slug' => Str::slug($prod['name']),
                    'sku' => strtoupper(Str::random(8)),
                    'category_id' => $cat ? $cat->id : null,
                    'description' => $prod['description'],
                    'price' => $prod['price'],
                    'stock_quantity' => $prod['stock'],
                    'attributes' => $prod['attributes']
                ]
            );
        }
    }
}

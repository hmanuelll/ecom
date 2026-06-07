<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'admin',
            'password' => bcrypt('password')
        ]);

        $catComputers = \App\Models\Category::create([
            'name' => 'Computers',
            'slug' => 'computers',
            'description' => 'Laptops and Desktops'
        ]);

        $catPhones = \App\Models\Category::create([
            'name' => 'Smartphones',
            'slug' => 'smartphones',
            'description' => 'Latest smartphones'
        ]);

        \App\Models\Product::create([
            'category_id' => $catComputers->id,
            'name' => 'ProBook X',
            'slug' => 'probook-x-123',
            'description' => 'A very fast laptop for pros.',
            'price' => 1200.00,
            'stock_quantity' => 50,
            'sku' => 'LAP-PBX-01',
            'is_featured' => true
        ]);

        \App\Models\Product::create([
            'category_id' => $catPhones->id,
            'name' => 'Phone X 256GB',
            'slug' => 'phone-x-256gb',
            'description' => 'A very smart phone.',
            'price' => 899.00,
            'stock_quantity' => 100,
            'sku' => 'PHN-X-256'
        ]);
    }
}

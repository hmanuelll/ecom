<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('addresses', function (Blueprint $table) {
            $table->string('full_name')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('email_address')->nullable();
            $table->string('landmark')->nullable();
        });

        // Use raw SQL since doctrine/dbal is missing
        \Illuminate\Support\Facades\DB::statement("ALTER TABLE addresses MODIFY zip_code VARCHAR(255) NULL, MODIFY country VARCHAR(255) NULL");

        Schema::table('orders', function (Blueprint $table) {
            $table->string('delivery_method')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
};

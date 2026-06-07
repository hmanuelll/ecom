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
        // Alter the ENUM column for status to include new Zambian workflow options
        \Illuminate\Support\Facades\DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM('Pending', 'Confirmed', 'Awaiting Payment', 'Payment Submitted', 'Paid', 'Processing', 'Out for Delivery', 'Ready for Pickup', 'Delivered', 'Cancelled') DEFAULT 'Pending'");

        Schema::table('orders', function (Blueprint $table) {
            $table->string('payment_type')->nullable();
            $table->string('transaction_id')->nullable();
            $table->string('payment_proof_path')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Revert ENUM if necessary (using a simpler list)
        \Illuminate\Support\Facades\DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM('Pending', 'Confirmed', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled') DEFAULT 'Pending'");

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['payment_type', 'transaction_id', 'payment_proof_path']);
        });
    }
};

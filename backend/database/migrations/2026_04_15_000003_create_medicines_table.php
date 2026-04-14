<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medicines', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('category');
            $table->decimal('price', 10, 2);
            $table->unsignedInteger('quantity')->default(0);
            $table->date('expiry_date');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medicines');
    }
};
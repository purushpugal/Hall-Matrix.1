<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('degrees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('college_id')->constrained('colleges')->cascadeOnDelete();
            $table->string('name');
            $table->timestamps();

            $table->unique(['college_id', 'name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('degrees');
    }
};

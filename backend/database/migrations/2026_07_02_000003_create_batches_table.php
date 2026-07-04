<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('batches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('college_id')->constrained('colleges')->cascadeOnDelete();
            $table->unsignedSmallInteger('from_year');
            $table->unsignedSmallInteger('to_year');
            $table->timestamps();

            $table->unique(['college_id', 'from_year', 'to_year']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('batches');
    }
};

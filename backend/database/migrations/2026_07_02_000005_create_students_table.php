<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->foreignId('college_id')->constrained('colleges')->cascadeOnDelete();
            $table->foreignId('degree_id')->constrained('degrees');
            $table->foreignId('department_id')->constrained('departments');
            $table->foreignId('batch_id')->constrained('batches');
            $table->string('register_no');
            $table->string('phone', 15);
            $table->string('profile_photo')->nullable();
            $table->timestamps();

            $table->unique(['college_id', 'register_no']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};

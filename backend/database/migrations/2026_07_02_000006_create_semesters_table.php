<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('semesters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('college_id')->constrained('colleges')->cascadeOnDelete();
            $table->foreignId('degree_id')->constrained('degrees')->cascadeOnDelete();
            $table->foreignId('department_id')->constrained('departments')->cascadeOnDelete();
            $table->foreignId('batch_id')->constrained('batches')->cascadeOnDelete();
            $table->unsignedTinyInteger('semester_number');
            $table->timestamps();

            $table->unique(['degree_id', 'department_id', 'batch_id', 'semester_number'], 'semesters_unique_combo');
        });

        Schema::create('semester_subject', function (Blueprint $table) {
            $table->id();
            $table->foreignId('semester_id')->constrained('semesters')->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();

            $table->unique(['semester_id', 'subject_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('semester_subject');
        Schema::dropIfExists('semesters');
    }
};

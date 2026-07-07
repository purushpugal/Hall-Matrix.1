<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('college_id')->constrained('colleges')->cascadeOnDelete();
            $table->string('exam_name');
            $table->date('exam_date');
            $table->foreignId('hall_id')->constrained('halls')->cascadeOnDelete();
            $table->string('allocation_method');
            $table->timestamps();
        });

        Schema::create('exam_subject', function (Blueprint $table) {
            $table->foreignId('exam_id')->constrained('exams')->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->primary(['exam_id', 'subject_id']);
        });

        Schema::create('exam_student_seats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained('exams')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->integer('row_no');
            $table->integer('col_no');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_student_seats');
        Schema::dropIfExists('exam_subject');
        Schema::dropIfExists('exams');
    }
};

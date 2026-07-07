<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('colleges', function (Blueprint $table) {
            $table->string('website')->nullable()->after('email');
            $table->text('address')->nullable()->after('website');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->string('designation')->nullable()->after('role');
            $table->foreignId('department_id')->nullable()->after('college_id')
                  ->constrained('departments')->nullOnDelete();
        });

        Schema::table('students', function (Blueprint $table) {
            $table->string('gender')->nullable()->after('phone');
            $table->date('dob')->nullable()->after('gender');
            $table->string('roll_no')->nullable()->after('dob');
        });

        Schema::table('halls', function (Blueprint $table) {
            $table->string('block_name')->nullable()->after('name');
            $table->text('description')->nullable()->after('block_name');
        });
    }

    public function down(): void
    {
        Schema::table('colleges', function (Blueprint $table) {
            $table->dropColumn(['website', 'address']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['department_id']);
            $table->dropColumn(['phone', 'designation', 'department_id']);
        });

        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn(['gender', 'dob', 'roll_no']);
        });

        Schema::table('halls', function (Blueprint $table) {
            $table->dropColumn(['block_name', 'description']);
        });
    }
};

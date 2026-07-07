<?php

namespace Database\Seeders;

use App\Models\College;
use App\Models\User;
use App\Models\Degree;
use App\Models\Department;
use App\Models\Batch;
use App\Models\Subject;
use App\Models\Student;
use App\Models\Semester;
use App\Models\StudentSubjectResult;
use App\Models\Hall;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Truncate all tables for fresh start ──
        Schema::disableForeignKeyConstraints();
        StudentSubjectResult::truncate();
        Semester::truncate();
        Student::truncate();
        Subject::truncate();
        Batch::truncate();
        Department::truncate();
        Degree::truncate();
        User::truncate();
        College::truncate();
        Hall::truncate();
        Schema::enableForeignKeyConstraints();

        // 1. Super Admin
        User::create([
            'name'      => 'Super Admin',
            'email'     => 'superadmin@hallmatrix.com',
            'password'  => Hash::make('password123'),
            'role'      => 'super_admin',
            'is_active' => true,
        ]);

        // 2. CCET College
        $college = College::create([
            'college_name'   => 'Christian College of Engineering and Technology',
            'college_code'   => '9203',
            'location'       => 'Oddanchatram',
            'contact_person' => 'College Admin',
            'contact_number' => '9876543210',
            'email'          => 'admin@ccet.edu',
            'password'       => Hash::make('password123'),
            'is_active'      => true,
        ]);

        // 3. College Admin User
        User::create([
            'name'       => 'CCET Admin',
            'email'      => 'admin@ccet.edu',
            'password'   => Hash::make('password123'),
            'role'       => 'college_admin',
            'is_active'  => true,
            'college_id' => $college->id,
        ]);

        // 4. Tutor User
        $tutorUser = User::create([
            'name'       => 'Dr. Sarah Jenkins',
            'email'      => 'tutor@ccet.edu',
            'password'   => Hash::make('password123'),
            'role'       => 'tutor',
            'is_active'  => true,
            'college_id' => $college->id,
        ]);

        // 5. Student User
        $studentUser = User::create([
            'name'       => 'John Doe',
            'email'      => 'student@ccet.edu',
            'password'   => Hash::make('password123'),
            'role'       => 'student',
            'is_active'  => true,
            'college_id' => $college->id,
        ]);

        // 6. Setup Settings (Degree, Dept, Batch, Subjects)
        $degree = Degree::create([
            'college_id' => $college->id,
            'name'       => 'B.E',
        ]);

        $department = Department::create([
            'college_id' => $college->id,
            'degree_id'  => $degree->id,
            'name'       => 'CSE',
        ]);

        $batch = Batch::create([
            'college_id' => $college->id,
            'from_year'  => 2021,
            'to_year'    => 2025,
        ]);

        $subject1 = Subject::create([
            'college_id' => $college->id,
            'code'       => 'CS101',
            'name'       => 'Data Structures',
        ]);

        $subject2 = Subject::create([
            'college_id' => $college->id,
            'code'       => 'CS102',
            'name'       => 'Database Management Systems',
        ]);

        $subject3 = Subject::create([
            'college_id' => $college->id,
            'code'       => 'CS103',
            'name'       => 'Design and Analysis of Algorithms',
        ]);

        // 7. Student details
        $student = Student::create([
            'user_id'       => $studentUser->id,
            'college_id'    => $college->id,
            'degree_id'     => $degree->id,
            'department_id' => $department->id,
            'batch_id'      => $batch->id,
            'tutor_id'      => $tutorUser->id,
            'register_no'   => '9203CSE21001',
            'phone'         => '9876500001',
        ]);

        // 8. Semesters
        $semester = Semester::create([
            'college_id'      => $college->id,
            'degree_id'       => $degree->id,
            'department_id'   => $department->id,
            'batch_id'        => $batch->id,
            'semester_number' => 1,
        ]);

        // Attach subjects to semester
        $semester->subjects()->attach([$subject1->id, $subject2->id, $subject3->id]);

        // 9. Student subject results
        StudentSubjectResult::create([
            'student_id'  => $student->id,
            'semester_id' => $semester->id,
            'subject_id'  => $subject1->id,
            'status'      => 'pass',
        ]);

        StudentSubjectResult::create([
            'student_id'  => $student->id,
            'semester_id' => $semester->id,
            'subject_id'  => $subject2->id,
            'status'      => 'fail',
        ]);

        // 10. Seed halls
        Hall::create([
            'college_id' => $college->id,
            'name'       => 'LH-1',
            'capacity'   => 40,
            'rows'       => 5,
            'cols'       => 8,
        ]);

        Hall::create([
            'college_id' => $college->id,
            'name'       => 'LH-2',
            'capacity'   => 30,
            'rows'       => 5,
            'cols'       => 6,
        ]);
    }
}

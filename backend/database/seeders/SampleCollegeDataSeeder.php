<?php

namespace Database\Seeders;

use App\Models\Batch;
use App\Models\College;
use App\Models\Degree;
use App\Models\Department;
use App\Models\Student;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SampleCollegeDataSeeder extends Seeder
{
    public function run(): void
    {
        $college = College::where('college_code', '9203')->firstOrFail();
        $collegeId = $college->id;

        // ── Degrees ──────────────────────────────────────────────────────────
        $degrees = [];
        foreach (['B.E', 'B.Tech', 'M.E'] as $name) {
            $degrees[$name] = Degree::updateOrCreate(
                ['college_id' => $collegeId, 'name' => $name],
                []
            );
        }

        // ── Departments ──────────────────────────────────────────────────────
        $departmentsByDegree = [
            'B.E'    => ['CSE', 'ECE', 'MECH', 'EEE'],
            'B.Tech' => ['IT', 'CIVIL'],
            'M.E'    => ['CSE'],
        ];
        $departments = [];
        foreach ($departmentsByDegree as $degreeName => $names) {
            foreach ($names as $name) {
                $departments["$degreeName-$name"] = Department::updateOrCreate(
                    ['college_id' => $collegeId, 'degree_id' => $degrees[$degreeName]->id, 'name' => $name],
                    []
                );
            }
        }

        // ── Batches ──────────────────────────────────────────────────────────
        $batches = [];
        foreach ([[2021, 2025], [2022, 2026], [2023, 2027], [2024, 2028]] as [$from, $to]) {
            $batches["$from-$to"] = Batch::updateOrCreate(
                ['college_id' => $collegeId, 'from_year' => $from, 'to_year' => $to],
                []
            );
        }

        // ── Subjects ─────────────────────────────────────────────────────────
        $subjects = [
            ['CS101', 'Data Structures'],
            ['CS102', 'Database Management Systems'],
            ['CS201', 'Operating Systems'],
            ['CS202', 'Computer Networks'],
            ['EC101', 'Digital Electronics'],
            ['ME101', 'Engineering Mechanics'],
            ['MA101', 'Engineering Mathematics I'],
            ['IT101', 'Web Technology'],
        ];
        foreach ($subjects as [$code, $name]) {
            Subject::updateOrCreate(
                ['college_id' => $collegeId, 'code' => $code],
                ['name' => $name]
            );
        }

        // ── Students ─────────────────────────────────────────────────────────
        $students = [
            ['Arjun Kumar',     '9876500001', 'arjun.kumar@example.com',     '9203CSE21001', 'B.E',    'CSE',   '2021-2025'],
            ['Divya Sundaram',  '9876500002', 'divya.sundaram@example.com',  '9203CSE21002', 'B.E',    'CSE',   '2021-2025'],
            ['Karthik Raja',    '9876500003', 'karthik.raja@example.com',    '9203ECE22001', 'B.E',    'ECE',   '2022-2026'],
            ['Meena Priya',     '9876500004', 'meena.priya@example.com',     '9203MEC22001', 'B.E',    'MECH',  '2022-2026'],
            ['Suresh Babu',     '9876500005', 'suresh.babu@example.com',     '9203IT23001',  'B.Tech', 'IT',    '2023-2027'],
            ['Lakshmi Narayan', '9876500006', 'lakshmi.narayan@example.com', '9203CIV23001', 'B.Tech', 'CIVIL', '2023-2027'],
            ['Ramesh Chandran', '9876500007', 'ramesh.chandran@example.com', '9203CSE24001', 'B.E',    'CSE',   '2024-2028'],
            ['Anjali Devi',     '9876500008', 'anjali.devi@example.com',     '9203MCS21001', 'M.E',    'CSE',   '2021-2025'],
        ];

        foreach ($students as [$name, $phone, $email, $registerNo, $degreeName, $deptName, $batchLabel]) {
            $user = User::updateOrCreate(
                ['email' => $email],
                [
                    'name'       => $name,
                    'password'   => Hash::make('student123'),
                    'role'       => 'student',
                    'is_active'  => true,
                    'college_id' => $collegeId,
                ]
            );

            Student::updateOrCreate(
                ['college_id' => $collegeId, 'register_no' => $registerNo],
                [
                    'user_id'       => $user->id,
                    'degree_id'     => $degrees[$degreeName]->id,
                    'department_id' => $departments["$degreeName-$deptName"]->id,
                    'batch_id'      => $batches[$batchLabel]->id,
                    'phone'         => $phone,
                ]
            );
        }
    }
}

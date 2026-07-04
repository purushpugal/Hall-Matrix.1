<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Semester;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $collegeId = $this->collegeId($request);

        $students = Student::with(['user:id,name,email,is_active', 'degree:id,name', 'department:id,name', 'batch:id,from_year,to_year'])
            ->where('college_id', $collegeId)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Student $s) => $this->present($s));

        return response()->json(['students' => $students]);
    }

    public function store(Request $request)
    {
        $collegeId = $this->collegeId($request);

        $data = $request->validate([
            'name'          => ['required', 'string', 'max:255'],
            'phone'         => ['required', 'digits:10'],
            'email'         => ['required', 'email', 'max:255', 'unique:users,email'],
            'password'      => ['required', 'string', 'min:8'],
            'profile_photo' => ['nullable', 'image', 'max:2048'],
            'register_no'   => [
                'required', 'string', 'max:50',
                Rule::unique('students')->where('college_id', $collegeId),
            ],
            'degree_id'     => ['required', Rule::exists('degrees', 'id')->where('college_id', $collegeId)],
            'department_id' => ['required', Rule::exists('departments', 'id')->where('college_id', $collegeId)->where('degree_id', $request->input('degree_id'))],
            'batch_id'      => ['required', Rule::exists('batches', 'id')->where('college_id', $collegeId)],
        ]);

        $photoPath = null;
        if ($request->hasFile('profile_photo')) {
            $photoPath = $request->file('profile_photo')->store('students', 'public');
        }

        $student = DB::transaction(function () use ($data, $collegeId, $photoPath) {
            $user = User::create([
                'name'       => $data['name'],
                'email'      => $data['email'],
                'password'   => Hash::make($data['password']),
                'role'       => 'student',
                'is_active'  => true,
                'college_id' => $collegeId,
            ]);

            return Student::create([
                'user_id'        => $user->id,
                'college_id'     => $collegeId,
                'degree_id'      => $data['degree_id'],
                'department_id'  => $data['department_id'],
                'batch_id'       => $data['batch_id'],
                'register_no'    => $data['register_no'],
                'phone'          => $data['phone'],
                'profile_photo'  => $photoPath,
            ]);
        });

        $student->load(['user:id,name,email,is_active', 'degree:id,name', 'department:id,name', 'batch:id,from_year,to_year']);

        return response()->json(['student' => $this->present($student)], 201);
    }

    public function show(Request $request, Student $student)
    {
        $collegeId = $this->collegeId($request);
        abort_unless($student->college_id === $collegeId, 404);

        $student->load(['user:id,name,email,is_active', 'degree:id,name', 'department:id,name', 'batch:id,from_year,to_year']);

        $results = \App\Models\StudentSubjectResult::where('student_id', $student->id)->get()->keyBy('subject_id');

        $semesters = Semester::with('subjects:id,code,name')
            ->where('college_id', $collegeId)
            ->where('degree_id', $student->degree_id)
            ->where('department_id', $student->department_id)
            ->where('batch_id', $student->batch_id)
            ->orderBy('semester_number')
            ->get()
            ->map(fn (Semester $sem) => [
                'id'              => $sem->id,
                'semester_number' => $sem->semester_number,
                'subjects'        => $sem->subjects->map(fn ($sub) => [
                    'id' => $sub->id, 
                    'code' => $sub->code, 
                    'name' => $sub->name,
                    'status' => $results->get($sub->id)?->status ?? 'pending'
                ])->values(),
            ]);

        $data = $this->present($student);
        $data['semesters'] = $semesters;

        return response()->json(['student' => $data]);
    }

    public function destroy(Request $request, Student $student)
    {
        $collegeId = $this->collegeId($request);
        abort_unless($student->college_id === $collegeId, 404);

        if ($student->profile_photo) {
            Storage::disk('public')->delete($student->profile_photo);
        }

        User::destroy($student->user_id);

        return response()->json(['message' => 'Student deleted successfully.']);
    }

    public function updateSubjectStatus(Request $request, Student $student)
    {
        $collegeId = $this->collegeId($request);
        abort_unless($student->college_id === $collegeId, 404);

        $data = $request->validate([
            'semester_id' => ['required', 'exists:semesters,id'],
            'subject_id'  => ['required', 'exists:subjects,id'],
            'status'      => ['required', 'in:pending,pass,fail'],
        ]);

        $result = \App\Models\StudentSubjectResult::updateOrCreate(
            [
                'student_id' => $student->id,
                'semester_id' => $data['semester_id'],
                'subject_id' => $data['subject_id'],
            ],
            [
                'status' => $data['status'],
            ]
        );

        return response()->json(['message' => 'Status updated successfully.', 'result' => $result]);
    }

    private function present(Student $s): array
    {
        return [
            'id'          => $s->id,
            'name'        => $s->user->name,
            'email'       => $s->user->email,
            'phone'       => $s->phone,
            'register_no' => $s->register_no,
            'degree'      => $s->degree->name,
            'department'  => $s->department->name,
            'batch'       => "{$s->batch->from_year} - {$s->batch->to_year}",
            'photo_url'   => $s->profile_photo ? Storage::disk('public')->url($s->profile_photo) : null,
            'is_active'   => $s->user->is_active,
            'created_at'  => $s->created_at,
        ];
    }

    private function collegeId(Request $request): int
    {
        $user = $request->user();
        abort_unless($user?->role === 'college_admin' && $user->college_id, 403, 'Unauthorized.');

        return $user->college_id;
    }
}

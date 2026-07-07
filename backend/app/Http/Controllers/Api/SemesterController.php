<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SemesterController extends Controller
{
    public function index(Request $request)
    {
        $collegeId = $this->collegeId($request);

        $semesters = Semester::with(['degree:id,name', 'department:id,name', 'batch:id,from_year,to_year', 'subjects:id,code,name'])
            ->where('college_id', $collegeId)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Semester $s) => $this->present($s));

        return response()->json(['semesters' => $semesters]);
    }

    public function store(Request $request)
    {
        $collegeId = $this->collegeId($request);

        $data = $request->validate([
            'degree_id'        => ['required', Rule::exists('degrees', 'id')->where('college_id', $collegeId)],
            'department_id'    => ['required', Rule::exists('departments', 'id')->where('college_id', $collegeId)->where('degree_id', $request->input('degree_id'))],
            'batch_id'         => ['required', Rule::exists('batches', 'id')->where('college_id', $collegeId)],
            'semester_number'  => [
                'required', 'integer', 'min:1', 'max:8',
                Rule::unique('semesters')
                    ->where('degree_id', $request->input('degree_id'))
                    ->where('department_id', $request->input('department_id'))
                    ->where('batch_id', $request->input('batch_id')),
            ],
            'subject_ids'      => ['required', 'array', 'min:1'],
            'subject_ids.*'    => ['integer', Rule::exists('subjects', 'id')->where('college_id', $collegeId)],
        ]);

        $semester = Semester::create([
            'college_id'      => $collegeId,
            'degree_id'       => $data['degree_id'],
            'department_id'   => $data['department_id'],
            'batch_id'        => $data['batch_id'],
            'semester_number' => $data['semester_number'],
        ]);

        $semester->subjects()->sync($data['subject_ids']);
        $semester->load(['degree:id,name', 'department:id,name', 'batch:id,from_year,to_year', 'subjects:id,code,name']);

        return response()->json(['semester' => $this->present($semester)], 201);
    }

    public function destroy(Request $request, Semester $semester)
    {
        $collegeId = $this->collegeId($request);
        abort_unless($semester->college_id === $collegeId, 404);

        $semester->delete();

        return response()->json(['message' => 'Semester deleted successfully.']);
    }

    private function present(Semester $s): array
    {
        return [
            'id'              => $s->id,
            'degree_id'       => $s->degree_id,
            'degree'          => $s->degree->name,
            'department_id'   => $s->department_id,
            'department'      => $s->department->name,
            'batch_id'        => $s->batch_id,
            'batch'           => "{$s->batch->from_year} - {$s->batch->to_year}",
            'semester_number' => $s->semester_number,
            'subjects'        => $s->subjects->map(fn ($sub) => ['id' => $sub->id, 'code' => $sub->code, 'name' => $sub->name])->values(),
        ];
    }

    private function collegeId(Request $request): int
    {
        $user = $request->user();
        abort_unless(in_array($user?->role, ['college_admin', 'admin_employee']) && $user->college_id, 403, 'Unauthorized.');

        return $user->college_id;
    }
}

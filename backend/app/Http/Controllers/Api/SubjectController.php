<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SubjectController extends Controller
{
    public function index(Request $request)
    {
        $subjects = Subject::where('college_id', $this->collegeId($request))
            ->orderBy('code')
            ->get();

        return response()->json(['subjects' => $subjects]);
    }

    public function store(Request $request)
    {
        $collegeId = $this->collegeId($request);

        $data = $request->validate([
            'code' => [
                'required', 'string', 'max:50',
                Rule::unique('subjects')->where('college_id', $collegeId),
            ],
            'name' => ['required', 'string', 'max:255'],
        ]);

        $subject = Subject::create([
            'college_id' => $collegeId,
            'code'       => $data['code'],
            'name'       => $data['name'],
        ]);

        return response()->json(['subject' => $subject], 201);
    }

    public function update(Request $request, Subject $subject)
    {
        $collegeId = $this->collegeId($request);
        abort_unless($subject->college_id === $collegeId, 404);

        $data = $request->validate([
            'code' => [
                'required', 'string', 'max:50',
                Rule::unique('subjects')->where('college_id', $collegeId)->ignore($subject->id),
            ],
            'name' => ['required', 'string', 'max:255'],
        ]);

        $subject->update($data);

        return response()->json(['subject' => $subject]);
    }

    public function destroy(Request $request, Subject $subject)
    {
        $collegeId = $this->collegeId($request);
        abort_unless($subject->college_id === $collegeId, 404);

        $subject->delete();

        return response()->json(['message' => 'Subject deleted successfully.']);
    }

    public function students(Request $request, Subject $subject)
    {
        $collegeId = $this->collegeId($request);
        abort_unless($subject->college_id === $collegeId, 404);

        $semesters = $subject->semesters()->get();

        $presentBatchRegs = collect();
        foreach ($semesters as $sem) {
            $students = \App\Models\Student::where('college_id', $collegeId)
                ->where('degree_id', $sem->degree_id)
                ->where('department_id', $sem->department_id)
                ->where('batch_id', $sem->batch_id)
                ->pluck('register_no');
            $presentBatchRegs = $presentBatchRegs->merge($students);
        }

        $previousBatchRegs = \App\Models\StudentSubjectResult::with('student')
            ->where('subject_id', $subject->id)
            ->where('status', 'fail')
            ->get()
            ->pluck('student.register_no')
            ->filter();

        return response()->json([
            'present_batch' => $presentBatchRegs->unique()->values(),
            'previous_batch' => $previousBatchRegs->unique()->values(),
        ]);
    }

    private function collegeId(Request $request): int
    {
        $user = $request->user();
        abort_unless(in_array($user?->role, ['college_admin', 'admin_employee']) && $user->college_id, 403, 'Unauthorized.');

        return $user->college_id;
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DepartmentController extends Controller
{
    public function index(Request $request)
    {
        $departments = Department::with('degree:id,name')
            ->where('college_id', $this->collegeId($request))
            ->orderBy('name')
            ->get()
            ->map(fn (Department $d) => [
                'id'         => $d->id,
                'degree_id'  => $d->degree_id,
                'degreeName' => $d->degree->name,
                'name'       => $d->name,
            ]);

        return response()->json(['departments' => $departments]);
    }

    public function store(Request $request)
    {
        $collegeId = $this->collegeId($request);

        $data = $request->validate([
            'degree_id' => [
                'required',
                Rule::exists('degrees', 'id')->where('college_id', $collegeId),
            ],
            'name' => [
                'required', 'string', 'max:255',
                Rule::unique('departments')->where('degree_id', $request->input('degree_id')),
            ],
        ]);

        $department = Department::create([
            'college_id' => $collegeId,
            'degree_id'  => $data['degree_id'],
            'name'       => $data['name'],
        ]);

        $department->load('degree:id,name');

        return response()->json(['department' => [
            'id'         => $department->id,
            'degree_id'  => $department->degree_id,
            'degreeName' => $department->degree->name,
            'name'       => $department->name,
        ]], 201);
    }

    public function update(Request $request, Department $department)
    {
        $collegeId = $this->collegeId($request);
        abort_unless($department->college_id === $collegeId, 404);

        $data = $request->validate([
            'degree_id' => [
                'required',
                Rule::exists('degrees', 'id')->where('college_id', $collegeId),
            ],
            'name' => [
                'required', 'string', 'max:255',
                Rule::unique('departments')->where('degree_id', $request->input('degree_id'))->ignore($department->id),
            ],
        ]);

        $department->update($data);
        $department->load('degree:id,name');

        return response()->json(['department' => [
            'id'         => $department->id,
            'degree_id'  => $department->degree_id,
            'degreeName' => $department->degree->name,
            'name'       => $department->name,
        ]]);
    }

    public function destroy(Request $request, Department $department)
    {
        $collegeId = $this->collegeId($request);
        abort_unless($department->college_id === $collegeId, 404);

        $department->delete();

        return response()->json(['message' => 'Department deleted successfully.']);
    }

    private function collegeId(Request $request): int
    {
        $user = $request->user();
        abort_unless($user?->role === 'college_admin' && $user->college_id, 403, 'Unauthorized.');

        return $user->college_id;
    }
}

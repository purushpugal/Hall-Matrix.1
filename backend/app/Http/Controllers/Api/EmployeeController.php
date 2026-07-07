<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $collegeId = $this->collegeId($request);
        
        $employees = User::where('college_id', $collegeId)
            ->whereIn('role', ['admin_employee', 'tutor'])
            ->orderByDesc('created_at')
            ->get();
            
        return response()->json(['employees' => $employees]);
    }

    public function store(Request $request)
    {
        $collegeId = $this->collegeId($request);

        if ($request->has('email')) {
            $request->merge(['email' => strtolower(trim($request->email))]);
        }

        $data = $request->validate([
            'name'      => ['required', 'string', 'max:255'],
            'email'     => ['required', 'email', 'max:255', 'unique:users,email'],
            'password'  => ['required', 'string', 'min:8'],
            'role'      => ['required', 'in:admin_employee,tutor'],
            'is_active' => ['boolean'],
        ]);

        $employee = User::create([
            'name'       => $data['name'],
            'email'      => $data['email'],
            'password'   => Hash::make($data['password']),
            'role'       => $data['role'],
            'is_active'  => $data['is_active'] ?? true,
            'college_id' => $collegeId,
        ]);

        return response()->json(['employee' => $employee], 201);
    }

    public function update(Request $request, User $employee)
    {
        $collegeId = $this->collegeId($request);
        abort_unless($employee->college_id === $collegeId, 404);

        if ($request->has('email')) {
            $request->merge(['email' => strtolower(trim($request->email))]);
        }

        $data = $request->validate([
            'name'      => ['required', 'string', 'max:255'],
            'email'     => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($employee->id)],
            'password'  => ['nullable', 'string', 'min:8'],
            'role'      => ['required', 'in:admin_employee,tutor'],
            'is_active' => ['boolean'],
        ]);

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $employee->update($data);

        return response()->json(['employee' => $employee]);
    }

    public function destroy(Request $request, User $employee)
    {
        $collegeId = $this->collegeId($request);
        abort_unless($employee->college_id === $collegeId, 404);

        $employee->delete();
        return response()->json(['message' => 'Employee deleted successfully.']);
    }

    private function collegeId(Request $request): int
    {
        $user = $request->user();
        abort_unless(in_array($user?->role, ['college_admin', 'admin_employee']) && $user->college_id, 403, 'Unauthorized.');
        return $user->college_id;
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\College;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class CollegeController extends Controller
{
    public function index(Request $request)
    {
        $this->authorizeSuperAdmin($request);

        $colleges = College::withCount('users')
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['colleges' => $colleges]);
    }

    public function store(Request $request)
    {
        if ($request->has('email')) {
            $request->merge(['email' => strtolower(trim($request->email))]);
        }

        $data = $request->validate([
            'college_name'    => 'required|string|max:255',
            'college_code'    => 'required|string|max:50|unique:colleges,college_code',
            'contact_person'  => 'required|string|max:255',
            'contact_number'  => 'required|digits:10',
            'email'           => 'required|email|max:255|unique:colleges,email|unique:users,email',
            'password'        => 'required|string|min:8|confirmed',
        ]);

        $college = DB::transaction(function () use ($data) {
            $college = College::create([
                'college_name'   => $data['college_name'],
                'college_code'   => $data['college_code'],
                'contact_person' => $data['contact_person'],
                'contact_number' => $data['contact_number'],
                'email'          => $data['email'],
                'password'       => Hash::make($data['password']),
                'is_active'      => true,
            ]);

            User::create([
                'name'       => $data['contact_person'],
                'email'      => $data['email'],
                'password'   => Hash::make($data['password']),
                'role'       => 'college_admin',
                'is_active'  => true,
                'college_id' => $college->id,
            ]);

            return $college;
        });

        return response()->json([
            'message' => 'Registration successful. You can now log in to manage your college.',
            'college' => $college,
        ], 201);
    }

    public function updateStatus(Request $request, College $college)
    {
        $this->authorizeSuperAdmin($request);

        $data = $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $college->update(['is_active' => $data['is_active']]);
        $college->users()->where('role', 'college_admin')->update(['is_active' => $data['is_active']]);

        return response()->json(['college' => $college]);
    }

    public function destroy(Request $request, College $college)
    {
        $this->authorizeSuperAdmin($request);

        DB::transaction(function () use ($college) {
            $college->users()->delete();
            $college->delete();
        });

        return response()->json(['message' => 'College deleted successfully.']);
    }

    private function authorizeSuperAdmin(Request $request): void
    {
        abort_unless($request->user()?->role === 'super_admin', 403, 'Unauthorized.');
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Hall;
use Illuminate\Http\Request;

class HallController extends Controller
{
    public function index(Request $request)
    {
        $collegeId = $this->collegeId($request);
        $halls = Hall::where('college_id', $collegeId)->orderBy('name')->get();
        return response()->json(['halls' => $halls]);
    }

    public function store(Request $request)
    {
        $collegeId = $this->collegeId($request);
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'capacity' => ['required', 'integer', 'min:1'],
            'rows' => ['required', 'integer', 'min:1'],
            'cols' => ['required', 'integer', 'min:1'],
        ]);
        
        $data['college_id'] = $collegeId;
        $hall = Hall::create($data);

        return response()->json(['hall' => $hall], 201);
    }

    public function update(Request $request, Hall $hall)
    {
        $collegeId = $this->collegeId($request);
        abort_unless($hall->college_id === $collegeId, 404);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'capacity' => ['required', 'integer', 'min:1'],
            'rows' => ['required', 'integer', 'min:1'],
            'cols' => ['required', 'integer', 'min:1'],
        ]);

        $hall->update($data);
        return response()->json(['hall' => $hall]);
    }

    public function destroy(Request $request, Hall $hall)
    {
        $collegeId = $this->collegeId($request);
        abort_unless($hall->college_id === $collegeId, 404);

        $hall->delete();
        return response()->json(['message' => 'Hall deleted successfully.']);
    }

    private function collegeId(Request $request): int
    {
        $user = $request->user();
        abort_unless(in_array($user?->role, ['college_admin', 'admin_employee']) && $user->college_id, 403, 'Unauthorized.');
        return $user->college_id;
    }
}

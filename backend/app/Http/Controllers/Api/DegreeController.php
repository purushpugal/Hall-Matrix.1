<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Degree;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DegreeController extends Controller
{
    public function index(Request $request)
    {
        $degrees = Degree::withCount('departments')
            ->where('college_id', $this->collegeId($request))
            ->orderBy('name')
            ->get();

        return response()->json(['degrees' => $degrees]);
    }

    public function store(Request $request)
    {
        $collegeId = $this->collegeId($request);

        $data = $request->validate([
            'name' => [
                'required', 'string', 'max:255',
                Rule::unique('degrees')->where('college_id', $collegeId),
            ],
        ]);

        $degree = Degree::create(['college_id' => $collegeId, 'name' => $data['name']]);

        return response()->json(['degree' => $degree], 201);
    }

    public function update(Request $request, Degree $degree)
    {
        $collegeId = $this->collegeId($request);
        abort_unless($degree->college_id === $collegeId, 404);

        $data = $request->validate([
            'name' => [
                'required', 'string', 'max:255',
                Rule::unique('degrees')->where('college_id', $collegeId)->ignore($degree->id),
            ],
        ]);

        $degree->update(['name' => $data['name']]);

        return response()->json(['degree' => $degree]);
    }

    public function destroy(Request $request, Degree $degree)
    {
        $collegeId = $this->collegeId($request);
        abort_unless($degree->college_id === $collegeId, 404);

        if ($degree->departments()->exists()) {
            return response()->json([
                'message' => 'This degree cannot be deleted because it has departments linked to it.',
            ], 409);
        }

        $degree->delete();

        return response()->json(['message' => 'Degree deleted successfully.']);
    }

    private function collegeId(Request $request): int
    {
        $user = $request->user();
        abort_unless($user?->role === 'college_admin' && $user->college_id, 403, 'Unauthorized.');

        return $user->college_id;
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class BatchController extends Controller
{
    public function index(Request $request)
    {
        $batches = Batch::where('college_id', $this->collegeId($request))
            ->orderByDesc('from_year')
            ->get();

        return response()->json(['batches' => $batches]);
    }

    public function store(Request $request)
    {
        $collegeId = $this->collegeId($request);

        $data = $request->validate([
            'from_year' => ['required', 'integer', 'digits:4'],
            'to_year'   => [
                'required', 'integer', 'digits:4',
                Rule::unique('batches')->where('college_id', $collegeId)
                    ->where('from_year', $request->input('from_year')),
            ],
        ]);

        $this->validateYearOrder($request);

        $batch = Batch::create([
            'college_id' => $collegeId,
            'from_year'  => $data['from_year'],
            'to_year'    => $data['to_year'],
        ]);

        return response()->json(['batch' => $batch], 201);
    }

    public function update(Request $request, Batch $batch)
    {
        $collegeId = $this->collegeId($request);
        abort_unless($batch->college_id === $collegeId, 404);

        $data = $request->validate([
            'from_year' => ['required', 'integer', 'digits:4'],
            'to_year'   => [
                'required', 'integer', 'digits:4',
                Rule::unique('batches')->where('college_id', $collegeId)
                    ->where('from_year', $request->input('from_year'))
                    ->ignore($batch->id),
            ],
        ]);

        $this->validateYearOrder($request);

        $batch->update($data);

        return response()->json(['batch' => $batch]);
    }

    public function destroy(Request $request, Batch $batch)
    {
        $collegeId = $this->collegeId($request);
        abort_unless($batch->college_id === $collegeId, 404);

        $batch->delete();

        return response()->json(['message' => 'Batch deleted successfully.']);
    }

    private function validateYearOrder(Request $request): void
    {
        if ((int) $request->input('to_year') <= (int) $request->input('from_year')) {
            throw ValidationException::withMessages([
                'to_year' => ['To Year must be greater than From Year.'],
            ]);
        }
    }

    private function collegeId(Request $request): int
    {
        $user = $request->user();
        abort_unless($user?->role === 'college_admin' && $user->college_id, 403, 'Unauthorized.');

        return $user->college_id;
    }
}

<?php

use App\Models\College;
use App\Models\Batch;

$colleges = College::all();
$batchesToCreate = [
    ['from_year' => 2021, 'to_year' => 2025],
    ['from_year' => 2022, 'to_year' => 2026],
    ['from_year' => 2023, 'to_year' => 2027],
    ['from_year' => 2024, 'to_year' => 2028],
];

foreach ($colleges as $college) {
    foreach ($batchesToCreate as $batchData) {
        Batch::updateOrCreate(
            [
                'college_id' => $college->id,
                'from_year' => $batchData['from_year'],
                'to_year' => $batchData['to_year'],
            ],
            $batchData
        );
    }
    echo "Created 4 batches for college: " . $college->college_name . "\n";
}

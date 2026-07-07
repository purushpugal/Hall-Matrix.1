<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BatchController;
use App\Http\Controllers\Api\CollegeController;
use App\Http\Controllers\Api\DegreeController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\SemesterController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\HallController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('login',  [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('me',       [AuthController::class, 'me']);
        Route::post('logout',  [AuthController::class, 'logout']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('student-profile', [StudentController::class, 'myProfile']);
});

Route::post('colleges', [CollegeController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('colleges', [CollegeController::class, 'index']);
    Route::patch('colleges/{college}/status', [CollegeController::class, 'updateStatus']);
    Route::delete('colleges/{college}', [CollegeController::class, 'destroy']);

    Route::apiResource('employees', EmployeeController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::apiResource('degrees', DegreeController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::apiResource('departments', DepartmentController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::apiResource('batches', BatchController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::apiResource('subjects', SubjectController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::get('subjects/{subject}/students', [SubjectController::class, 'students']);
    Route::apiResource('students', StudentController::class)->only(['index', 'show', 'store', 'destroy']);
    Route::put('students/{student}/subject-status', [StudentController::class, 'updateSubjectStatus']);
    Route::apiResource('semesters', SemesterController::class)->only(['index', 'store', 'destroy']);
    Route::apiResource('halls', HallController::class)->only(['index', 'store', 'update', 'destroy']);
});

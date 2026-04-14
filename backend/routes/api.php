<?php

use App\Http\Controllers\MedicineController;
use Illuminate\Support\Facades\Route;

Route::get('/medicines', [MedicineController::class, 'index']);
Route::post('/medicines', [MedicineController::class, 'store']);
Route::get('/medicines/{medicine}', [MedicineController::class, 'show']);
Route::put('/medicines/{medicine}', [MedicineController::class, 'update']);
Route::delete('/medicines/{medicine}', [MedicineController::class, 'destroy']);
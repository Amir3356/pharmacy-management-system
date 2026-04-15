<?php

use App\Http\Controllers\MedicineController;
use App\Http\Controllers\AuthRecoveryController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/forgot-credentials', [AuthRecoveryController::class, 'sendVerificationEmail']);

Route::get('/medicines', [MedicineController::class, 'index']);
Route::post('/medicines', [MedicineController::class, 'store']);
Route::get('/medicines/{id}', [MedicineController::class, 'show'])->whereNumber('id');
Route::put('/medicines/{id}', [MedicineController::class, 'update'])->whereNumber('id');
Route::delete('/medicines/{id}', [MedicineController::class, 'destroy'])->whereNumber('id');
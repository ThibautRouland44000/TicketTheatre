<?php

use App\Http\Controllers\Api\ValidationController;
use Illuminate\Support\Facades\Route;

// Route essentielle appelée par le Auth Service
Route::post('/validate-credentials', [ValidationController::class, 'validateCredentials']);

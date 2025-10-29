<?php

use Illuminate\Support\Facades\Route;

// Route de base (pour vérifier que le service est actif)
Route::get('/', function () {
    return response('Auth Service Running', 200);
});

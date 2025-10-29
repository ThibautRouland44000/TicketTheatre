<?php

use Illuminate\Support\Facades\Route;

// Route de base (pour vérifier que le service est actif)
Route::get('/', function () {
    return response('Core Service Running', 200);
});

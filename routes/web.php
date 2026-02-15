<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;


Route::get('/', function () {
    return Inertia::render('dashboard');
})->name('dashboard');



require __DIR__.'/auth.php';
// require __DIR__.'/api.php';
require __DIR__.'/app.php';





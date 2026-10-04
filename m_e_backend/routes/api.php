<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApiController;

Route::get('/users', [ApiController::class, 'getUsers']);
Route::post('/users', [ApiController::class, 'saveUser']);
Route::delete('/users/{id}', [ApiController::class, 'deleteUser']);

Route::get('/roles', [ApiController::class, 'getRoles']);
Route::post('/roles', [ApiController::class, 'saveRole']);
Route::delete('/roles/{id}', [ApiController::class, 'deleteRole']);

Route::get('/locations', [ApiController::class, 'getLocations']);
Route::post('/locations', [ApiController::class, 'saveLocation']);
Route::post('/roles/{id}/users', [ApiController::class, 'assignUsersToRole']);
Route::post('/login', [ApiController::class, 'login']);

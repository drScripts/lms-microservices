<?php

use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::prefix('orders')->controller(OrderController::class)->group(function () {
    Route::post('/', 'create');
    Route::get('/', 'index');
    Route::post('/notification', 'notification');
    Route::patch('/recreate', 'recreate');
});

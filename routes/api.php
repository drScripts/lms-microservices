<?php

use App\Http\Controllers\ChapterController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\ImageCourseController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\MentorController;
use App\Http\Controllers\UserCourseController;
use App\Models\Lesson;
use Illuminate\Http\Request;
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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});



Route::prefix('mentors')->controller(MentorController::class)->group(function () {
    Route::post('/', 'store');
    Route::patch('/{id}', 'update');
    Route::get("/", 'index');
    Route::get("/{id}", 'show');
    Route::delete('/{id}', 'destroy');
});

Route::prefix('chapters')->controller(ChapterController::class)->group(function () {
    Route::post('/', 'store');
    Route::patch('/{id}', 'update');
    Route::get("/", 'index');
    Route::get("/{id}", 'show');
    Route::delete("/{id}", 'destroy');
});

Route::prefix("lessons")->controller(LessonController::class)->group(function () {
    Route::post('/', 'store');
    Route::patch('/{id}', 'update');
    Route::get("/", 'index');
    Route::get("/{id}", 'show');
    Route::delete("/{id}", 'destroy');
});

Route::prefix('image-courses')->controller(ImageCourseController::class)->group(function () {
    Route::post('/', 'store');
    Route::delete('/{id}', 'destroy');
});

Route::prefix('user-courses')->controller(UserCourseController::class)->group(function () {
    Route::get('/', 'index');
    Route::post('/', 'store');
});

Route::get('/test', [UserCourseController::class, 'test']);
Route::controller(CourseController::class)->group(function () {
    Route::get('/', 'index');
    Route::get("/{id}", 'show');
    Route::post('/', 'store');
    Route::patch("/{id}", 'update');
    Route::delete("/{id}", 'destroy');
});

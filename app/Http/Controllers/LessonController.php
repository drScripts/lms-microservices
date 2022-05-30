<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LessonController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $lessons = Lesson::query();

        if ($request->query('q')) {
            $query = $request->query('q');
            $lessons->where('name', 'like', "%$query%");
        }

        if ($request->query('chapter')) {
            $chapterId = $request->query("chapter");
            $lessons->where('chapter_id', $chapterId);
        }

        $lessons = $lessons->get();

        return response()->json([
            'status' => "success",
            'data' => $lessons
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $rules = [
            'name' => "string|required",
            'video' => "string|required|active_url",
            'chapter_id' => "integer|required|exists:chapters,id"
        ];

        $validation = Validator::make($request->all(), $rules);

        if ($validation->fails()) return response()->json([
            'status' => "error",
            'messages' => $validation->errors()->toArray()
        ], 400);

        $lesson = Lesson::create($request->all());


        return response()->json([
            'status' => 'created',
            'data' => $lesson
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int|string  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $lesson = Lesson::with('chapter')->find($id);

        if (!$lesson) return response()->json([
            'status' => "error",
            'message' => "Can't find lesson with that id"
        ], 404);

        return response()->json([
            'status' => 'success',
            'data' => $lesson,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request 
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, int|string $id)
    {

        $rules = [
            'name' => "string",
            'video' => "string|active_url",
            'chapter_id' => "integer|exists:chapters,id"
        ];

        $validation = Validator::make($request->all(), $rules);

        if ($validation->fails()) return response()->json([
            'status' => "error",
            'messages' => $validation->errors()->toArray()
        ], 400);

        $lesson = Lesson::find($id);

        if (!$lesson) return response()->json([
            'status' => "error",
            'message' => "Lesson not found!",
        ], 404);

        $lesson->fill($request->all());
        $lesson->save();


        return response()->json([
            'status' => "created",
            'data' => $lesson
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(int|string $id)
    {
        $lesson = Lesson::find($id);

        if (!$lesson) return response()->json([
            'status' => "error",
            'message' => "Can't find lesson with that id",
        ], 404);

        $lesson->delete();

        return response()->json([
            'status' => "created",
            'message' => "successfully delete lesson!"
        ], 201);
    }
}

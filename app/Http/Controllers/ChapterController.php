<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ChapterController extends Controller
{
    /**
     * Display a listing of the resource.
     *  
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $chapters = Chapter::query();

        if ($request->query('q')) {
            $query = $request->query('q');
            $chapters->where("name", "like", "%$query%");
        }

        if ($request->query('course')) {
            $course_id = $request->query("course");
            $chapters->where("course_id", $course_id);
        }

        $chapters = $chapters->with(["lessons", 'course'])->get();

        return response()->json([
            'status' => "success",
            'data' => $chapters
        ]);
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
            'name' => 'string|required',
            'course_id' => 'integer|required|exists:courses,id'
        ];

        $validation = Validator::make($request->all(), $rules);

        if ($validation->fails()) return response()->json([
            'status' => "error",
            'messages' => $validation->errors()->toArray()
        ], 400);

        $chapter  = Chapter::create($request->all());

        return response()->json([
            'status' => "created",
            'data' => $chapter
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Chapter  $chapter
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $chapter = Chapter::with(['course', 'lessons'])->find($id);

        if (!$chapter) return response()->json([
            'status' => "error",
            'message' => "Can't find chapter with that id",
        ], 404);

        return response()->json([
            'status' => "success",
            'data' => $chapter,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request 
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request,  $id)
    {
        $rules = [
            'name' => "string",
            'course_id' => "integer|exists:courses,id"
        ];

        $validation = Validator::make($request->all(), $rules);

        if ($validation->fails()) return response()->json([
            'status' => "error",
            'messages' => $validation->errors()->toArray(),
        ], 400);

        $chapter  = Chapter::find($id);

        if (!$chapter) return response()->json([
            'status' => "error",
            'message' => "Can't find chapter with that id"
        ], 404);

        $chapter->fill($request->all());
        $chapter->save();

        return response()->json([
            'status' => "created",
            'data' => $chapter
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $chapter = Chapter::find($id);

        if (!$chapter) return response()->json([
            'status' => "error",
            'message' => "Can't find chapter with that id"
        ], 404);

        $chapter->delete();

        return response()->json([
            'status' => "created",
            'message' => "Successfully delete chapter!",
        ], 201);
    }
}

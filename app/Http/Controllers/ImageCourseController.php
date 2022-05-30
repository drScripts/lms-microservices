<?php

namespace App\Http\Controllers;

use App\Models\ImageCourse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ImageCourseController extends Controller
{

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $rules = [
            'course_id' => "integer|required|exists:courses,id",
            'image' => "string|required|active_url"
        ];

        $validate = Validator::make($request->all(), $rules);

        if ($validate->fails()) return response()->json([
            'status' => "error",
            'messages' => $validate->errors()->toArray()
        ], 400);

        $imageCourse = ImageCourse::create($request->all());

        return response()->json([
            'status' => "created",
            'data' => $imageCourse
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     * 
     * @return \Illuminate\Http\Response
     */
    public function destroy(int|string $id)
    {
        $imageCourse = ImageCourse::find($id);

        if (!$imageCourse) return response()->json([
            'status' => "error",
            'message' => "Can't find image course with that id"
        ], 404);

        $imageCourse->delete();

        return response()->json([
            'status' => "created",
            'message' => "Successfully delete image course!"
        ], 201);
    }
}

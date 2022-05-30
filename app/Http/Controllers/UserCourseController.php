<?php

namespace App\Http\Controllers;

use App\Models\UserCourse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserCourseController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $userCourses = UserCourse::query();


        if ($request->query('user')) {
            $userId = $request->query('user');
            $userCourses->where('user_id', $userId);
        }

        $userCourses = $userCourses->with('course')->get();

        return response()->json([
            'status' => "success",
            'data' => $userCourses,
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
            'user_id' => 'integer|required',
            'course_id' => "integer|required|exists:courses,id",
        ];

        $validate = Validator::make($request->all(), $rules);

        if ($validate->fails()) return response()->json([
            'status' => "error",
            'messages' => $validate->errors()->toArray(),
        ]);

        $user = $this->getUser($request->user_id);

        if ($user['status_code'] != 200) return response()->json([
            'status' => "error",
            'message' => $user['message']
        ], $user['status_code']);

        $isAlreadyExists = UserCourse::where("user_id", $request->user_id)->where("course_id", $request->course_id)->exists();

        if ($isAlreadyExists) return response()->json([
            'status' => "error",
            'message' => "User already enroll to this course!"
        ], 409);

        $userCourse = UserCourse::create($request->all());

        return response()->json([
            'status' => "created",
            'data' => $userCourse,
        ], 201);
    }

    public function test()
    {
        $result = $this->getUsers([1, 2, 3, 4]);
        dd($result);
    }
}

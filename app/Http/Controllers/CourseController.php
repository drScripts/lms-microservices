<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Review;
use App\Models\UserCourse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $courses = Course::query();

        if ($request->query('q')) {
            $query = $request->query('q');
            $courses->where("name", 'like', "%$query%");
        }

        if ($request->query('status')) {
            $status = $request->query('status');
            $courses->where("status", $status);
        } else {
            $courses->where("status", 'published');
        }

        if ($request->query('level')) {
            $level = $request->query('level');
            $courses->where("level", $level);
        }

        if ($request->query('type')) {
            $type = $request->query('type');
            $courses->where("type", $type);
        }

        if ($request->query('startPrice')) {
            $startPrice = $request->query('startPrice');
            $courses->where("price", ">=", $startPrice);
        }

        if ($request->query('endPrice')) {
            $endPrice = $request->query("endPrice");
            $courses->where("price", "<=", $endPrice);
        }

        $courses->with(['mentor', 'images', 'chapters', 'reviews']);
        $courses = $courses->paginate(10);

        return response()->json([
            'status' => "succes",
            'data' => $courses,
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
            'name' => "string|required",
            'certificate' => "boolean",
            'thumbnail'  => "string|required|active_url",
            'type' => "in:premium,freemium,free",
            'status' => 'in:draft,published',
            'price' => "integer",
            'level' => "in:all_level,beginner,intermediate,advance",
            'description' => "string|required",
            'mentor_id' => "integer|required|exists:mentors,id",
        ];

        $validate = Validator::make($request->all(), $rules);

        if ($validate->fails()) return response()->json([
            'status' => "error",
            'messages' => $validate->errors()
        ], 400);

        $course = Course::create($request->all());

        return response()->json([
            'status' => "created",
            'data' => $course
        ], 201);
    }

    /**
     * Display the specified resource.
     * 
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $course = Course::with(['mentor', 'chapters.lessons', 'images'])->find($id);

        if (!$course) return response()->json([
            'status' => "error",
            'message' => "Can't find course with that id!",
        ], 404);


        $reviews = Review::where("course_id", $id)->get()->toArray();

        if ($reviews) {
            $userIds = array_column($reviews, 'user_id');
            $users = $this->getUsers($userIds);

            if ($users['status_code'] == 200) {
                foreach ($reviews as $key => $review) {
                    $userIndex = array_search($review['user_id'], array_column($users['data'], 'id'));
                    $reviews[$key]['user'] = $users['data'][$userIndex];
                }
            } else {
                $reviews = [];
            }
        }

        $totalStudent = UserCourse::where('course_id', $id)->count();
        $course['reviews'] = $reviews;
        $course['total_student'] = $totalStudent;

        return response()->json([
            'status' => 'success',
            'data' => $course,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request 
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $rules = [
            'name' => "string",
            'certificate' => "boolean",
            'thumbnail'  => "string|active_url",
            'type' => "in:premium,freemium,free",
            'status' => 'in:draft,published',
            'price' => "integer",
            'level' => "in:all_level,beginner,intermediate,advance",
            'description' => "string",
            'mentor_id' => "integer|exists:mentors,id",
        ];

        $validate = Validator::make($request->all(), $rules);

        if ($validate->fails()) return response()->json([
            'status' => "error",
            'messages' => $validate->errors()
        ], 400);

        $course = Course::find($id);


        if (!$course) return response()->json([
            'status' => "error",
            'message' => "Can't find course with that id"
        ], 404);

        $course->fill($request->all());
        $course->save();

        return response()->json([
            'status' => "success",
            'data' => $course,
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $course = Course::find($id);

        if (!$course) return response()->json([
            'status' => "error",
            'message' => "Can't find course with that id!",
        ], 404);

        $course->delete();

        return response()->json([
            'status' => "success",
            'message' => "Successfully delete course!"
        ], 201);
    }
}

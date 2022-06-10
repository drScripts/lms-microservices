<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $reviews = Review::query();

        if ($request->query('course_id')) {
            $reviews->where('course_id', $request->query('course_id'));
        }

        if ($request->query('user_id')) {
            $reviews->where("user_id", $request->query('user_id'));
        }

        $reviews = $reviews->with('course')->get();

        return response()->json([
            "status" => "success",
            "data" => $reviews
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
            'user_id' => "integer|required",
            "course_id" => "integer|exists:courses,id|required",
            "rating" => "integer|min:1|max:5|required",
            'note' => "string",
        ];

        $validate = Validator::make($request->all(), $rules);

        if ($validate->fails()) return response()->json([
            'status' => 'error',
            'messages' => $validate->errors()->toArray(),
        ], 400);

        $user = $this->getUser($request->user_id);

        if ($user['status_code'] != 200) return response()->json(([
            'status' => "error",
            'message' => "Can't find user with that id!",
        ]));

        $review = Review::create($request->all());

        return response()->json([
            'status' => "created",
            'data' => $review,
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  string|int $id
     * @return \Illuminate\Http\Response
     */
    public function show(string|int $id)
    {
        $review = Review::find($id);

        if (!$review) return response()->json([
            'status' => "error",
            'message' => "Can't find review record!"
        ], 404);


        return response()->json([
            'status' => "success",
            'data' => $review,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int $review
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, int $id)
    {
        $rules = [
            'user_id' => "integer",
            'course_id' => "integer|exists:courses,id",
            "rating" => "integer",
            "note" => "string",
        ];

        $validation = Validator::make($request->all(), $rules);

        if ($validation->fails()) return response()->json([
            'status' => 'error',
            'messages' => $validation->errors()->toArray(),
        ], 400);

        if ($request->user_id) {
            if (!$this->checkUser($request->user_id)) {
                return response()->json([
                    'status' => "error",
                    'message' => "Can't find user record with that id",
                ], 404);
            }
        }

        $review = Review::find($id);

        if (!$review) return response()->json([
            'status' => 'error',
            'message' => "Can't find review record!"
        ], 404);

        $review->fill($request->all());
        $review->save();

        return response()->json([
            'status' => 'created',
            'data' => $review
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  string|int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(int|string $id)
    {
        $review = Review::find($id);

        if (!$review) return response()->json([
            'status' => "error",
            'message' => "Can't find review record data!"
        ], 404);

        $review->delete();
        return response()->json([
            'status' => "success",
            'message' => "Review successfully deleted review record!",
        ]);
    }
}

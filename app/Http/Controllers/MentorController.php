<?php

namespace App\Http\Controllers;

use App\Models\Mentor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MentorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $mentors = Mentor::all();

        return response()->json([
            "status" => "success",
            'data' => $mentors,
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
            'profile' => "string|required|url",
            'email' => "string|email|required",
            'profession' => "string",
        ];

        $data = $request->all(['name', 'profile', 'email', 'profession']);

        $validate = Validator::make($data, $rules);

        if ($validate->fails()) return response()->json([
            'status' => "error",
            'messages' =>  $validate->errors()->toArray(),
        ], 400);

        $mentor = Mentor::create($data);

        return response()->json([
            'status' => "succes",
            'data' => $mentor,
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $mentor = Mentor::find($id);

        if (!$mentor) return response()->json([
            'status' => "error",
            'message' => "Can't find mentor with that id"
        ], 404);

        return response()->json([
            'status' => "success",
            'data' => $mentor
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
            'profile' => "string|active_url",
            'email' => "string|email",
            'profession' => "string"
        ];

        $data = $request->all();

        $validation = Validator::make($data, $rules);

        if ($validation->fails()) return response()->json([
            'status' => "error",
            'messages' => $validation->errors()->toArray(),
        ], 400);

        $mentor = Mentor::find($id);

        if (!$mentor) return response()->json([
            'status' => "error",
            'messages' => "Can't find mentor with that id!",
        ], 404);


        $mentor->fill($data);
        $mentor->save();

        return response()->json([
            'status' => "ok",
            'data' => $mentor,
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $mentor = Mentor::find($id);

        if (!$mentor) return response()->json([
            'status' => "error",
            'messages' => "Can't find mentor with that id!",
        ], 404);

        $mentor->delete();

        return response()->json([
            'status' => "error",
            'message' => "Mentor successfully deleted!",
        ], 201);
    }
}

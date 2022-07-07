<?php

namespace App\Http\Service;

use Illuminate\Support\Facades\Http;

trait Service
{
    public function getUserById(int $id): array
    {
        $response = Http::get(env("USER_SERVICE_URL") . "/$id");

        if ($response->ok()) {
            return  [
                'status' => "success",
                'code' => $response->status(),
                'data' => $response['data']['user'],
            ];
        } else {
            return [
                'status' => "error",
                'code' => $response->status(),
                'message' => $response->status() == 500 ? "User service not available" : $response['message']
            ];
        }
    }


    public function getCourseById(int $id): array
    {
        $response = Http::get(env("COURSE_SERVICE_URL") . "/$id");


        if ($response->ok()) {
            return  [
                'status' => "success",
                'code' => $response->status(),
                'data' => $response['data'],
            ];
        } else {
            return [
                'status' => "error",
                'code' => $response->status(),
                "message" => $response->status() == 500 ? "User service not available" : $response['message']
            ];
        }
    }
}

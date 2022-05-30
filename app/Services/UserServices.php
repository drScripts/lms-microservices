<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

trait UserServices
{
    private $userService;

    public function __construct()
    {
        $this->userService = Http::timeout(10)->withOptions([
            'base_uri' => env("USER_SERVICE_URL"),
        ]);
    }

    public function getUser(int $userId): array
    {
        try {
            $response = $this->userService->get("/$userId");

            if ($response->ok()) {
                return [
                    'status_code' => $response->status(),
                    'data' => $response['data']['user'],
                ];
            } else {
                return [
                    'status_code' => $response->status(),
                    'message' => $response['message'],
                ];
            }
        } catch (Exception $err) {
            Log::error($err->getMessage(), ['user service error']);
            return [
                'status_code' => 500,
                'message' => "User service unavailable"
            ];
        }
    }

    public function getUsers(array $userId): array
    {
        try {
            $response = $this->userService->get("/", [
                'user_ids' => $userId,
            ]);

            if ($response->ok()) {
                return [
                    'status_code' => $response->status(),
                    'data' => $response['data']['users'],
                ];
            } else {
                return [
                    'status_code' => $response->status(),
                    'message' => $response['message'],
                ];
            }
        } catch (Exception $err) {
            Log::error($err->getMessage(), ['user service error']);

            return [
                'status_code' => 500,
                'message' => "User service unavailable"
            ];
        }
    }
}

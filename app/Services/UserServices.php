<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

trait UserServices
{
    private $userService;

    public function __construct()
    {
        $this->userService = Http::withOptions([
            'base_uri' => env("USER_SERVICE_URL"),
        ]);
    }

    public function getUser(int $userId): array
    {
        $response = $this->userService->get("/$userId");

        if ($response->ok()) {
            return $response['data']['user'];
        }

        return [];
    }

    public function getUsers(array $userId): array
    {
        $response = $this->userService->get("/", [
            'user_ids' => $userId,
        ]);

        if ($response->ok()) {
            return $response['data']['users'];
        }

        return [];
    }
}

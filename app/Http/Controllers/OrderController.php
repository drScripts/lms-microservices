<?php

namespace App\Http\Controllers;

use App\Http\Service\MidtransService;
use App\Http\Service\Service;
use App\Models\Order;
use App\Models\PaymentLog;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    use Service, MidtransService;

    public function index(Request $request)
    {
        $userId = $request->query('userId');
        $orders = Order::query();

        if ($userId) {
            $orders->where('userId', $userId);
        }

        $orders = $orders->get();

        return response()->json([
            'status' => "success",
            'data' => $orders,
        ]);
    }

    public function create(Request $request)
    {
        try {
            $rules = [
                'userId' => 'integer|required',
                "courseId" => "integer|required",
            ];

            $validation = Validator::make($request->all(), $rules);

            if ($validation->fails()) return response()->json([
                'status' => "error",
                'messages' => $validation->errors()->toArray()
            ]);

            $user = $this->getUserById($request->userId);

            if ($user['status'] != 'success') return response()->json([
                'status' => "error",
                'message' => $user['message']
            ], $user['code']);


            $course = $this->getCourseById($request->courseId);

            if ($course['status'] != 'success') return response()->json([
                'status' => "error",
                'message' => $course['message']
            ], $course['code']);


            $order = Order::create([
                'userId' => $request->userId,
                'courseId' => $request->courseId,
                'status' => "PENDING"
            ]);

            $payload = $this->getMidtransPayload($user['data'], $course['data'], $order);


            $res = $this->getMidtransSnap($payload);

            $order->metadata = $payload;
            $order->paymentUrl = $res;

            $order->save();

            return response()->json([
                'status' => "created",
                "data" => $order
            ], 201);
        } catch (Exception $err) {
            return response()->json([
                'status' => "error",
                'message' => $err->getMessage(),
            ], 500);
        }
    }

    public function recreate(Request $request)
    {
        try {
            $rules = [
                "orderId" => 'integer|required'
            ];

            $validation = Validator::make($request->all(), $rules);

            if ($validation->fails()) return response()->json([
                'status' => "error",
                'messages' => $validation->errors()->toArray(),
            ], 400);

            $order = Order::find($request->orderId);

            if (!$order) return response()->json([
                'status' => "error",
                'message' => "Can't find order with that id!",
            ], 404);

            if ($order != "EXPIREDCANCEL") return response()->json([
                'status' => "error",
                'message' => "Your order already successfully!"
            ], 400);

            $userId = $order->userId;
            $courseId = $order->courseId;

            $user = $this->getUserById($userId);

            if ($user['status'] != 'success') return response()->json([
                'status' => "error",
                'message' => "Can't find user with that id!"
            ], 404);

            $course = $this->getCourseById($courseId);

            if ($course['status'] != 'success') return response()->json([
                'status' => "error",
                'message' => "Can't find course with that id!"
            ], 404);

            $payload = $this->getMidtransPayload($user['data'], $course['data'], $order);

            $midtransResponse = $this->getMidtransSnap($payload);

            $order->metadata = $payload;
            $order->paymentUrl = $midtransResponse;

            $order->save();

            return response()->json([
                'status' => "error",
                'data' => $order
            ], 201);
        } catch (Exception $err) {
            Log::alert($err->getMessage());
            return response()->json([
                'status' => "error",
                'message' => $err->getMessage()
            ], 500);
        }
    }

    public function notification(Request $request)
    {
        try {
            $orderId = $request->order_id;
            $statusCode = $request->status_code;
            $grossAmount = $request->gross_amount;
            $serverKey = env("MIDTRANS_SERVER_KEY");
            $midtransSignature = $request->signature_key;

            $signatureKey = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);

            if ($midtransSignature != $signatureKey) return response()->json([
                'status' => "error",
                'message' => "invalid signature key!",
            ], 403);

            $realOrderId = $this->getRealOrderId($orderId);

            $order = Order::find($realOrderId);

            if (!$order) return response()->json([
                'status' => "error",
                'message' => "Invalid body request!"
            ], 400);

            $transactionStatus = '';
            $transaction = $request->transaction_status;
            $type = $request->payment_type;
            $fraud = $request->fraud_status;

            if ($transaction == 'capture') {
                if ($type == 'credit_card') {
                    if ($fraud == 'challenge') {
                        $transactionStatus = 'PENDING';
                    } else {
                        $transactionStatus = 'SUCCESS';
                    }
                }
            } else if ($transaction == 'settlement') {
                $transactionStatus = 'SUCCESS';
            } else if ($transaction == 'pending') {
                $transactionStatus = 'PENDING';
            } else if ($transaction == 'deny') {
                $transactionStatus = 'EXPIREDCANCEL';
            } else if ($transaction == 'expire') {
                $transactionStatus = 'EXPIREDCANCEL';
            } else if ($transaction == 'cancel') {
                $transactionStatus = 'EXPIREDCANCEL';
            }

            $order->status = $transactionStatus;
            $order->save();

            PaymentLog::create([
                'status' => $transactionStatus,
                'paymentType' => $type,
                'orderId' => $realOrderId,
                'rawResponse' => json_encode($request->all()),
            ]);

            return response()->json([
                'status' => "success",
                "data" => $order,
            ]);
        } catch (Exception $err) {
            Log::error($err->getMessage());
            return response()->json([
                'status' => "error",
                "message" => "Internal server error",
            ], 500);
        }
    }


    protected function getRealOrderId(string $orderId): string
    {
        $str = str_replace('#', '', $orderId);
        $str = explode('-', $str);
        return $str[array_key_last($str)];
    }

    protected function getMidtransPayload(array $user, array $course, object $order)
    {
        $orderId = '#' . $this->generateRandomString(3) . "-" . $order->id;

        $tax = (int)$course['price'] * ((int)env('APP_TAX') / 100);
        $total = (int)$course['price'] + $tax;

        $payload = [
            "transaction_details" => [
                "order_id" => $orderId,
                "gross_amount" => $total
            ],
            "item_details" => [[
                'id' => $course['id'],
                'price' => $course['price'],
                'quantity' => 1,
                'name' => $course['name'],
                'category' => 'course',
                'brand' => "DRLMS"
            ], [
                'id' => "TAX",
                'price' => $tax,
                'quantity' => 1,
                'name' => env('APP_TAX') . '% Tax'
            ]],
            'customer_details' => [
                "first_name" => $user['name'],
                "email" => $user['email'],
            ]
        ];

        return $payload;
    }

    protected function generateRandomString($length = 10)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }
}

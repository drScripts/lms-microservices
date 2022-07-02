<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'status',
        "paymentType",
        "orderId",
        "rawResponse"
    ];

    protected $casts = [
        'created_at' => 'timestamp',
        "updated_at" => "timestamp"
    ];
}

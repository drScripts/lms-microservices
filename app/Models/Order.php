<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;


    protected $fillable = [
        'userId', 'courseId', "status", "paymentUrl", "metadata"
    ];

    protected $casts = [
        'created_at' => 'timestamp',
        "updated_at" => "timestamp",
        "deleted_at" => "timestamp"
    ];
}

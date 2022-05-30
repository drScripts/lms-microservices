<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Http;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'course_id',
        'rating',
        'note'
    ];

    protected $casts = [
        'created_at' => "timestamp",
        'updated_at' => "timestamp",
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}

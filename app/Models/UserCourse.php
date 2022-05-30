<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserCourse extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'course_id',
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

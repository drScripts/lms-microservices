<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImageCourse extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'image'
    ];

    protected $casts = [
        'created_at' => "timestamp",
        'updated_at' => 'timestamp'
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    use HasFactory;

    protected $fillable = [
        'college_id',
        'exam_name',
        'exam_date',
        'hall_id',
        'allocation_method',
    ];

    public function college()
    {
        return $this->belongsTo(College::class);
    }

    public function hall()
    {
        return $this->belongsTo(Hall::class);
    }

    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'exam_subject');
    }

    public function seats()
    {
        return $this->hasMany(ExamStudentSeat::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Semester extends Model
{
    protected $fillable = ['college_id', 'degree_id', 'department_id', 'batch_id', 'semester_number'];

    public function college()
    {
        return $this->belongsTo(College::class);
    }

    public function degree()
    {
        return $this->belongsTo(Degree::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    public function subjects()
    {
        return $this->belongsToMany(Subject::class);
    }
}

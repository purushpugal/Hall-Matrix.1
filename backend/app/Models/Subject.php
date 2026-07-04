<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $fillable = ['college_id', 'code', 'name'];

    public function college()
    {
        return $this->belongsTo(College::class);
    }

    public function semesters()
    {
        return $this->belongsToMany(Semester::class);
    }
}

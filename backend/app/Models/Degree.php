<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Degree extends Model
{
    protected $fillable = ['college_id', 'name'];

    public function college()
    {
        return $this->belongsTo(College::class);
    }

    public function departments()
    {
        return $this->hasMany(Department::class);
    }
}

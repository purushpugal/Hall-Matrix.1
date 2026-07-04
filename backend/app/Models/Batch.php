<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Batch extends Model
{
    protected $fillable = ['college_id', 'from_year', 'to_year'];

    public function college()
    {
        return $this->belongsTo(College::class);
    }
}

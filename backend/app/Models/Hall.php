<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hall extends Model
{
    protected $fillable = [
        'college_id',
        'name',
        'capacity',
        'rows',
        'cols',
        'is_active',
        'block_name',
        'description',
    ];

    public function college()
    {
        return $this->belongsTo(College::class);
    }
}

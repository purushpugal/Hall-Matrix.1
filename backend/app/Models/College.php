<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class College extends Model
{
    use HasFactory;

    protected $fillable = [
        'college_name', 'college_code', 'location', 'contact_person',
        'contact_number', 'email', 'password', 'is_active',
    ];

    protected $hidden = ['password'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function degrees()
    {
        return $this->hasMany(Degree::class);
    }

    public function departments()
    {
        return $this->hasMany(Department::class);
    }

    public function batches()
    {
        return $this->hasMany(Batch::class);
    }

    public function subjects()
    {
        return $this->hasMany(Subject::class);
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }

    public function semesters()
    {
        return $this->hasMany(Semester::class);
    }
}

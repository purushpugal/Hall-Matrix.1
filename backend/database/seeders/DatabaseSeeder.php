<?php

namespace Database\Seeders;

use App\Models\College;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Super Admin
        User::updateOrCreate(
            ['email' => 'Pugal29'],
            [
                'name'      => 'Super Admin',
                'email'     => 'Pugal29',
                'password'  => Hash::make('Pugal@22!'),
                'role'      => 'super_admin',
                'is_active' => true,
            ]
        );

        // Christain College
        $college = College::updateOrCreate(
            ['college_code' => '9203'],
            [
                'college_name'   => 'Christain College of Engineering and Technology',
                'college_code'   => '9203',
                'location'       => 'Oddanchatram',
                'contact_person' => 'College Admin',
                'contact_number' => '0000000000',
                'email'          => 'christain',
                'password'       => Hash::make('christain'),
                'is_active'      => true,
            ]
        );

        // College Admin user linked to the college
        User::updateOrCreate(
            ['email' => 'christain'],
            [
                'name'       => 'Christain College Admin',
                'email'      => 'christain',
                'password'   => Hash::make('christain'),
                'role'       => 'college_admin',
                'is_active'  => true,
                'college_id' => $college->id,
            ]
        );
    }
}

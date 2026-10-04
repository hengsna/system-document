<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $roles = Role::all()->keyBy('name');

        $users = [
            ['name' => 'John Smith', 'email' => 'john.smith@example.com', 'role_id' => $roles['M&E Manager']->id ?? null, 'status' => 'Active'],
            ['name' => 'Jane Doe', 'email' => 'jane.doe@example.com', 'role_id' => $roles['Administration']->id ?? null, 'status' => 'Active'],
            ['name' => 'Robert Field', 'email' => 'robert.field@example.com', 'role_id' => $roles['Data Collector']->id ?? null, 'status' => 'Inactive'],
        ];

        foreach ($users as $user) {
            User::firstOrCreate(
                ['email' => $user['email']],
                [
                    'name' => $user['name'],
                    'password' => Hash::make('password'),
                    'role_id' => $user['role_id'],
                    'status' => $user['status']
                ]
            );
        }
    }
}

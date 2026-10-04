<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            'M&E Officer',
            'M&E Manager',
            'Administration',
            'ICT Advisory',
            'Data Collector',
            'Analysis Advisor'
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role], [
                'description' => 'System default role for ' . $role
            ]);
        }
    }
}

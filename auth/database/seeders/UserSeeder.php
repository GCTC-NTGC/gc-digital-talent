<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (!User::where('email', 'admin@test.com')->first()) {
            User::factory()->create([
                'email' => 'admin@test.com',
                'password' => '$2y$10$ckZPvncjfa5vszYc92FPhOMQ4Z1bCX1UiiZMg79fXXplH6IGM3.Pi', // Test123!
                'first_name' => 'Test',
                'last_name' => 'User'
            ]);
        }
    }
}

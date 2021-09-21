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
        if (!User::where(['email' => 'admin@test.com'])->first()) {
            User::factory()->create([
                'email' => 'admin@test.com',
                'sub' => 'admin@test.com',
                'roles' => ['ADMIN']
            ]);
        }
        User::factory()->count(50)->create();
    }
}

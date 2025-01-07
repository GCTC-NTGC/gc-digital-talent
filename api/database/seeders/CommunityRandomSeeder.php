<?php

namespace Database\Seeders;

use App\Models\Community;
use App\Models\DevelopmentProgram;
use Illuminate\Database\Seeder;

class CommunityRandomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Community::factory()
            ->count(2)
            ->has(DevelopmentProgram::factory()
                ->withEligibleClassifications()
                ->count(3))
            ->create();

    }
}

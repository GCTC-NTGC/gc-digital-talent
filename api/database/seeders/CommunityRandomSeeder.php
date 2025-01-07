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
            ->afterCreating(function (Community $community) {
                DevelopmentProgram::factory()
                    ->withEligibleClassifications()
                    ->for($community)
                    ->create();
            })
            ->create();

    }
}

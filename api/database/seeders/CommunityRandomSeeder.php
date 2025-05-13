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
            ->withTalentNominationEvents()
            ->has(DevelopmentProgram::factory()
                ->withEligibleClassifications()
                ->count(3))
            ->create();

        // The digital community has most of the (real) workStreams so let's add a few fake development programs, too.
        DevelopmentProgram::factory()->count(2)
            ->withEligibleClassifications()
            ->for(Community::where('key', 'digital')->sole())
            ->create();

    }
}

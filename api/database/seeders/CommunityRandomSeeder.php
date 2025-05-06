<?php

namespace Database\Seeders;

use App\Models\Community;
use App\Models\DevelopmentProgram;
use Faker\Factory as Faker;
use Illuminate\Database\Eloquent\Factories\Sequence;
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
        $faker = Faker::create();

        Community::factory()
            ->count(2)
            ->has(DevelopmentProgram::factory()
                ->withEligibleClassifications()
                ->count(3))
            ->create();

        // The digital community has most of the (real) workStreams so let's add a few fake development programs, too.
        DevelopmentProgram::factory()->count(2)
            ->withEligibleClassifications()
            ->for(Community::where('key', 'digital')->sole())
            ->state(new Sequence(
                function (Sequence $sequence) {
                    return [
                        'name' => [
                            'en' => 'Development program EN '.$sequence->index,
                            'fr' => 'Development program FR '.$sequence->index,
                        ],
                    ];
                }
            ))
            ->create();

    }
}

<?php

namespace Database\Seeders;

use App\Models\Community;
use App\Models\TalentNominationEvent;
use Faker\Factory as Faker;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

class TalentNominationEventTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();
        $digital = Community::where('key', 'digital')->first();

        TalentNominationEvent::factory(10)
            ->withDevelopmentPrograms()
            ->state(new Sequence(
                function (Sequence $sequence) use ($faker) {
                    return [
                        'name' => [
                            'en' => 'Test Talent Nomination Event active EN '.$sequence->index,
                            'fr' => 'Test Talent Nomination Event active FR '.$sequence->index,
                        ],
                        'open_date' => $faker->dateTimeBetween('-1 year', 'now'),
                        'close_date' => $faker->dateTimeBetween('+1 year', '+2 years'),
                    ];
                }
            ))
            ->create([
                'community_id' => $digital,
            ]);

        TalentNominationEvent::factory(10)
            ->withDevelopmentPrograms()
            ->state(new Sequence(
                function (Sequence $sequence) use ($faker) {
                    $openDate = $faker->dateTimeBetween('-2 years', '-1 year');

                    return [
                        'name' => [
                            'en' => 'Test Talent Nomination Event past EN '.$sequence->index,
                            'fr' => 'Test Talent Nomination Event past FR '.$sequence->index,
                        ],
                        'open_date' => $openDate,
                        'close_date' => $faker->dateTimeBetween($openDate, 'now'),
                    ];
                }
            ))
            ->create();

        TalentNominationEvent::factory(10)
            ->withDevelopmentPrograms()
            ->state(new Sequence(
                function (Sequence $sequence) use ($faker) {
                    $openDate = $faker->dateTimeBetween('now', '+1 year');

                    return [
                        'name' => [
                            'en' => 'Test Talent Nomination Event upcoming EN '.$sequence->index,
                            'fr' => 'Test Talent Nomination Event upcoming FR '.$sequence->index,
                        ],
                        'open_date' => $openDate,
                        'close_date' => $faker->dateTimeBetween($openDate, '+2 years'),
                    ];
                }
            ))
            ->create();

    }
}

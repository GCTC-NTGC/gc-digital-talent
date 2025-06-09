<?php

namespace Database\Seeders;

use App\Models\Community;
use App\Models\DevelopmentProgram;
use App\Models\WorkStream;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

class CommunityTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Community::factory()
            ->has(DevelopmentProgram::factory()
                ->withEligibleClassifications()
                ->state(new Sequence(
                    function (Sequence $sequence) {
                        return [
                            'name' => [
                                'en' => 'Test Development program EN '.$sequence->index,
                                'fr' => 'Test Development program FR '.$sequence->index,
                            ],
                        ];
                    }
                )))
            ->withTalentNominationEvents()
            ->create([
                'key' => 'test-community',
                'name' => [
                    'en' => 'Test Community EN',
                    'fr' => 'Test Community FR',
                ],
            ]);

        $testCommunityId = Community::where('key', 'test-community')->first('id');
        WorkStream::factory()->create([
            'key' => 'test_work_stream',
            'name' => [
                'en' => 'Test work stream EN',
                'fr' => 'Test work stream FR',
            ],
            'community_id' => $testCommunityId,
        ]);

    }
}

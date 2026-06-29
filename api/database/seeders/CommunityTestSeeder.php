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
        $testCommunity = Community::factory()
            ->withTalentNominationEvents()
            ->create([
                'key' => 'test-community',
                'name' => [
                    'en' => 'Test Community EN',
                    'fr' => 'Test Community FR',
                ],
            ]);

        DevelopmentProgram::factory()
            ->withCommunityAndClassifications($testCommunity->id)
            ->state(new Sequence(
                function (Sequence $sequence) {
                    return [
                        'name' => [
                            'en' => 'Test Development program EN ',
                            'fr' => 'Test Development program FR ',
                        ],
                    ];
                }
            ))
            ->create();

        WorkStream::factory()->create([
            'key' => 'test_work_stream',
            'name' => [
                'en' => 'Test work stream EN',
                'fr' => 'Test work stream FR',
            ],
            'community_id' => $testCommunity->id,
        ]);

        // does not exist in production yet
        $testProcurementCommunity = Community::factory()
            ->withTalentNominationEvents()
            ->create([
                'key' => 'procurement',
                'name' => [
                    'en' => 'Test Procurement Community EN',
                    'fr' => 'Test Procurement Community FR',
                ],
            ]);

        DevelopmentProgram::factory()
            ->withCommunityAndClassifications($testProcurementCommunity->id)
            ->state(new Sequence(
                function (Sequence $sequence) {
                    return [
                        'name' => [
                            'en' => 'Test Development program 2 EN ',
                            'fr' => 'Test Development program 2 FR ',
                        ],
                    ];
                }
            ))
            ->create();

        WorkStream::factory()->create([
            'key' => 'test_procurement_work_stream',
            'name' => [
                'en' => 'Test Procurement work stream EN',
                'fr' => 'Test Procurement work stream FR',
            ],
            'community_id' => $testProcurementCommunity->id,
        ]);
    }
}

<?php

namespace Database\Seeders;

use App\Models\Community;
use App\Models\DevelopmentProgram;
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
                ->withEligibleClassifications())
            ->withTalentNominationEvents()
            ->create([
                'key' => 'test-community',
                'name' => [
                    'en' => 'Test Community EN',
                    'fr' => 'Test Community FR',
                ],
            ]);
    }
}

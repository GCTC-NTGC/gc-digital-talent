<?php

namespace Database\Seeders;

use App\Models\SkillCategoryGroup;
use Illuminate\Database\Seeder;

class SkillCategoryGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $skillCategoryGroups = [
            [
                'name' => [
                    'en' => 'Technical Skills',
                    'fr' => 'Technical Skills FR',
                ],
                'key' => 'technical_skills'
            ],
            [
                'name' => [
                    'en' => 'Transferrable Skills',
                    'fr' => 'Transferrable Skills FR',
                ],
                'key' => 'transferrable_skills'
            ],
        ];

        foreach ($skillCategoryGroups as $seedData) {
            $identifier = [
                'key' => $seedData['key'],
            ];
            SkillCategoryGroup::updateOrCreate($identifier, $seedData);
        }
    }
}

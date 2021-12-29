<?php

namespace Database\Seeders;

use App\Models\SkillCategory;
use App\Models\SkillCategoryGroup;
use Illuminate\Database\Seeder;

class SkillCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $skillCategories = [
            [
                'name' => [
                    'en' => 'Programming Languages and Tools',
                    'fr' => 'Programming Languages and Tools FR',
                ],
                'key' => 'programming_languages',
                'skill_category_group_id' => SkillCategoryGroup::where('key', 'technical_skills')->first()->id,
            ],
            [
                'name' => [
                    'en' => 'IT Architecture',
                    'fr' => 'IT Architecture FR',
                ],
                'key' => 'it_architecture',
                'skill_category_group_id' => SkillCategoryGroup::where('key', 'technical_skills')->first()->id,
            ],
            [
                'name' => [
                    'en' => 'Development and Programming',
                    'fr' => 'Development and Programming FR',
                ],
                'key' => 'development_and_programming',
                'skill_category_group_id' => SkillCategoryGroup::where('key', 'technical_skills')->first()->id,
            ],
            [
                'name' => [
                    'en' => 'Personal',
                    'fr' => 'Personal FR',
                ],
                'key' => 'personal',
                'skill_category_group_id' => SkillCategoryGroup::where('key', 'transferrable_skills')->first()->id,
            ],
            [
                'name' => [
                    'en' => 'Interpersonal',
                    'fr' => 'Interpersonal FR',
                ],
                'key' => 'interpersonal',
                'skill_category_group_id' => SkillCategoryGroup::where('key', 'transferrable_skills')->first()->id,
            ],
            [
                'name' => [
                    'en' => 'Leadership',
                    'fr' => 'Leadership FR',
                ],
                'key' => 'leadership',
                'skill_category_group_id' => SkillCategoryGroup::where('key', 'transferrable_skills')->first()->id,
            ],
        ];

        foreach ($skillCategories as $seedData) {
            $identifier = [
                'key' => $seedData['key'],
            ];
            SkillCategory::updateOrCreate($identifier, $seedData);
        }
    }
}

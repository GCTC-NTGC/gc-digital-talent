<?php

namespace Database\Seeders;

use App\Models\Skill;
use App\Models\SkillFamily;
use Exception;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Depends on SkillFamilySeeder to be run first.
     *
     * @return void
     */
    public function run()
    {
        /* To recreate the JSON file, run this GraphQL query:
            query Skills {
                skills {
                    key
                    name {
                        en
                        fr
                    }
                    description {
                        en
                        fr
                    }
                    category {
                        value
                    }
                    keywords {
                        en
                        fr
                    }
                    families {
                        key
                    }
                }
            }

            Sort by key. You can use VS Code extension "Thinker.sort-json" to sort the results for a good commit diff.
        */

        $fileContents = file_get_contents(base_path('database/seeders/SkillSeeder.data.json'));
        if (! $fileContents) {
            throw new Exception('Failed to load JSON file');
        }
        $fileJson = json_decode($fileContents);
        if (! $fileJson) {
            throw new Exception('Failed to decode JSON file');
        }
        $models = $fileJson->data->skills;

        // used to add families relationship to models
        $allSkillFamilies = SkillFamily::all(['id', 'key']);

        // Iterate the provided data to load it
        foreach ($models as $model) {
            // turn family keys into an array of IDs to sync
            $skillFamilyIds = array_map(function ($family) use ($allSkillFamilies) {
                return $allSkillFamilies->sole('key', $family->key)->id;
            }, $model->families);

            Skill::updateOrCreate(
                ['key' => $model->key],
                [
                    'name' => [
                        'en' => $model->name->en,
                        'fr' => $model->name->fr,
                    ],
                    'description' => [
                        'en' => $model->description->en,
                        'fr' => $model->description->fr,
                    ],
                    'category' => $model->category->value,
                    'keywords' => [
                        'en' => $model->keywords->en,
                        'fr' => $model->keywords->fr,
                    ],
                ]
            )
                ->families()->sync($skillFamilyIds);
        }
    }
}

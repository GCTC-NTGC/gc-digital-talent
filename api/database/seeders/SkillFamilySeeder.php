<?php

namespace Database\Seeders;

use App\Models\SkillFamily;
use Exception;
use Illuminate\Database\Seeder;

class SkillFamilySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /* To recreate the JSON file, run this GraphQL query:
            query SkillsFamilies {
                skillFamilies {
                    key
                    name { en fr }
                    description { en fr }
                }
            }

            Sort by key. You can use VS Code extension "Thinker.sort-json" to sort the results for a good commit diff.
        */

        $fileContents = file_get_contents(base_path('database/seeders/SkillFamilySeeder.data.json'));
        if (! $fileContents) {
            throw new Exception('Failed to load JSON file');
        }
        $fileJson = json_decode($fileContents);
        if (! $fileJson) {
            throw new Exception('Failed to decode JSON file');
        }
        $models = $fileJson->data->skillFamilies;

        // Iterate the data to load it
        foreach ($models as $model) {
            SkillFamily::updateOrCreate(
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
                ]
            );
        }
    }
}

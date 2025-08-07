<?php

namespace Database\Seeders;

use App\Models\Classification;
use Exception;
use Illuminate\Database\Seeder;

class ClassificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /* To recreate the JSON file, run this GraphQL query:
            query Classifications {
                classifications {
                    group
                    level
                    name {
                        en
                        fr
                    }
                    maxSalary
                    minSalary
                }
            }

            Sort by group then level. You can use VS Code extension "Thinker.sort-json" to sort the results for a good commit diff.
        */

        $fileContents = file_get_contents(base_path('database/seeders/ClassificationSeeder.data.json'));
        if (! $fileContents) {
            throw new Exception('Failed to load JSON file');
        }
        $fileJson = json_decode($fileContents);
        if (! $fileJson) {
            throw new Exception('Failed to decode JSON file');
        }
        $models = $fileJson->data->classifications;

        // Iterate the data to load it
        foreach ($models as $model) {
            Classification::updateOrCreate(
                [
                    'group' => $model->group,
                    'level' => $model->level,
                ],
                [
                    'name' => [
                        'en' => $model->name->en,
                        'fr' => $model->name->fr,
                    ],
                    'max_salary' => $model->maxSalary,
                    'min_salary' => $model->minSalary,

                ]
            );
        }
    }
}

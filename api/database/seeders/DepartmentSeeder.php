<?php

namespace Database\Seeders;

use App\Models\Department;
use Exception;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        /* To recreate the JSON file, run this GraphQL query:
            query Departments {
                departments {
                    departmentNumber
                    name {
                        en
                        fr
                    }
                    orgIdentifier
                    isCorePublicAdministration
                    isCentralAgency
                    isScience
                    isRegulatory
                    size {
                        value
                    }
                }
            }

            Sort by department number. You can use VS Code extension "Thinker.sort-json" to sort the results for a good commit diff.
        */

        $fileContents = file_get_contents(base_path('database/seeders/DepartmentSeeder.data.json'));
        if (! $fileContents) {
            throw new Exception('Failed to load JSON file');
        }
        $fileJson = json_decode($fileContents);
        if (! $fileJson) {
            throw new Exception('Failed to decode JSON file');
        }
        $models = $fileJson->data->departments;

        // Iterate the provided data to load it
        foreach ($models as $model) {

            Department::updateOrCreate(
                ['department_number' => $model->departmentNumber],
                [
                    'name' => [
                        'en' => $model->name->en,
                        'fr' => $model->name->fr,
                    ],
                    'org_identifier' => $model->orgIdentifier,
                    'is_core_public_administration' => $model->isCorePublicAdministration,
                    'is_central_agency' => $model->isCentralAgency,
                    'is_science' => $model->isScience,
                    'is_regulatory' => $model->isRegulatory,
                    'size' => $model->size?->value,
                ]
            );

        }
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ClassificationRoles;
use App\Models\Classification;


class ClassificationRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $roles = [
            [
                'key' => 'technician_it01',
                'name' => [
                    'en' => 'Technician ',
                    'fr' => ''
                ],
                'classification' => [
                    'group' => 'IT',
                    'level' => "1",
                ],
            ],
            [
                'key' => 'analyst_it02',
                'name' => [
                    'en' => 'Analyst',
                    'fr' => ''
                ],
                'classification' => [
                    'group' => 'IT',
                    'level' => 2,
                ],
            ],
            [
                'key' => 'team_leader_it03',
                'name' => [
                    'en' => 'Team leader',
                    'fr' => ''
                ],
                'classification' => [
                    'group' => 'IT',
                    'level' => 3,
                ],

            ],
            [
                'key' => 'technical_advisor_it03',
                'name' => [
                    'en' => 'Technical advisor',
                    'fr' => ''
                ],
                'classification' => [
                    'group' => 'IT',
                    'level' => 3,
                    ],
            ],
            [
                'key' => 'senior_advisor_it04',
                'name' => [
                    'en' => 'Senior advisor',
                    'fr' => 'Administration de bases de données'
                ],
                'classification' => [
                    'group' => 'IT',
                    'level' => 4,
                ],

            ],
            [
                'key' => 'manager_it04',
                'name' => [
                    'en' => 'Manager',
                    'fr' => ''
                ],
                'classification' => [
                    'group' => 'IT',
                    'level' => 4,
                ],

            ],
        ];


        foreach ($roles as $role) {
            $identifier = [
               'key' => $role['key'],
            ];
            $classificationId = Classification::where([
                    'group' => $role['classification']['group'],
                    'level' => $role['classification']['level']
                ])->first()->id;
            $completeRole = array_merge($role, ['classification_id' => $classificationId]);
            ClassificationRoles::updateOrCreate($identifier, $completeRole);
        }
    }
}


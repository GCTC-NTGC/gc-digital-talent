<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\GenericJobTitle;
use App\Models\Classification;

class GenericJobTitleSeeder extends Seeder
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
                'role' => 'TECHNICIAN_IT01',
                'name' => [
                    'en' => 'Technician',
                    'fr' => 'Technicien'
                ],
                'classification' => [
                    'group' => 'IT',
                    'level' => "1",
                ],
            ],
            [
                'role' => 'ANALYST_IT02',
                'name' => [
                    'en' => 'Analyst',
                    'fr' => 'Analyste'
                ],
                'classification' => [
                    'group' => 'IT',
                    'level' => 2,
                ],
            ],
            [
                'role' => 'TEAM_LEADER_IT03',
                'name' => [
                    'en' => 'Team leader',
                    'fr' => 'Chef d’équipe
'
                ],
                'classification' => [
                    'group' => 'IT',
                    'level' => 3,
                ],

            ],
            [
                'role' => 'TECHNICAL_ADVISOR_IT03',
                'name' => [
                    'en' => 'Technical advisor',
                    'fr' => 'Conseiller technique'
                ],
                'classification' => [
                    'group' => 'IT',
                    'level' => 3,
                    ],
            ],
            [
                'role' => 'SENIOR_ADVISOR_IT04',
                'name' => [
                    'en' => 'Senior advisor',
                    'fr' => 'Conseiller principal'
                ],
                'classification' => [
                    'group' => 'IT',
                    'level' => 4,
                ],

            ],
            [
                'role' => 'MANAGER_IT04',
                'name' => [
                    'en' => 'Manager',
                    'fr' => 'Gestionnaire'
                ],
                'classification' => [
                    'group' => 'IT',
                    'level' => 4,
                ],

            ],
        ];

        foreach ($roles as $role) {
            $identifier = [
               'role' => $role['role'],
            ];
            $classificationId = Classification::where([
                    'group' => $role['classification']['group'],
                    'level' => $role['classification']['level']
                ])->first()->id;

            $completeRole = array_merge($role, ['classification_id' => $classificationId]);
            unset($completeRole['classification']);
            GenericJobTitle::updateOrCreate($identifier, $completeRole);
        }
    }
}


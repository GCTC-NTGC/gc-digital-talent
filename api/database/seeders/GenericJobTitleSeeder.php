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
      $genericJobTitles = [
            [
                'key' => 'TECHNICIAN_IT01',
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
                'key' => 'ANALYST_IT02',
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
                'key' => 'TEAM_LEADER_IT03',
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
                'key' => 'TECHNICAL_ADVISOR_IT03',
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
                'key' => 'SENIOR_ADVISOR_IT04',
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
                'key' => 'MANAGER_IT04',
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

        foreach ($genericJobTitles as $genericJobTitle) {
            $identifier = [
               'key' => $genericJobTitle['key'],
            ];
            $classificationId = Classification::where([
                    'group' => $genericJobTitle['classification']['group'],
                    'level' => $genericJobTitle['classification']['level']
                ])->first()->id;

            $finalValue = array_merge($genericJobTitle, ['classification_id' => $classificationId]);
            unset($finalValue['classification']);
            GenericJobTitle::updateOrCreate($identifier, $finalValue);
        }
    }
}


<?php

namespace Database\Seeders;

use App\Enums\GenericJobTitleKey;
use App\Models\Classification;
use App\Models\GenericJobTitle;
use Illuminate\Database\Seeder;

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
                'key' => GenericJobTitleKey::TECHNICIAN_IT01->name,
                'name' => [
                    'en' => 'Technician',
                    'fr' => 'Technicien',
                ],
                'classification' => [
                    'group' => 'IT',
                    'level' => '1',
                ],
            ],
            [
                'key' => GenericJobTitleKey::ANALYST_IT02->name,
                'name' => [
                    'en' => 'Analyst',
                    'fr' => 'Analyste',
                ],
                'classification' => [
                    'group' => 'IT',
                    'level' => 2,
                ],
            ],
            [
                'key' => GenericJobTitleKey::TEAM_LEADER_IT03->name,
                'name' => [
                    'en' => 'Team leader',
                    'fr' => 'Chef d’équipe
',
                ],
                'classification' => [
                    'group' => 'IT',
                    'level' => 3,
                ],

            ],
            [
                'key' => GenericJobTitleKey::TECHNICAL_ADVISOR_IT03->name,
                'name' => [
                    'en' => 'Technical advisor',
                    'fr' => 'Conseiller technique',
                ],
                'classification' => [
                    'group' => 'IT',
                    'level' => 3,
                ],
            ],
            [
                'key' => GenericJobTitleKey::SENIOR_ADVISOR_IT04->name,
                'name' => [
                    'en' => 'Senior advisor',
                    'fr' => 'Conseiller principal',
                ],
                'classification' => [
                    'group' => 'IT',
                    'level' => 4,
                ],

            ],
            [
                'key' => GenericJobTitleKey::MANAGER_IT04->name,
                'name' => [
                    'en' => 'Manager',
                    'fr' => 'Gestionnaire',
                ],
                'classification' => [
                    'group' => 'IT',
                    'level' => 4,
                ],

            ],
            [
                'key' => GenericJobTitleKey::DIGITAL_LEADER_EX_03->name,
                'name' => [
                    'en' => 'Digital Leaders',
                    'fr' => 'Chefs de file du numérique',
                ],
                'classification' => [
                    'group' => 'EX',
                    'level' => 3,
                ],

            ],
        ];

        foreach ($genericJobTitles as $genericJobTitle) {
            $identifier = [
                'key' => $genericJobTitle['key'],
            ];
            $classificationId = Classification::select(['id'])->where([
                'group' => $genericJobTitle['classification']['group'],
                'level' => $genericJobTitle['classification']['level'],
            ])->sole()->id;
            $finalValue = array_merge($genericJobTitle, ['classification_id' => $classificationId]);
            unset($finalValue['classification']);
            GenericJobTitle::updateOrCreate($identifier, $finalValue);
        }
    }
}

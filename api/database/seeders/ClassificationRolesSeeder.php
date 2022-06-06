<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

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
                'key' => 'technician ',
                'name' => [
                    'en' => 'Technician ',
                    'fr' => ''
                ],
            ],
            [
                'key' => 'analyst ',
                'name' => [
                    'en' => 'Analyst ',
                    'fr' => ''
                ],
            ],
            [
                'key' => 'team_leader',
                'name' => [
                    'en' => 'Team leader',
                    'fr' => ''
                ],
            ],
            [
                'key' => 'technical_advisor',
                'name' => [
                    'en' => 'Technical advisor',
                    'fr' => ''
                ],
            ],
            [
                'key' => 'senior_advisor',
                'name' => [
                    'en' => 'Senior advisor',
                    'fr' => 'Administration de bases de données'
                ],
            ],
            [
                'key' => 'enterprise_architecture',
                'name' => [
                    'en' => 'Enterprise Architecture (EA)',
                    'fr' => 'Architecture d\'entreprise (EA)'
                ],
            ],
            [
                'key' => 'manager',
                'name' => [
                    'en' => 'Manager',
                    'fr' => ''
                ],
            ],
        ];
        foreach ($roles as $role) {
            $identifier = [
                'key' => $roles['key'],
            ];
            ClassificationRoles::updateOrCreate($identifier, $roles);
        }
    }  
}


<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Team;
use Illuminate\Database\Seeder;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $teams = [
            [
                'name' => 'digital-community-management',
                'display_name' => [
                    'en' => 'Digital Community Management',
                    'fr' => 'Gestion de la collectivité numérique',
                ],
                'contact_email' => 'dcm@test.test',
            ],
            [
                'name' => 'office-of-indigenous-initiatives',
                'display_name' => [
                    'en' => 'Office of Indigenous Initiatives',
                    'fr' => 'Bureau initiatives autochtones',
                ],
                'contact_email' => 'oit@test.test',
            ]
        ];

        $teamDepartments = [
            'digital-community-management' => [
                ['department_number' => 56] // Treasury Board Secretariat
            ],
            'office-of-indigenous-initiatives' => [
                ['department_number' => 14] // Employment and Social Development (Department of)
            ]
        ];

        foreach ($teams as $team) {
            $identifier = [
                'name' => $team['name'],
            ];
            Team::updateOrCreate($identifier, $team);
        }

        foreach ($teamDepartments as $teamName => $departments) {
            $team = Team::where('name', $teamName)->first();
            foreach ($departments as $departmentIdentifier) {
                $department = Department::where($departmentIdentifier)->first();
                if ($team && $department) {
                    $team->departments()->attach($department);
                }
            }
        }
    }
}

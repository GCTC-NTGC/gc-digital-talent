<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Team;
use Illuminate\Database\Seeder;

class TeamSeederLocal extends Seeder
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
                'name' => 'test-team',
                'display_name' => [
                    'en' => 'Test Team',
                    'fr' => 'Équipe de test',
                ],
                'contact_email' => 'test.team@test.test'
            ],
        ];

        $teamDepartments = [
            'test-team' => [
                ['department_number' => 56] // Treasury Board Secretariat
            ],
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

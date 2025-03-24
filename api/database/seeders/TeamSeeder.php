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
                'department_ids' => [Department::select('id')->where('name->en', 'Treasury Board Secretariat')->sole()->id],
            ],
            [
                'name' => 'office-of-indigenous-initiatives',
                'department_ids' => [Department::select('id')->where('name->en', 'Employment and Social Development (Department of)')->sole()->id],
            ],
        ];

        foreach ($teams as $team) {
            Team::updateOrCreate(
                [
                    'name' => $team['name'],
                ])
                ->departments()->sync($team['department_ids']);
        }
    }
}

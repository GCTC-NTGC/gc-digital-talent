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
                'contact_email' => 'support-soutien@talent.canada.ca',
                'department_ids' => [Department::select('id')->where('name->en', 'Treasury Board Secretariat')->sole()->id],
            ],
            [
                'name' => 'office-of-indigenous-initiatives',
                'display_name' => [
                    'en' => 'Office of Indigenous Initiatives',
                    'fr' => 'Bureau initiatives autochtones',
                ],
                'contact_email' => 'edsc.pda-iap.esdc@hrsdc-rhdcc.gc.ca',
                'department_ids' => [Department::select('id')->where('name->en', 'Employment and Social Development (Department of)')->sole()->id],
            ],
        ];

        foreach ($teams as $team) {
            Team::updateOrCreate(
                [
                    'name' => $team['name'],
                ],
                [
                    'display_name' => $team['display_name'],
                    'contact_email' => $team['contact_email'],
                ])
                ->departments()->sync($team['department_ids']);
        }
    }
}

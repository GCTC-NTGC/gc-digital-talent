<?php

namespace Database\Seeders;

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
            ],
        ];

        foreach ($teams as $team) {
            $identifier = [
                'name' => $team['name'],
            ];
            Team::updateOrCreate($identifier, $team);
        }
    }
}

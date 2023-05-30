<?php

namespace Database\Seeders;

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

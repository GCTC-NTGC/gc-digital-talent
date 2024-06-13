<?php

namespace Database\Seeders;

use App\Models\Community;
use Illuminate\Database\Seeder;

class CommunitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $communities = [
            [
                'key' => 'digital',
                'name' => [
                    'en' => 'Digital Community',
                    'fr' => 'Communauté numérique',
                ],
            ],
            [
                'key' => 'atip',
                'name' => [
                    'en' => 'Access to Information and Privacy (ATIP)',
                    'fr' => 'Demande d\'accès à l\'information et de protection des renseignements personnels (AIPRP)',
                ],
            ],
        ];

        foreach ($communities as $community) {
            Community::updateOrCreate(
                [
                    'key' => $community['key'],
                ],
                [
                    'name' => $community['name'],
                ]
            );
        }
    }
}

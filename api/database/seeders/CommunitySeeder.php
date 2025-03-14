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
                'description' => [
                    'en' => null,
                    'fr' => null,
                ],
            ],
            [
                'key' => 'atip',
                'name' => [
                    'en' => 'Access to Information and Privacy (ATIP)',
                    'fr' => 'Demande d\'accès à l\'information et de protection des renseignements personnels (AIPRP)',
                ],
                'description' => [
                    'en' => null,
                    'fr' => null,
                ],
            ],
            [
                'key' => 'finance',
                'name' => [
                    'en' => 'Financial Management Community',
                    'fr' => 'Collectivité de la gestion financière',
                ],
                'description' => [
                    'en' => 'The Financial Management Community connects financial management professionals (CT-FINs and executives) within the Government of Canada to enhance their skills and grow in their careers through career planning, development programs, and learning.',
                    'fr' => 'La collectivité de la gestion financière relie les professionnels de la gestion financière (CT-FIN et cadres) au sein du gouvernement du Canada afin d\'améliorer leurs compétences et de progresser dans leur carrière par le biais de la planification de carrière, de programmes de développement et de l\'apprentissage.',
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
                    'description' => $community['description'],
                ]
            );
        }

        Community::all()->each(function (Community $community) {
            if ($community->team()->exists()) {
                return;
            }
            $community->team()->firstOrCreate([], [
                'name' => 'community-'.$community->id,
            ]);
        });
    }
}

<?php

namespace Database\Seeders;

use App\Models\Pool;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class PoolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $now = Carbon::now();
        $pools = [
            [
                'name' => [
                    'en' => 'CMO Digital Careers',
                    'fr' => 'CMO Carrières Numériques'
                ],
                'key' => 'digital_careers',
                'user_id' => User::where('email', 'admin@test.com')->first()->id,
                'description' => [
                    'en' => 'Enjoy a meaningful Digital career at the Public Service of Canada! Join us and grow your Digital career with jobs and opportunities for career advancement across a broad range of specializations, throughout Canada and internationally. You\'ll have access to continuous learning through onboarding, on-the-job training, coaching, mentoring, interdepartmental placements, and many other opportunities! Enjoy a collaborative and horizontal work culture facilitated by the Government\'s digital collaboration tools.',
                    'fr' => 'Profitez d\'une carrière numérique significative à la fonction publique du Canada ! Joignez-vous à nous pour vous épanouir dans votre carrière numérique avec des emplois et des possibilités d\'avancement professionnel dans un large éventail de spécialisations, partout au Canada et à l\'étranger. Vous aurez accès à un apprentissage continu grâce à l\'orientation, à la formation en cours d\'emploi, au coaching, au mentorat, à des occasions de mobilité interministérielles et à bien plus ! Profitez d\'une culture de travail collaborative et horizontale facilitée par les outils de collaboration numérique du gouvernement.'
                ],
                'is_published' => true,
                'expiry_date' => $now->copy()->addMonths(1)
            ],
            [
                'name' => [
                    'en' => 'Indigenous Apprenticeship Program',
                    'fr' => 'Indigenous Apprenticeship Program FR'
                ],
                'key' => 'indigenous_apprenticeship',
                'user_id' => User::where('email', 'admin@test.com')->first()->id,
                'is_published' => false
            ],
        ];

        foreach ($pools as $poolData) {
            $identifier = [
                'key' => $poolData['key'],
            ];
            $poolModel = Pool::where($identifier)->first();
            if (!$poolModel) {
                Pool::factory()->create($poolData);
            } else {
                $poolModel->update($poolData);
            }
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\Pool;
use App\Models\User;
use App\Models\Classification;
use App\Models\Team;
use Database\Helpers\ApiEnums;
use Illuminate\Database\Seeder;

class PoolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $pools = [
            [
                'name' => [
                    'en' => 'CMO Digital Careers',
                    'fr' => 'CMO Carrières Numériques'
                ],
                'key' => 'digital_careers',
                'user_id' => User::where('email', 'admin@test.com')->first()->id,
                'team_id' => Team::where('name', 'digital-community-management')->first()->id,
                'description' => [
                    'en' => 'Enjoy a meaningful Digital career at the Public Service of Canada! Join us and grow your Digital career with jobs and opportunities for career advancement across a broad range of specializations, throughout Canada and internationally. You\'ll have access to continuous learning through onboarding, on-the-job training, coaching, mentoring, interdepartmental placements, and many other opportunities! Enjoy a collaborative and horizontal work culture facilitated by the Government\'s digital collaboration tools.',
                    'fr' => 'Profitez d\'une carrière numérique significative à la fonction publique du Canada ! Joignez-vous à nous pour vous épanouir dans votre carrière numérique avec des emplois et des possibilités d\'avancement professionnel dans un large éventail de spécialisations, partout au Canada et à l\'étranger. Vous aurez accès à un apprentissage continu grâce à l\'orientation, à la formation en cours d\'emploi, au coaching, au mentorat, à des occasions de mobilité interministérielles et à bien plus ! Profitez d\'une culture de travail collaborative et horizontale facilitée par les outils de collaboration numérique du gouvernement.'
                ],
                'published_at' => config('constants.past_date'),
                'closing_date' => config('constants.far_future_date'),
                'publishing_group' => ApiEnums::PUBLISHING_GROUP_IT_JOBS,
            ],
            [
                'name' => [
                    'en' => 'Indigenous Apprenticeship Program',
                    'fr' => 'Indigenous Apprenticeship Program FR'
                ],
                'key' => 'indigenous_apprenticeship',
                'user_id' => User::where('email', 'admin@test.com')->first()->id,
                'publishing_group' => ApiEnums::PUBLISHING_GROUP_OTHER,
            ],
        ];

        foreach ($pools as $poolData) {
            $identifier = [
                'key' => $poolData['key'],
            ];
            $poolModel = Pool::where($identifier)->first();
            if (!$poolModel) {
                $createdPool = Pool::factory()->create($poolData);
                // constrain CMO Digital Careers pool to predictable values
                if ($identifier['key'] == 'digital_careers') {
                    $classificationIT01Id = Classification::where('group', 'ilike', 'IT')->where('level', 1)->sole()['id'];
                    $createdPool->classifications()->sync([$classificationIT01Id]);
                    $createdPool->stream = ApiEnums::POOL_STREAM_BUSINESS_ADVISORY_SERVICES;
                    $createdPool->advertisement_language = ApiEnums::POOL_ADVERTISEMENT_VARIOUS;
                    $createdPool->save();
                }
            } else {
                $poolModel->update($poolData);
            }
        }
    }
}

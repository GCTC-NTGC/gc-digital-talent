<?php

namespace Database\Seeders;

use App\Models\Classification;
use App\Models\Pool;
use App\Models\User;
use Illuminate\Database\Seeder;
use Database\Helpers\ApiEnums;

class PoolSeederUat extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $defaultOwner = User::where('email', 'tristan-orourke@talent.test')->first();

        $digitalCareers = Pool::updateOrCreate(
            ['key' => 'digital_careers'],
            [
                'name' => [
                    'en' => 'Digital Careers',
                    'fr' => 'Carrières Numériques'
                ],
                'description' => [
                    'en' => 'Enjoy a meaningful Digital career at the Public Service of Canada! Join us and grow your Digital career with jobs and opportunities for career advancement across a broad range of specializations, throughout Canada and internationally. You\'ll have access to continuous learning through onboarding, on-the-job training, coaching, mentoring, interdepartmental placements, and many other opportunities! Enjoy a collaborative and horizontal work culture facilitated by the Government\'s digital collaboration tools.',
                    'fr' => 'Profitez d\'une carrière numérique significative à la fonction publique du Canada ! Joignez-vous à nous pour vous épanouir dans votre carrière numérique avec des emplois et des possibilités d\'avancement professionnel dans un large éventail de spécialisations, partout au Canada et à l\'étranger. Vous aurez accès à un apprentissage continu grâce à l\'orientation, à la formation en cours d\'emploi, au coaching, au mentorat, à des occasions de mobilité interministérielles et à bien plus ! Profitez d\'une culture de travail collaborative et horizontale facilitée par les outils de collaboration numérique du gouvernement.'
                ],
                'user_id' => $defaultOwner->id,
                'operational_requirements' => [
                    'SHIFT_WORK',
                    'WORK_WEEKENDS',
                    'OVERTIME_SCHEDULED',
                    'OVERTIME_SHORT_NOTICE'
                ],
                // 'key_tasks' => [
                //     'en' => '',
                //     'fr' => ''
                // ], // TODO: Replace with real world text.
                'pool_status' => ApiEnums::POOL_STATUS_NOT_TAKING_APPLICATIONS,
                'publishing_group' => ApiEnums::PUBLISHING_GROUP_IT_JOBS,
            ]
        );

        $itClassifications = Classification::where('group', 'IT')->get();
        $digitalCareers->classifications()->sync($itClassifications);
    }
}

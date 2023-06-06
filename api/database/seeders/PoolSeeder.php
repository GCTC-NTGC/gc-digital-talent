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
                'published_at' => config('constants.past_date'),
                'closing_date' => config('constants.far_future_date'),
                'publishing_group' => ApiEnums::PUBLISHING_GROUP_IT_JOBS,
            ],
            [
                'name' => [
                    'en' => 'IT Apprenticeship Program for Indigenous Peoples',
                    'fr' => 'Programme d’apprentissage en TI pour les personnes autochtones'
                ],
                'key' => 'indigenous_apprenticeship',
                'user_id' => User::where('email', 'admin@test.com')->first()->id,
                'team_id' => Team::where('name', 'digital-community-management')->first()->id,
                'published_at' => config('constants.past_date'),
                'closing_date' => config('constants.far_future_date'),
                'publishing_group' => ApiEnums::PUBLISHING_GROUP_IAP,
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
                    $createdPool->advertisement_language = ApiEnums::POOL_VARIOUS;
                    $createdPool->save();
                }
            } else {
                $poolModel->update($poolData);
            }
        }
    }
}

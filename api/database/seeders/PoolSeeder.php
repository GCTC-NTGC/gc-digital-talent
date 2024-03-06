<?php

namespace Database\Seeders;

use App\Enums\PoolLanguage;
use App\Enums\PoolStream;
use App\Enums\PublishingGroup;
use App\Models\Classification;
use App\Models\Pool;
use App\Models\Team;
use App\Models\User;
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
                    'fr' => 'CMO Carrières Numériques',
                ],
                'user_id' => User::where('email', 'admin@test.com')->first()->id,
                'team_id' => Team::where('name', 'digital-community-management')->first()->id,
                'published_at' => config('constants.past_date'),
                'closing_date' => config('constants.far_future_date'),
                'publishing_group' => PublishingGroup::IT_JOBS->name,
            ],
            [
                'name' => [
                    'en' => 'IT Apprenticeship Program for Indigenous Peoples',
                    'fr' => 'Programme d’apprentissage en TI pour les personnes autochtones',
                ],
                'user_id' => User::where('email', 'admin@test.com')->first()->id,
                'team_id' => Team::where('name', 'digital-community-management')->first()->id,
                'published_at' => config('constants.past_date'),
                'closing_date' => config('constants.far_future_date'),
                'publishing_group' => PublishingGroup::IAP->name,
            ],
        ];

        foreach ($pools as $poolData) {
            $identifier = [
                'name->en' => $poolData['name']['en'],
            ];
            $poolModel = Pool::where($identifier)->first();
            if (! $poolModel) {
                $createdPool = Pool::factory()
                    ->published()
                    ->create($poolData);
                // constrain CMO Digital Careers pool to predictable values
                if ($identifier['name->en'] == 'CMO Digital Careers') {
                    $classificationIT01Id = Classification::where('group', 'ilike', 'IT')->where('level', 1)->first()['id'];
                    $createdPool->classifications()->sync([$classificationIT01Id]);
                    $createdPool->stream = PoolStream::BUSINESS_ADVISORY_SERVICES->name;
                    $createdPool->advertisement_language = PoolLanguage::VARIOUS->name;
                    $createdPool->save();
                }
            } else {
                $poolModel->update($poolData);
            }
        }
    }
}

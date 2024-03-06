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

class PoolTestSeeder extends Seeder
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
                'user_id' => User::select('id')->where('email', 'admin@test.com')->sole()->id,
                'team_id' => Team::select('id')->where('name', 'digital-community-management')->sole()->id,
                'published_at' => config('constants.past_date'),
                'closing_date' => config('constants.far_future_date'),
                'publishing_group' => PublishingGroup::IT_JOBS->name,
            ],
            [
                'name' => [
                    'en' => 'IT Apprenticeship Program for Indigenous Peoples',
                    'fr' => 'Programme d’apprentissage en TI pour les personnes autochtones',
                ],
                'user_id' => User::select('id')->where('email', 'admin@test.com')->sole()->id,
                'team_id' => Team::select('id')->where('name', 'digital-community-management')->sole()->id,
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
                $createdPool = Pool::factory()->published()->create($poolData);
                // constrain CMO Digital Careers pool to predictable values
                if ($identifier['name->en'] == 'CMO Digital Careers') {
                    $classificationIT01Id = Classification::select('id')->where('group', 'ilike', 'IT')->where('level', 1)->sole()->id;
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

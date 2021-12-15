<?php

namespace Database\Seeders;

use App\Models\Classification;
use App\Models\CmoAsset;
use App\Models\OperationalRequirement;
use App\Models\Pool;
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
                    'fr' => 'CMO Carrières Numériques'
                ],
                'key' => 'digital_careers',
                'user_id' => User::where('email', 'admin@test.com')->first()->id,
            ],
            [
                'name' => [
                    'en' => 'Indigenous Apprenticeship Program',
                    'fr' => 'Indigenous Apprenticeship Program FR'
                ],
                'key' => 'indigenous_apprenticeship',
                'user_id' => User::where('email', 'admin@test.com')->first()->id,
            ],
        ];
        foreach ($pools as $pool) {
            $identifier = [
                'name->en' => $pool['name']['en'],
            ];
            $newPool = Pool::updateOrCreate($identifier, $pool);
            // Attach data to pool
            $assets = CmoAsset::inRandomOrder()->limit(4)->get();
            $classifications = Classification::inRandomOrder()->limit(5)->get();
            $requirements = OperationalRequirement::inRandomOrder()->limit(5)->get();
            $newPool->essentialCriteria()->saveMany($assets->slice(0,2));
            $newPool->assetCriteria()->saveMany($assets->slice(2,2));
            $newPool->classifications()->saveMany($classifications);
            $newPool->operationalRequirements()->saveMany($requirements);
        }
    }
}

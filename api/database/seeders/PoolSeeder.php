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

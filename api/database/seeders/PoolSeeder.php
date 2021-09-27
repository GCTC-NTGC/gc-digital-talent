<?php

namespace Database\Seeders;

use App\Models\CmoAsset;
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
                    'en' => 'CMO',
                    'fr' => 'CMO'
                ],
                'user_id' => User::where('email', 'admin@test.com')->first()->id,
            ],
            [
                'name' => [
                    'en' => 'Indigenous Apprenticeship Program',
                    'fr' => 'Indigenous Apprenticeship Program FR'
                ],
                'user_id' => User::where('email', 'admin@test.com')->first()->id,
            ],
        ];
        foreach ($pools as $pool) {
            $identifier = [
                'name->en' => $pool['name']['en'],
            ];
            Pool::updateOrCreate($identifier, $pool);
        }
    }
}

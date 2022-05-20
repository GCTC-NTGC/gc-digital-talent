<?php

namespace Database\Seeders;

use App\Models\Classification;
use App\Models\CmoAsset;
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
                'user_id' => $defaultOwner->id,
                'operational_requirements' => [
                    'SHIFT_WORK',
                    'WORK_WEEKENDS',
                    'OVERTIME_SCHEDULED',
                    'OVERTIME_SHORT_NOTICE'
                ],
            ]
        );

        $softAssets = CmoAsset::whereIn('key', ['teamwork', 'at', 'cs', 'comms'])->get();
        $hardAssets = CmoAsset::whereIn('key', [
            'app_dev',
            'app_testing',
            'cybersecurity',
            'data_science',
            'db_admin',
            'enterprise_architecture',
            'information_management',
            'infrastructure_ops',
            'project_management'
        ])->get();
        $digitalCareers->essentialCriteria()->sync($softAssets);
        $digitalCareers->assetCriteria()->sync($hardAssets);

        $itClassifications = Classification::where('group', 'IT')->get();
        $digitalCareers->classifications()->sync($itClassifications);
    }
}

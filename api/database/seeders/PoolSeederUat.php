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
            ['name->en' => 'Digital Careers'],
            [
                'name' => [
                    'en' => 'Digital Careers',
                    'fr' => 'Carrières Numériques'
                ],
                'user_id' => $defaultOwner->id,
                'operational_requirements' => [
                    'SHIFT_WORK',
                    'OVERTIME_SCHEDULED',
                    'OVERTIME_SHORT_NOTICE'
                ],
                // 'key_tasks' => [
                //     'en' => '',
                //     'fr' => ''
                // ], // TODO: Replace with real world text.
                'publishing_group' => ApiEnums::PUBLISHING_GROUP_IT_JOBS,
            ]
        );

        $itClassifications = Classification::where('group', 'IT')->get();
        $digitalCareers->classifications()->sync($itClassifications);
    }
}

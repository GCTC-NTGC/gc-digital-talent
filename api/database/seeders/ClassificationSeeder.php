<?php

namespace Database\Seeders;

use App\Models\Classification;
use Illuminate\Database\Seeder;

class ClassificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $itGroup = [
            'group' => 'IT',
            'name' => ['en' => 'Information Technology', 'fr' => 'Technologie de l\'information']
        ];
        $asGroup = [
            'group' => 'AS',
            'name' => ['en' => 'Administrative Services', 'fr' => 'Services administratifs']
        ];

        $classifications = [
            // IT classifications 01-05.
            array_merge(
                $itGroup,
                [
                    'level' => 1,
                    'min_salary' => 60696,
                    'max_salary' => 78216,
                ]
            ),
            array_merge(
                $itGroup,
                [
                    'level' => 2,
                    'min_salary' => 75129,
                    'max_salary' => 91953,
                ]
            ),
            array_merge(
                $itGroup,
                [
                    'level' => 3
                    'min_salary' => 88683,
                    'max_salary' => 110182,
                ]
            ),
            array_merge(
                $itGroup,
                [
                    'level' => 4,
                    'min_salary' => 101541,
                    'max_salary' => 126390,
                ]
            ),
            array_merge(
                $itGroup,
                [
                    'level' => 5,
                    'min_salary' => 115754,
                    'max_salary' => 150842,
                ]
            ),
            // AS classifications 01-05.
            array_merge(
                $asGroup,
                [
                    'level' => 1,
                    'min_salary' => 43514,
                    'max_salary' => 49351,
                ]
            ),
            array_merge(
                $asGroup,
                [
                    'level' => 2,
                    'min_salary' => 48323,
                    'max_salary' => 53416,
                ]
            ),
            array_merge(
                $asGroup,
                [
                    'level' => 3
                    'min_salary' => 53139,
                    'max_salary' => 56390,
                ]
            ),
            array_merge(
                $asGroup,
                [
                    'level' => 4,
                    'min_salary' => 56951,
                    'max_salary' => 61594,
                ]
            ),
            array_merge(
                $asGroup,
                [
                    'level' => 5,
                    'min_salary' => 67981,
                    'max_salary' => 73495,
                ]
            ),
        ];
        foreach ($classifications as $classification) {
            $identifier = [
                'level' => $classification['level'],
                'group' => $classification['group'],
            ];
            Classification::updateOrCreate($identifier, $classification);
        }
    }
}

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
            'name' => ['en' => 'Information Technology', 'fr' => 'Technologie de l\'information'],
        ];
        $asGroup = [
            'group' => 'AS',
            'name' => ['en' => 'Administrative Services', 'fr' => 'Services administratifs'],
        ];
        // https://www.tbs-sct.canada.ca/agreements-conventions/view-visualiser-eng.aspx?id=15
        $pmGroup = [
            'group' => 'PM',
            'name' => ['en' => 'Programme Administration', 'fr' => 'Administration des programmes'],
        ];
        // https://www.tbs-sct.canada.ca/agreements-conventions/view-visualiser-eng.aspx?id=4
        $ecGroup = [
            'group' => 'EC',
            'name' => ['en' => 'Economics and Social Science Services', 'fr' => 'économique et services de sciences sociales'],
        ];

        $exGroup = [
            'group' => 'EX',
            'name' => ['en' => 'Executive', 'fr' => 'Cadre'],
        ];

        $crGroup = [
            'group' => 'CR',
            'name' => ['en' => 'Clerical and Regulatory', 'fr' => 'Commis aux écritures et aux règlements'],
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
                    'level' => 3,
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
                    'level' => 3,
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
            // https://www.tbs-sct.canada.ca/agreements-conventions/view-visualiser-eng.aspx?id=15#toc44294244301
            array_merge(
                $pmGroup,
                [
                    'level' => 1,
                    'min_salary' => 60424,
                    'max_salary' => 67582,
                ]
            ),
            array_merge(
                $pmGroup,
                [
                    'level' => 2,
                    'min_salary' => 67330,
                    'max_salary' => 72544,
                ]
            ),
            array_merge(
                $pmGroup,
                [
                    'level' => 3,
                    'min_salary' => 72171,
                    'max_salary' => 77758,
                ]
            ),
            array_merge(
                $pmGroup,
                [
                    'level' => 4,
                    'min_salary' => 78834,
                    'max_salary' => 85187,
                ]
            ),
            array_merge(
                $pmGroup,
                [
                    'level' => 5,
                    'min_salary' => 94113,
                    'max_salary' => 101750,
                ]
            ),
            array_merge(
                $pmGroup,
                [
                    'level' => 6,
                    'min_salary' => 110346,
                    'max_salary' => 126172,
                ]
            ),
            array_merge(
                $pmGroup,
                [
                    'level' => 7,
                    'min_salary' => 113939,
                    'max_salary' => 134111,
                ]
            ),
            // https://www.tbs-sct.canada.ca/agreements-conventions/view-visualiser-eng.aspx?id=4#tocxx338387
            array_merge(
                $ecGroup,
                [
                    'level' => 1,
                    'min_salary' => 59978,
                    'max_salary' => 69725,
                ]
            ),
            array_merge(
                $ecGroup,
                [
                    'level' => 2,
                    'min_salary' => 67102,
                    'max_salary' => 76933,
                ]
            ),
            array_merge(
                $ecGroup,
                [
                    'level' => 3,
                    'min_salary' => 74116,
                    'max_salary' => 83863,
                ]
            ),
            array_merge(
                $ecGroup,
                [
                    'level' => 4,
                    'min_salary' => 80005,
                    'max_salary' => 92587,
                ]
            ),
            array_merge(
                $ecGroup,
                [
                    'level' => 5,
                    'min_salary' => 95653,
                    'max_salary' => 110096,
                ]
            ),
            array_merge(
                $ecGroup,
                [
                    'level' => 6,
                    'min_salary' => 108068,
                    'max_salary' => 125332,
                ]
            ),
            array_merge(
                $ecGroup,
                [
                    'level' => 7,
                    'min_salary' => 122103,
                    'max_salary' => 140177,
                ]
            ),
            array_merge(
                $ecGroup,
                [
                    'level' => 8,
                    'min_salary' => 132754,
                    'max_salary' => 151729,
                ]
            ),
            array_merge(
                $exGroup,
                [
                    'level' => 3,
                    'min_salary' => 169165,
                    'max_salary' => 198939,
                ]
            ),
            array_merge(
                $exGroup,
                [
                    'level' => 4,
                    'min_salary' => 193896,
                    'max_salary' => 228114,
                ]
            ),
            array_merge(
                $crGroup,
                [
                    'level' => 4,
                    'min_salary' => 57217,
                    'max_salary' => 61761,
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

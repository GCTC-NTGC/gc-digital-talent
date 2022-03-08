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
        $groups = [
            [
                'group' => 'CS',
                'name' => ['en' => 'Computer Systems', 'fr' => 'Systèmes d\'ordinateurs'],
            ],
            [
                'group' => 'AS',
                'name' => ['en' => 'Administrative Services', 'fr' => 'Services des programmes et de l\'administration'],
            ],
            [
                'group' => 'EC',
                'name' => ['en' => 'Economics and Social Science Services', 'fr' => 'Économique et services de sciences sociales'],
            ],
            [
                'group' => 'PM',
                'name' => ['en' => 'Programme Administration', 'fr' => 'Administration des programmes'],
            ],
            [
                'group' => 'IS',
                'name' => ['en' => 'Information Services', 'fr' => 'Services d\'information'],
            ]
        ];
        $levels = [
            [
                'level' => 1,
                'min_salary' => 50000,
                'max_salary' => 80000
            ],
            [
                'level' => 2,
                'min_salary' => 65000,
                'max_salary' => 94000
            ],
            [
                'level' => 3,
                'min_salary' => 83000,
                'max_salary' => 113000
            ],
            [
                'level' => 4,
                'min_salary' => 94000,
                'max_salary' => 130000
            ],
            [
                'level' => 5,
                'min_salary' => 105000,
                'max_salary' => 157000
            ],
        ];
        foreach ($groups as $group) {
            foreach ($levels as $level) {
                $identifier = [
                    'level' => $level['level'],
                    'group' => $group['group'],
                ];
                $content = array_merge($group, $level);
                Classification::updateOrCreate($identifier, $content);
            }
        }
    }
}

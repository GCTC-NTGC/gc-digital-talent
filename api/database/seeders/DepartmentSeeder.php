<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $departments = [
        [
          'department_number' => 4,
          'name' => [
            'en' => 'Public Service Commission',
            'fr' => 'Commission de la fonction publique'
          ],
        ],
        [
          'department_number' => 6,
          'name' => [
            'en' => 'Finance (Department of)',
            'fr' => 'Finances (Ministère des)'
          ],
        ],
        [
          'department_number' => 22,
          'name' => [
            'en' => 'Health (Department of)',
            'fr' => 'Santé (Ministère de la)'
          ],
        ],
        [
          'department_number' => 34,
          'name' => [
            'en' => 'Transport (Department of)',
            'fr' => 'Transports (Ministère des)'
          ],
        ],
        [
          'department_number' => 56,
          'name' => [
            'en' => 'Treasury Board Secretariat',
            'fr' => 'Secrétariat du Conseil du Trésor'
          ],
        ],
      ];

      foreach ($departments as $department) {
        $identifier = [
          'department_number' => $department['department_number'],
        ];
        Department::updateOrCreate($identifier, $department);
      }
    }
}

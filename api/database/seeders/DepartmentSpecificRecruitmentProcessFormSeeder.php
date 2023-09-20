<?php

namespace Database\Seeders;

use App\Models\DepartmentSpecificRecruitmentProcessForm;
use Illuminate\Database\Seeder;

class DepartmentSpecificRecruitmentProcessFormSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DepartmentSpecificRecruitmentProcessForm::factory()->count(10)->create();
    }
}

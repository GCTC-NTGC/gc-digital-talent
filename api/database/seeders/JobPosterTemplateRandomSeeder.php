<?php

namespace Database\Seeders;

use App\Models\JobPosterTemplate;
use Illuminate\Database\Seeder;

class JobPosterTemplateRandomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        JobPosterTemplate::factory()
            ->count(3)
            ->withSkills()
            ->create();
    }
}

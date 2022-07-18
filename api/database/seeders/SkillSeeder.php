<?php

namespace Database\Seeders;

use App\Models\Skill;
use App\Models\SkillFamily;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        SkillFamily::factory()
            ->count(10)
            ->create();
        Skill::factory()
            ->count(40)
            ->afterCreating(function ($model) {
                $families = SkillFamily::inRandomOrder()->limit(3)->pluck('id')->toArray();
                $model->families()->sync($families);
            })
            ->create();
    }
}

<?php

namespace Database\Seeders;

use App\Models\AwardExperience;
use App\Models\CommunityExperience;
use App\Models\EducationExperience;
use App\Models\PersonalExperience;
use App\Models\Pool;
use App\Models\PoolCandidateFilter;
use App\Models\PoolCandidateSearchRequest;
use App\Models\Skill;
use App\Models\SkillFamily;
use App\Models\Team;
use App\Models\User;
use App\Models\WorkExperience;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $this->truncateTables();

        $this->call([
            // standard platform data
            RolePermissionSeeder::class,
            ClassificationSeeder::class,
            DepartmentSeeder::class,
            GenericJobTitleSeeder::class,
            SkillFamilySeeder::class,
            SkillSeeder::class,

            // convenient test data
            TeamSeeder::class,
            UserTestSeeder::class,
            PoolTestSeeder::class,
            AssessmentResultTestSeeder::class,

            // random data to fill it out
            TeamRandomSeeder::class,
            PoolRandomSeeder::class,
            UserSeederRandom::class,
            AssessmentResultRandomSeeder::class,
            SearchRequestRandomSeeder::class,
            DigitalContractingQuestionnaireRandomSeeder::class,
            DepartmentSpecificRecruitmentProcessFormRandomSeeder::class,
        ]);
    }

    // drop all rows from some tables so that the seeder can fill them fresh
    private function truncateTables()
    {
        AwardExperience::truncate();
        CommunityExperience::truncate();
        EducationExperience::truncate();
        PersonalExperience::truncate();
        WorkExperience::truncate();
        SkillFamily::truncate();
        Skill::truncate();
        DB::table('skill_skill_family')->truncate();
        PoolCandidateFilter::truncate();
        PoolCandidateSearchRequest::truncate();
        User::truncate();
        Pool::truncate();
        Team::truncate();
    }
}

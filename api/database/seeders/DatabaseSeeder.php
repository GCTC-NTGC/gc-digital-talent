<?php

namespace Database\Seeders;

use App\Enums\AssessmentResultType;
use App\Enums\EducationRequirementOption;
use App\Enums\PoolStream;
use App\Enums\PublishingGroup;
use App\Enums\SkillLevel;
use App\Enums\WhenSkillUsed;
use App\Models\ApplicantFilter;
use App\Models\AssessmentResult;
use App\Models\AssessmentStep;
use App\Models\AwardExperience;
use App\Models\Classification;
use App\Models\CommunityExperience;
use App\Models\EducationExperience;
use App\Models\PersonalExperience;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\PoolCandidateFilter;
use App\Models\PoolCandidateSearchRequest;
use App\Models\Skill;
use App\Models\SkillFamily;
use App\Models\Team;
use App\Models\User;
use App\Models\UserSkill;
use App\Models\WorkExperience;
use Carbon\Carbon;
use Faker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker\Factory::create();

        $this->truncateTables();

        // seed a test team and random teams
        Team::factory()->count(9)->create();

        $this->call(RolePermissionSeeder::class);
        $this->call(ClassificationSeeder::class);
        $this->call(DepartmentSeeder::class);
        $this->call(GenericJobTitleSeeder::class);
        $this->call(SkillFamilySeeder::class);
        $this->call(SkillSeeder::class);
        $this->call(TeamSeederLocal::class);
        $this->call(TeamSeeder::class);
        $this->call(UserSeederLocal::class);
        $this->call(PoolSeeder::class);
        $this->call(DigitalContractingQuestionnaireSeeder::class);
        $this->call(DepartmentSpecificRecruitmentProcessFormSeeder::class);

        // Seed random pools
        Pool::factory()->count(2)->draft()->create();
        Pool::factory()->count(6)
            ->published()
            ->withCompletePoolSkills()
            ->withAssessments()
            ->create();
        Pool::factory()->count(2)->closed()->create();
        Pool::factory()->count(2)->archived()->create();
        // Seed some expected values
        $this->seedPools();

        $digitalTalentPool = Pool::where('name->en', 'CMO Digital Careers')->sole();

        // Government employees (see asGovEmployee function in UserFactory for fields that are related to a user being a current Government of Canada employee).
        User::factory()
            ->count(75)
            ->withExperiences()
            ->asGovEmployee()
            ->afterCreating(function (User $user) use ($faker, $digitalTalentPool) {

                // pick a published pool in which to place this user
                // temporarily rig seeding to be biased towards slotting pool candidates into Digital Talent
                // digital careers is always published and strictly defined in PoolSeeder
                $randomPool = Pool::whereNotNull('published_at')->inRandomOrder()->first();
                $pool = $faker->boolean(25) ? $digitalTalentPool : $randomPool;

                // create a pool candidate in the pool - are they suspended?
                if (rand(0, 4) == 4) {
                    $this->seedSuspendedCandidate($user, $pool);
                } else {
                    $this->seedPoolCandidate($user, $pool);
                }
            })
            ->create();

        // applicant@test.com bespoke seeding
        $applicant = User::where('sub', 'applicant@test.com')->sole();
        $pool = Pool::whereNotNull('published_at')->inRandomOrder()->first();
        $this->seedPoolCandidate($applicant, $pool);
        $this->seedAwardExperienceForPool($applicant, $digitalTalentPool);
        $applicantUserSkills = $applicant->userSkills;
        foreach ($applicantUserSkills as $applicantUserSkill) {
            if ($faker->boolean(75)) {
                $applicantUserSkill->skill_level = $faker->randomElement(SkillLevel::cases())->name;
            }
            if ($faker->boolean(75)) {
                $applicantUserSkill->when_skill_used = $faker->randomElement(WhenSkillUsed::cases())->name;
            }
            $applicantUserSkill->save();
        }
        // Add skills to showcase lists
        // technical skills
        $applicantUserTechnicalSkills = UserSkill::where('user_id', $applicant->id)->whereHas('skill', function ($query) {
            $query->where('category', 'TECHNICAL');
        })->get();
        $applicantUserTechnicalSkills[0]->top_skills_rank = 1;
        $applicantUserTechnicalSkills[0]->save();
        $applicantUserTechnicalSkills[1]->top_skills_rank = 2;
        $applicantUserTechnicalSkills[1]->save();
        $applicantUserTechnicalSkills[2]->top_skills_rank = 3;
        $applicantUserTechnicalSkills[2]->improve_skills_rank = 1;
        $applicantUserTechnicalSkills[2]->save();
        // behavioural skills
        $applicantUserBehaviouralSkills = UserSkill::where('user_id', $applicant->id)->whereHas('skill', function ($query) {
            $query->where('category', 'BEHAVIOURAL');
        })->get();
        $applicantUserBehaviouralSkills[0]->top_skills_rank = 1;
        $applicantUserBehaviouralSkills[0]->save();
        $applicantUserBehaviouralSkills[1]->top_skills_rank = 2;
        $applicantUserBehaviouralSkills[1]->save();
        $applicantUserBehaviouralSkills[2]->top_skills_rank = 3;
        $applicantUserBehaviouralSkills[2]->improve_skills_rank = 1;
        $applicantUserBehaviouralSkills[2]->save();

        // Not government employees (see asGovEmployee function in UserFactory for fields that are related to a user being a current Government of Canada employee).
        User::factory()
            ->count(75)
            ->withExperiences()
            ->asGovEmployee(false)
            ->afterCreating(function (User $user) use ($faker, $digitalTalentPool) {

                // pick a published pool in which to place this user
                // temporarily rig seeding to be biased towards slotting pool candidates into Digital Talent
                // digital careers is always published and strictly defined in PoolSeeder
                $randomPool = Pool::whereNotNull('published_at')->inRandomOrder()->first();
                $pool = $faker->boolean(25) ? $digitalTalentPool : $randomPool;

                // create a pool candidate in the pool - are they suspended?
                if (rand(0, 4) == 4) {
                    $this->seedSuspendedCandidate($user, $pool);
                } else {
                    $this->seedPoolCandidate($user, $pool);
                }
            })
            ->create();

        // attach either a work or education experience to a pool candidate to meet minimum criteria
        PoolCandidate::all()->load('user')->each(function ($poolCandidate) {
            $educationRequirementOption = $poolCandidate->education_requirement_option;
            $user = $poolCandidate->user;

            if ($educationRequirementOption === EducationRequirementOption::EDUCATION->name) {
                //Ensure user has at least one education experience
                $experience = EducationExperience::factory()->create([
                    'user_id' => $user->id,
                ]);
                $poolCandidate->educationRequirementEducationExperiences()->sync([$experience->id]);
            } elseif ($educationRequirementOption === EducationRequirementOption::APPLIED_WORK->name) {
                //Ensure user has at least one work experience
                $experience = WorkExperience::factory()->create([
                    'user_id' => $user->id,
                ]);
                $poolCandidate->educationRequirementWorkExperiences()->sync([$experience->id]);
            }
        });

        // Create some SearchRequests
        PoolCandidateSearchRequest::factory()->count(50)->create([
            'applicant_filter_id' => ApplicantFilter::factory()->sparse()->withRelationships(true),
        ]);

        // Create some AssessmentResults, and some bespoke to one pool
        $this->seedAssessmentResults($digitalTalentPool);
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

    private function seedPoolCandidate(User $user, Pool $pool)
    {
        // create a pool candidate in the pool
        PoolCandidate::factory()->for($user)->for($pool)
            ->afterCreating(function (PoolCandidate $candidate) {
                if ($candidate->submitted_at) {
                    $candidate->createSnapshot();
                }
            })
            ->create();
    }

    private function seedAwardExperienceForPool(User $user, Pool $pool)
    {
        // attach an award experience to a given user that has all the essential skills of a given pool
        $faker = Faker\Factory::create();
        $essentialSkillIds = $pool->essentialSkills()->pluck('skills.id');

        if ($essentialSkillIds->isNotEmpty()) {
            $data = $essentialSkillIds->map(function ($id) use ($faker) {
                return ['id' => $id, 'details' => $faker->text()];
            });
            AwardExperience::factory()->for($user)
                ->afterCreating(function ($model) use ($data) {
                    $model->syncSkills($data);
                })->create();
        }
    }

    private function seedSuspendedCandidate(User $user, Pool $pool)
    {
        // create a suspended pool candidate in the pool
        PoolCandidate::factory()->suspended()->for($user)->for($pool)
            ->afterCreating(function (PoolCandidate $candidate) {
                if ($candidate->submitted_at) {
                    $candidate->createSnapshot();
                }
            })
            ->create();
    }

    private function seedPools()
    {
        $faker = Faker\Factory::create();

        $publishingGroups = [
            PublishingGroup::IT_JOBS->name,
            PublishingGroup::IT_JOBS_ONGOING->name,
        ];
        $dates = [
            'FAR_PAST' => Carbon::create(1992, 10, 24),
            'FAR_FUTURE' => Carbon::create(2999, 10, 24),
        ];

        $classifications = Classification::where('group', 'IT')
            ->where('level', '<', 5)
            ->get();

        $testTeamId = Team::where('name', 'test-team')->sole()['id'];

        foreach ($classifications as $classification) {
            foreach ($publishingGroups as $publishingGroup) {
                foreach ($dates as $date) {
                    Pool::factory()->published()->afterCreating(function ($pool) use ($classification) {
                        $pool->classifications()->sync([$classification->id]);
                    })->create([
                        'closing_date' => $date,
                        'publishing_group' => $publishingGroup,
                        'published_at' => $faker->dateTimeBetween('-1 year', 'now'),
                        'stream' => $faker->randomElement(PoolStream::cases())->name,
                        'team_id' => $testTeamId,
                    ]);
                }
            }
        }
    }

    private function seedAssessmentResults(Pool $pool)
    {
        // regular random
        $assessmentSteps = AssessmentStep::inRandomOrder()->with('pool')->limit(10)->get();

        foreach ($assessmentSteps as $assessmentStep) {
            $poolSkillIds = $assessmentStep->pool->poolSkills()->pluck('id')->toArray();
            $poolCandidate = PoolCandidate::factory()->create([
                'pool_id' => $assessmentStep->pool_id,
            ]);

            AssessmentResult::factory()->withResultType(AssessmentResultType::EDUCATION)->create([
                'assessment_step_id' => $assessmentStep->id,
                'pool_candidate_id' => $poolCandidate->id,
            ]);
            AssessmentResult::factory()->withResultType(AssessmentResultType::SKILL)->create([
                'assessment_step_id' => $assessmentStep->id,
                'pool_candidate_id' => $poolCandidate->id,
                'pool_skill_id' => count($poolSkillIds) > 0 ? $poolSkillIds[0] : null,
            ]);
            AssessmentResult::factory()->withResultType(AssessmentResultType::SKILL)->create([
                'assessment_step_id' => $assessmentStep->id,
                'pool_candidate_id' => $poolCandidate->id,
                'pool_skill_id' => count($poolSkillIds) > 0 ? $poolSkillIds[1] : null,
            ]);
        }

        // specific pool
        $poolCandidate = PoolCandidate::factory()->create([
            'pool_id' => $pool->id,
        ]);
        $dcmPoolSkills = $pool->poolSkills()->pluck('id')->toArray();
        $dcmAssessment1 = AssessmentStep::factory()->create([
            'pool_id' => $pool->id,
        ]);
        $dcmAssessment2 = AssessmentStep::factory()->create([
            'pool_id' => $pool->id,
        ]);
        AssessmentResult::factory()->withResultType(AssessmentResultType::EDUCATION)->create([
            'assessment_step_id' => $dcmAssessment1->id,
            'pool_candidate_id' => $poolCandidate->id,
        ]);
        AssessmentResult::factory()->withResultType(AssessmentResultType::SKILL)->create([
            'assessment_step_id' => $dcmAssessment2->id,
            'pool_candidate_id' => $poolCandidate->id,
            'pool_skill_id' => $dcmPoolSkills[0],
        ]);
        AssessmentResult::factory()->withResultType(AssessmentResultType::SKILL)->create([
            'assessment_step_id' => $dcmAssessment2->id,
            'pool_candidate_id' => $poolCandidate->id,
            'pool_skill_id' => $dcmPoolSkills[1],
        ]);
    }
}

<?php

namespace Database\Seeders;

use App\Enums\SkillLevel;
use App\Enums\WhenSkillUsed;
use App\Models\AwardExperience;
use App\Models\Community;
use App\Models\CommunityExperience;
use App\Models\CommunityInterest;
use App\Models\EducationExperience;
use App\Models\PersonalExperience;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use App\Models\UserSkill;
use App\Models\WorkExperience;
use Faker\Generator;
use Illuminate\Container\Container;
use Illuminate\Database\Seeder;

class UserRandomSeeder extends Seeder
{
    /**
     * The current Faker instance.
     *
     * @var \Faker\Generator
     */
    protected $faker;

    /**
     * Create a new seeder instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->faker = Container::getInstance()->make(Generator::class);
    }

    /**
     * Seeds initial user records into that database.
     * These users are only useful for testing locally.
     *
     * @return void
     */
    public function run()
    {
        $digitalTalentPool = Pool::select('id')->where('name->en', 'CMO Digital Careers')->sole();
        $publishedPools = Pool::select('id')->whereNotNull('published_at')->get();

        // Government employees (see asGovEmployee function in UserFactory for fields that are related to a user being a current Government of Canada employee).
        User::factory()
            ->count(2)
            ->withSkillsAndExperiences()
            ->asGovEmployee()
            ->afterCreating(function (User $user) use ($digitalTalentPool, $publishedPools) {

                // pick a published pool in which to place this user
                // temporarily rig seeding to be biased towards slotting pool candidates into Digital Talent
                // digital careers is always published and strictly defined in PoolSeeder
                $pool = $this->faker->boolean(25) ? $digitalTalentPool : $publishedPools->random();

                // create a pool candidate in the pool - are they suspended?
                if (rand(0, 4) == 4) {
                    $this->seedExperienceForPoolWithEssentialSkills($user, $pool);
                    $this->seedSuspendedCandidate($user, $pool);
                } else {
                    $this->seedExperienceForPoolWithEssentialSkills($user, $pool);
                    $this->seedPoolCandidate($user, $pool);
                }
            })
            ->createQuietly();

        // applicant@test.com bespoke seeding
        $applicant = User::where('sub', 'applicant@test.com')->sole();
        // The two community interests pre-seeded in UserTestSeeder don't have development programs
        CommunityInterest::factory()
            ->for($applicant)
            ->for(Community::whereHas('developmentPrograms')->get('id')->pluck('id')->first())
            ->withDevelopmentProgramInterests()
            ->create();
        $this->seedPoolCandidate($applicant, $publishedPools->random());
        $this->seedExperienceForPoolWithEssentialSkills($applicant, $digitalTalentPool);
        $applicantUserSkills = $applicant->userSkills;
        foreach ($applicantUserSkills as $applicantUserSkill) {
            if ($this->faker->boolean(75)) {
                $applicantUserSkill->skill_level = $this->faker->randomElement(SkillLevel::cases())->name;
            }
            if ($this->faker->boolean(75)) {
                $applicantUserSkill->when_skill_used = $this->faker->randomElement(WhenSkillUsed::cases())->name;
            }
            $applicantUserSkill->save();
        }
        // Add skills to showcase lists
        // technical skills
        $applicantUserTechnicalSkills = UserSkill::where('user_id', $applicant->id)->whereHas('skill', function ($query) {
            $query->where('category', 'TECHNICAL');
        })->get();
        if ($applicantUserTechnicalSkills->has(0)) {
            $applicantUserTechnicalSkills[0]->top_skills_rank = 1;
            $applicantUserTechnicalSkills[0]->save();
        }
        if ($applicantUserTechnicalSkills->has(1)) {
            $applicantUserTechnicalSkills[1]->top_skills_rank = 2;
            $applicantUserTechnicalSkills[1]->save();
        }
        if ($applicantUserTechnicalSkills->has(2)) {
            $applicantUserTechnicalSkills[2]->top_skills_rank = 3;
            $applicantUserTechnicalSkills[2]->improve_skills_rank = 1;
            $applicantUserTechnicalSkills[2]->save();
        }
        // behavioural skills
        $applicantUserBehaviouralSkills = UserSkill::where('user_id', $applicant->id)->whereHas('skill', function ($query) {
            $query->where('category', 'BEHAVIOURAL');
        })->get();
        if ($applicantUserBehaviouralSkills->has(0)) {
            $applicantUserBehaviouralSkills[0]->top_skills_rank = 1;
            $applicantUserBehaviouralSkills[0]->save();
        }
        if ($applicantUserBehaviouralSkills->has(1)) {
            $applicantUserBehaviouralSkills[1]->top_skills_rank = 2;
            $applicantUserBehaviouralSkills[1]->save();
        }
        if ($applicantUserBehaviouralSkills->has(2)) {
            $applicantUserBehaviouralSkills[2]->top_skills_rank = 3;
            $applicantUserBehaviouralSkills[2]->improve_skills_rank = 1;
            $applicantUserBehaviouralSkills[2]->save();
        }

        // Not government employees (see asGovEmployee function in UserFactory for fields that are related to a user being a current Government of Canada employee).
        User::factory()
            ->count(10)
            ->withSkillsAndExperiences()
            ->asGovEmployee(false)
            ->afterCreating(function (User $user) use ($digitalTalentPool, $publishedPools) {

                // pick a published pool in which to place this user
                // temporarily rig seeding to be biased towards slotting pool candidates into Digital Talent
                // digital careers is always published and strictly defined in PoolSeeder
                $pool = $this->faker->boolean(25) ? $digitalTalentPool : $publishedPools->random();
                // create a pool candidate in the pool - are they suspended?
                if (rand(0, 4) == 4) {
                    $this->seedExperienceForPoolWithEssentialSkills($user, $pool);
                    $this->seedSuspendedCandidate($user, $pool);
                } else {
                    $this->seedExperienceForPoolWithEssentialSkills($user, $pool);
                    $this->seedPoolCandidate($user, $pool);
                }
            })
            ->createQuietly();
    }

    private function seedPoolCandidate(User $user, Pool $pool)
    {
        // create a pool candidate in the pool
        PoolCandidate::factory()->for($user)->for($pool)
            ->afterCreating(function (PoolCandidate $candidate) {
                if ($candidate->submitted_at) {
                    $candidate->setApplicationSnapshot();
                }
            })
            ->createQuietly();
    }

    private function seedExperienceForPoolWithEssentialSkills(User $user, Pool $pool)
    {
        $experienceFactories = [
            AwardExperience::factory(),
            CommunityExperience::factory(),
            EducationExperience::factory(),
            PersonalExperience::factory(),
            WorkExperience::factory(),
        ];

        // attach an experience to a given user that has all the essential skills of a given pool
        $essentialSkillIds = $pool->essentialSkills()->pluck('skills.id');

        if ($essentialSkillIds->isNotEmpty()) {
            $data = $essentialSkillIds->map(function ($id) {
                return ['id' => $id, 'details' => $this->faker->text()];
            });
            $experienceFactory = $this->faker->randomElement($experienceFactories);
            $experienceFactory->for($user)
                ->afterCreating(function ($model) use ($data) {
                    $model->syncSkills($data);
                })->createQuietly();
        }
    }

    private function seedSuspendedCandidate(User $user, Pool $pool)
    {
        // create a suspended pool candidate in the pool
        PoolCandidate::factory()->suspended()->for($user)->for($pool)
            ->afterCreating(function (PoolCandidate $candidate) {
                if ($candidate->submitted_at) {
                    $candidate->setApplicationSnapshot();
                }
            })
            ->createQuietly();
    }
}

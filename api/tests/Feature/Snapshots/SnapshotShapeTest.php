<?php

namespace Tests\Feature\Snapshots;

use App\Models\AwardExperience;
use App\Models\Classification;
use App\Models\Community;
use App\Models\CommunityExperience;
use App\Models\Department;
use App\Models\EducationExperience;
use App\Models\OffPlatformRecruitmentProcess;
use App\Models\PersonalExperience;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Skill;
use App\Models\User;
use App\Models\UserSkill;
use App\Models\WorkExperience;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Tests\TestCase;

class SnapshotShapeTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    protected $ignoredFields = [
        Classification::class => [
            'createdAt',
            'updatedAt',
            'deletedAt',
        ],
        Department::class => [
            'createdAt',
            'updatedAt',
            'deletedAt',
            'archivedAt',
            'orgIdentifier',
            'size',
            'isCorePublicAdministration',
            'isCentralAgency',
            'isScience',
            'isRegulatory',
        ],
        OffPlatformRecruitmentProcess::class => [
            'userId',
            'createdAt',
            'updatedAt',
        ],
        Skill::class => [
            'category',
            'createdAt',
            'updatedAt',
            'deletedAt',
        ],
        User::class => [
            'sub',
            'password',
            'createdAt',
            'updatedAt',
            'deletedAt',
            'computedIsGovEmployee',
            'computedGovEmployeeType',
            'priorityWeight',
            'enabledEmailNotifications',
            'enabledInAppNotifications',
            'emailVerifiedAt',
            'workEmailVerifiedAt',
            'lastSignInAt',
            'careerPlanningMentorshipStatus',
            'careerPlanningMentorshipInterest',
            'careerPlanningExecInterest',
            'careerPlanningExecCoachingStatus',
            'careerPlanningExecCoachingInterest',
            'careerPlanningAboutYou',
            'careerPlanningLearningGoals',
            'careerPlanningWorkStyle',
            'computedGovPositionType',
            'computedGovEndDate',
            'nextRoleClassificationId',
            'careerObjectiveClassificationId',
            'nextRoleTargetRole',
            'careerObjectiveTargetRole',
            'nextRoleTargetRoleOther',
            'careerObjectiveTargetRoleOther',
            'nextRoleJobTitle',
            'careerObjectiveJobTitle',
            'nextRoleCommunityId',
            'careerObjectiveCommunityId',
            'nextRoleAdditionalInformation',
            'careerObjectiveAdditionalInformation',
            'careerPlanningLateralMoveInterest',
            'careerPlanningLateralMoveTimeFrame',
            'careerPlanningLateralMoveOrganizationType',
            'careerPlanningPromotionMoveInterest',
            'careerPlanningPromotionMoveTimeFrame',
            'careerPlanningPromotionMoveOrganizationType',
            'computedGovRole',
            'nextRoleCommunityOther',
            'careerObjectiveCommunityOther',
            'eligibleRetirementYearKnown',
            'eligibleRetirementYear',
            'nextRoleIsCSuiteRole',
            'careerObjectiveIsCSuiteRole',
            'nextRoleCSuiteRoleTitle',
            'careerObjectiveCSuiteRoleTitle',
            'careerPlanningLearningOpportunitiesInterest',
        ],
        UserSkill::class => [
            'userId',
            'skillLevel',
            'whenSkillUsed',
            'topSkillsRank',
            'improveSkillsRank',
            'createdAt',
            'updatedAt',
            'deletedAt',
        ],
        AwardExperience::class => [
            'userId',
            'createdAt',
            'updatedAt',
            'deletedAt',
        ],
        CommunityExperience::class => [
            'userId',
            'createdAt',
            'updatedAt',
            'deletedAt',
        ],
        EducationExperience::class => [
            'userId',
            'createdAt',
            'updatedAt',
            'deletedAt',
        ],
        PersonalExperience::class => [
            'userId',
            'createdAt',
            'updatedAt',
            'deletedAt',
        ],
        WorkExperience::class => [
            'userId',
            'createdAt',
            'updatedAt',
            'deletedAt',
        ],
    ];

    // Map database foreign key columns (in camelCase) to their model names
    protected $relationToModel = [
        'classificationId' => Classification::class,
        'computedClassification' => Classification::class,
        'classification' => Classification::class,

        'department' => Department::class,
        'departmentId' => Department::class,
        'computedDepartment' => Department::class,

        'offPlatformRecruitmentProcesses' => OffPlatformRecruitmentProcess::class,

        'skill' => Skill::class,
        'skillId' => Skill::class,
        'userSkills' => UserSkill::class,
    ];

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function testSnapshotShape()
    {
        $community = Community::factory()->create();
        $user = User::factory()
            ->asApplicant()
            ->withSkillsAndExperiences()
            ->asGovEmployee()
            ->withEmployeeProfile()
            ->withCommunityInterests([$community->id])
            ->withOffPlatformRecruitmentProcesses()
            ->create();
        $pool = Pool::factory()->withAssessments(3)->published()->create();
        $poolCandidate = PoolCandidate::factory()
            ->withAssessmentResults()
            ->withSnapshot()
            ->create([
                'user_id' => $user->id,
                'pool_id' => $pool->id,
            ]);

        $snapshot = $poolCandidate->profile_snapshot;

        $missingFields = [];
        $this->checkSnapshotShape($snapshot, User::class, $missingFields);
        $this->assertEmpty($missingFields, implode("\n", $missingFields));
    }

    protected function checkSnapshotShape($data, $modelClass, &$errors)
    {
        if (is_array($data)) {
            $ignored = $this->ignoredFields[$modelClass] ?? [];
            $table = (new $modelClass)->getTable();
            $attributes = Schema::getColumnListing($table);

            // Go over all attributes and confirm:
            //   - It is not ignored
            //   - It appears in the snapshot
            //   - It is not a relation
            foreach ($attributes as $att) {
                $field = Str::camel($att);
                if (! in_array($field, $ignored) && ! array_key_exists($field, $data) && ! array_key_exists($field, $this->relationToModel)) {
                    $errors[] = "Missing required field '$field' for model '$modelClass'.";
                }
            }

            // Recursively go through the data to check shape of relationsips
            foreach ($data as $key => $value) {
                if (isset($this->relationToModel[$key])) {
                    $relatedClass = $this->relationToModel[$key];
                    if (is_array($value)) {
                        if (Arr::isAssoc($value)) {
                            $this->checkSnapshotShape($value, $relatedClass, $errors);
                        } else {
                            foreach ($value as $item) {
                                $this->checkSnapshotShape($item, $relatedClass, $errors);
                            }
                        }
                    }
                } elseif ($key === 'experiences') {
                    // Special handling for experiences
                    foreach ($value as $subValue) {
                        $class = sprintf("App\Models\%s", $subValue['__typename']);
                        $this->checkSnapshotShape($subValue, $class, $errors);
                    }
                }
            }
        }
    }
}

<?php

namespace Tests\Feature;

use App\Enums\ApplicationStatus;
use App\Enums\ArmedForcesStatus;
use App\Enums\AssessmentStepType;
use App\Enums\ClaimVerificationResult;
use App\Enums\EducationRequirementOption;
use App\Enums\ErrorCode;
use App\Enums\PoolAreaOfSelection;
use App\Enums\PoolLanguage;
use App\Enums\SkillCategory;
use App\Facades\Notify;
use App\Models\AssessmentStep;
use App\Models\AwardExperience;
use App\Models\Community;
use App\Models\EducationExperience;
use App\Models\GeneralQuestion;
use App\Models\GeneralQuestionResponse;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\ScreeningQuestion;
use App\Models\ScreeningQuestionResponse;
use App\Models\Skill;
use App\Models\User;
use App\Models\WorkExperience;
use Carbon\Carbon;
use Database\Seeders\ClassificationSeeder;
use Database\Seeders\GenericJobTitleSeeder;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SkillFamilySeeder;
use Database\Seeders\SkillSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Config;
use Illuminate\Testing\Fluent\AssertableJson;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

use function PHPUnit\Framework\assertEquals;
use function PHPUnit\Framework\assertNotNull;
use function PHPUnit\Framework\assertSame;

class PoolApplicationTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;
    use WithFaker;

    protected $applicantUser;

    protected $communityRecruiter;

    protected $uuid;

    protected $toBeDeleted;

    protected $unauthenticatedMessage = 'Unauthenticated.';

    protected $unauthorizedMessage = 'This action is unauthorized.';

    protected $queryDocument =
        /** @lang GraphQL */
        '
        query poolCandidate($id: UUID!) {
            poolCandidate(id: $id) {
                status { value }
            }
        }
    ';

    protected $createMutationDocument =
        /** @lang GraphQL */
        '
        mutation createApplication($userId: ID!, $poolId: ID!){
            createApplication(userId: $userId, poolId: $poolId) {
                user {
                    id
                }
                pool {
                    id
                }
                status { value }
            }
        }
    ';

    protected $deleteMutationDocument =
        /** @lang GraphQL */
        '
        mutation deleteApplication($id: ID!) {
            deleteApplication(id: $id) {
                id
            }
        }
    ';

    protected $suspendMutationDocument =
        /** @lang GraphQL */
        '
        mutation suspendApplication($id: ID!, $isSuspended: Boolean!) {
            changeApplicationSuspendedAt(id: $id, isSuspended: $isSuspended) {
                suspendedAt
            }
        }
    ';

    protected $submitMutationDocument =
        /** @lang GraphQL */
        '
        mutation submitTest($id: ID!, $sig: String!) {
            submitApplication(id: $id, signature: $sig) {
                submittedAt
                signature
                status { value }
            }
        }
    ';

    protected $govEmployee;

    protected $nonGovEmployee;

    protected function setUp(): void
    {
        parent::setUp();
        Notify::spy(); // don't send any notifications
        // Run necessary seeders
        $this->seed(ClassificationSeeder::class);
        $this->seed(GenericJobTitleSeeder::class);
        $this->seed(SkillFamilySeeder::class);
        $this->seed(SkillSeeder::class);
        $this->seed(RolePermissionSeeder::class);

        $this->setUpFaker();

        $community = Community::factory()->create();

        $this->applicantUser = User::factory()
            ->asApplicant()
            ->create([
                'email' => 'applicant-user@test.com',
                'email_verified_at' => config('constants.past_date'),
                'sub' => 'applicant-user@test.com',
            ]);

        $this->govEmployee = User::factory()
            ->asApplicant()
            ->withGovEmployeeProfile()
            ->create([
                'email_verified_at' => config('constants.past_date'),
            ]);

        $this->nonGovEmployee = User::factory()
            ->asApplicant()
            ->withNonGovProfile()
            ->create([
                'email_verified_at' => config('constants.past_date'),
            ]);

        $this->communityRecruiter = User::factory()
            ->asApplicant()
            ->asCommunityRecruiter($community->id)
            ->create([
                'email' => 'community-recruiter@test.com',
                'sub' => 'community-recruiter@test.com',
            ]);
    }

    public function testApplicationCreation(): void
    {
        // create an unexpired Pool instance
        $pool = Pool::factory()->published()->create([
            'advertisement_language' => PoolLanguage::ENGLISH->name, // avoid language requirements
            'area_of_selection' => PoolAreaOfSelection::PUBLIC->name, // avoid email requirements
        ]);

        $variables = [
            'userId' => $this->applicantUser->id,
            'poolId' => $pool->id,
        ];

        $result = [
            'data' => [
                'createApplication' => [
                    'user' => [
                        'id' => $this->applicantUser->id,
                    ],
                    'pool' => [
                        'id' => $pool->id,
                    ],
                    'status' => [
                        'value' => ApplicationStatus::DRAFT->name,
                    ],
                ],
            ],
        ];

        // Guest users cannot create applications
        $this->graphQL($this->createMutationDocument, $variables)
            ->assertGraphQLErrorMessage($this->unauthorizedMessage);

        // Assert creating a pool application succeeds
        // returns DRAFT as a result of application_status Accessor and unexpired pool
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL($this->createMutationDocument, $variables)
            ->assertJson($result);

        // rerun the query above, it should successfully return the same result
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL($this->createMutationDocument, $variables)
            ->assertJson($result);

        // despite running the query twice, only one PoolCandidate entry should exist
        // assert count of applications is equal to 1
        $applicationCollection = PoolCandidate::all();
        $applicationCollectionCount = count($applicationCollection);
        $this->assertEquals(1, $applicationCollectionCount);
    }

    public function testUserCannotApplyToDraftPool(): void
    {
        $pool = Pool::factory()->create([
            'id' => '3ecf840d-b0ed-4207-8fc4-f45c4a865eaf',
            'published_at' => null,
            'closing_date' => config('constants.far_future_date'),
            'advertisement_language' => PoolLanguage::ENGLISH->name, // avoid language requirements
            'area_of_selection' => PoolAreaOfSelection::PUBLIC->name, // avoid email requirements
        ]);

        $variables = [
            'userId' => $this->applicantUser->id,
            'poolId' => $pool->id,
        ];

        $result = [
            'data' => [
                'createApplication' => null,
            ],
            'errors' => [[
                'message' => ErrorCode::APPLICATION_POOL_NOT_PUBLISHED->name,
            ]],
        ];

        $this->actingAs($this->applicantUser, 'api')
            ->graphQL($this->createMutationDocument, $variables)
            ->assertJson($result);
    }

    public function testUserCannotApplyToExpiredPool(): void
    {
        $pool = Pool::factory()->create([
            'id' => 'f755f7da-c490-4fe1-a1f0-a6c233796442',
            'published_at' => null,
            'closing_date' => config('constants.far_past_date'),
            'advertisement_language' => PoolLanguage::ENGLISH->name, // avoid language requirements
            'area_of_selection' => PoolAreaOfSelection::PUBLIC->name, // avoid email requirements
        ]);

        $variables = [
            'userId' => $this->applicantUser->id,
            'poolId' => $pool->id,
        ];

        $result = [
            'data' => [
                'createApplication' => null,
            ],
            'errors' => [[
                'message' => ErrorCode::APPLICATION_POOL_NOT_PUBLISHED->name,
            ]],
        ];

        $this->actingAs($this->applicantUser, 'api')
            ->graphQL($this->createMutationDocument, $variables)
            ->assertJson($result);
    }

    public function testApplicationSubmit(): void
    {
        Config::set('feature.application_email_verification', true); // this line should be removed once the feature flag FEATURE_APPLICATION_EMAIL_VERIFICATION is removed.

        // pool with no essential skills
        $newPool = Pool::factory()->create([
            'closing_date' => Carbon::now()->addDays(1),
            'advertisement_language' => PoolLanguage::ENGLISH->name, // avoid language requirements
            'area_of_selection' => PoolAreaOfSelection::PUBLIC->name, // avoid email requirements
        ]);
        $newPool->essentialSkills()->sync([]);

        $newPoolCandidate = PoolCandidate::factory()->create([
            'user_id' => $this->applicantUser->id,
            'pool_id' => $newPool->id,
            'application_status' => ApplicationStatus::DRAFT->name,
        ]);
        $educationExperience = EducationExperience::factory()->create(['user_id' => $newPoolCandidate->user_id]);
        $newPoolCandidate->educationRequirementEducationExperiences()->sync([$educationExperience->id]);

        $submitArgs = [
            'id' => $newPoolCandidate->id,
            'sig' => 'SIGNED',
        ];

        // Assert users who do not own the pool candidate cannot submit
        $this->graphQL($this->submitMutationDocument, $submitArgs)
            ->assertGraphQLErrorMessage($this->unauthenticatedMessage);

        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($this->submitMutationDocument, $submitArgs)
            ->assertGraphQLErrorMessage($this->unauthorizedMessage);

        // make user incomplete
        $this->applicantUser->armed_forces_status = null;
        $this->applicantUser->save();

        // assert incomplete user cannot submit application
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL($this->submitMutationDocument, $submitArgs)->assertJson([
                'errors' => [[
                    'message' => ErrorCode::APPLICATION_PROFILE_INCOMPLETE->name,
                ]],
            ]);

        // make contact email unverified instead
        $this->applicantUser->armed_forces_status = ArmedForcesStatus::VETERAN->name;
        $this->applicantUser->email_verified_at = null;
        $this->applicantUser->save();

        // assert contact email must also be verified
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL($this->submitMutationDocument, $submitArgs)->assertJson([
                'errors' => [[
                    'message' => ErrorCode::APPLICATION_PROFILE_INCOMPLETE->name,
                ]],
            ]);

        // make user now complete
        $this->applicantUser->email_verified_at = config('constants.past_date');
        $this->applicantUser->save();

        // assert complete user can submit application
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL($this->submitMutationDocument, $submitArgs)
            ->assertJson(
                fn (AssertableJson $json) => $json->has(
                    'data',
                    fn ($json) => $json->has(
                        'submitApplication',
                        fn ($json) => $json->has('signature')
                            ->has('status')
                            ->has('submittedAt')
                            ->whereType('submittedAt', 'string')
                    )
                )
            );

        // assert user cannot re-submit application
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL($this->submitMutationDocument, $submitArgs)
            ->assertJson([
                'errors' => [[
                    'message' => ErrorCode::APPLICATION_ALREADY_SUBMITTED->name,
                ]],
            ]);
    }

    public function testApplicationSubmitSignature(): void
    {
        $newPool = Pool::factory()->create([
            'closing_date' => Carbon::now()->addDays(1),
            'advertisement_language' => PoolLanguage::ENGLISH->name, // avoid language requirements
            'area_of_selection' => PoolAreaOfSelection::PUBLIC->name, // avoid email requirements
        ]);
        $newPool->essentialSkills()->sync([]);

        $newPoolCandidate = PoolCandidate::factory()->create([
            'user_id' => $this->applicantUser->id,
            'pool_id' => $newPool->id,
            'application_status' => ApplicationStatus::DRAFT->name,
        ]);
        $educationExperience = EducationExperience::factory()->create(['user_id' => $newPoolCandidate->user_id]);
        $newPoolCandidate->educationRequirementEducationExperiences()->sync([$educationExperience->id]);

        // assert empty signature submission errors
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL(
                $this->submitMutationDocument,
                [
                    'id' => $newPoolCandidate->id,
                    'sig' => '',
                ]
            )->assertJson([
                'errors' => [[
                    'message' => 'Variable "$sig" of non-null type "String!" must not be null.',
                ]],
            ]);

        // assert null signature submission errors
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL(
                $this->submitMutationDocument,
                [
                    'id' => $newPoolCandidate->id,
                    'sig' => null,
                ]
            )->assertJson([
                'errors' => [[
                    'message' => 'Variable "$sig" of non-null type "String!" must not be null.',
                ]],
            ]);

        // assert query above re-submitted with a filled signature field this time succeeds
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL(
                $this->submitMutationDocument,
                [
                    'id' => $newPoolCandidate->id,
                    'sig' => 'SIGNATURE',
                ]
            )->assertJson(
                fn (AssertableJson $json) => $json->has(
                    'data',
                    fn ($json) => $json->has(
                        'submitApplication',
                        fn ($json) => $json->has('submittedAt')
                            ->has('status')
                            ->has('signature')
                            ->whereType('submittedAt', 'string')
                    )
                )
            );
    }

    public function testApplicationSubmitWithoutEssentialTechnicalSkills(): void
    {
        // create a pool, attach one essential skill to it
        $newPool = Pool::factory()->withPoolSkills(1, 0)->create([
            'closing_date' => Carbon::now()->addDays(1),
            'advertisement_language' => PoolLanguage::ENGLISH->name, // avoid language requirements
            'area_of_selection' => PoolAreaOfSelection::PUBLIC->name, // avoid email requirements
        ]);

        // technical essential skills are required
        $technicalSkill = Skill::factory()->create(['category' => SkillCategory::TECHNICAL->name]);
        $newPool->setEssentialPoolSkills([$technicalSkill->id]);

        // create an experience with no skills, then attach it to the user
        WorkExperience::factory()->create([
            'user_id' => $this->applicantUser->id,
        ]);

        $newPoolCandidate = PoolCandidate::factory()->create([
            'user_id' => $this->applicantUser->id,
            'pool_id' => $newPool->id,
            'application_status' => ApplicationStatus::DRAFT->name,
        ]);

        // Refresh the data from the database to ensure it is correctly loaded
        $this->applicantUser->refresh();
        $newPool->refresh();
        $newPoolCandidate->refresh();

        // assert user cannot submit application with missing essential skills
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL(
                $this->submitMutationDocument,
                [
                    'id' => $newPoolCandidate->id,
                    'sig' => 'SIGNED',
                ]
            )->assertJson([
                'errors' => [[
                    'message' => ErrorCode::APPLICATION_MISSING_ESSENTIAL_SKILLS->name,
                ]],
            ]);
    }

    public function testApplicationSubmitWithEssentialTechnicalSkills(): void
    {
        // create a pool, attach one essential skill to it
        $newPool = Pool::factory()->withPoolSkills(1, 0)->create([
            'closing_date' => Carbon::now()->addDays(1),
            'advertisement_language' => PoolLanguage::ENGLISH->name, // avoid language requirements
            'area_of_selection' => PoolAreaOfSelection::PUBLIC->name, // avoid email requirements
        ]);

        // technical essential skills are required
        $technicalSkill = Skill::factory()->create(['category' => SkillCategory::TECHNICAL->name]);
        $newPool->setEssentialPoolSkills([$technicalSkill->id]);

        $newPoolCandidate = PoolCandidate::factory()->create([
            'user_id' => $this->applicantUser->id,
            'pool_id' => $newPool->id,
            'application_status' => ApplicationStatus::DRAFT->name,
        ]);

        $educationExperience = EducationExperience::factory()->create(['user_id' => $newPoolCandidate->user_id]);
        $newPoolCandidate->educationRequirementEducationExperiences()->sync([$educationExperience->id]);

        // create award experience, then attach it to the user, and then connect the essential skill to it
        $awardExperience = AwardExperience::factory()->create([
            'user_id' => $this->applicantUser->id,
        ]);
        $awardExperience->syncSkills($newPool->essentialSkills);

        // assert user can now submit application as the essential skill is present
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL(
                $this->submitMutationDocument,
                [
                    'id' => $newPoolCandidate->id,
                    'sig' => 'SIGNED',
                ]
            )->assertJson(
                fn (AssertableJson $json) => $json->has(
                    'data',
                    fn ($json) => $json->has(
                        'submitApplication',
                        fn ($json) => $json->has('signature')
                            ->has('status')
                            ->has('submittedAt')
                            ->whereType('submittedAt', 'string')
                    )
                )
            );
    }

    public function testApplicationSubmitStatus(): void
    {
        $newPool = Pool::factory()->create([
            'closing_date' => Carbon::now()->addDays(1),
            'advertisement_language' => PoolLanguage::ENGLISH->name, // avoid language requirements
            'area_of_selection' => PoolAreaOfSelection::PUBLIC->name, // avoid email requirements
        ]);
        $newPool->essentialSkills()->sync([]);

        $newPoolCandidate = PoolCandidate::factory()->create([
            'user_id' => $this->applicantUser->id,
            'pool_id' => $newPool->id,
            'application_status' => ApplicationStatus::DRAFT->name,
        ]);
        $educationExperience = EducationExperience::factory()->create(['user_id' => $newPoolCandidate->user_id]);
        $newPoolCandidate->educationRequirementEducationExperiences()->sync([$educationExperience->id]);

        // assert status updated upon submission, and doesn't return DRAFT or EXPIRED
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL(
                $this->submitMutationDocument,
                [
                    'id' => $newPoolCandidate->id,
                    'sig' => 'sign',
                ]
            )->assertJsonFragment([
                'status' => [
                    'value' => ApplicationStatus::TO_ASSESS->name,
                ],
            ]);
    }

    public function testApplicationSubmitClosingDate(): void
    {
        // Closed Pool
        $newPool = Pool::factory()->create([
            'closing_date' => Carbon::now()->subDays(1),
            'advertisement_language' => PoolLanguage::ENGLISH->name, // avoid language requirements
            'area_of_selection' => PoolAreaOfSelection::PUBLIC->name, // avoid email requirements
        ]);
        $newPool->essentialSkills()->sync([]);

        $newPoolCandidate = PoolCandidate::factory()->create([
            'user_id' => $this->applicantUser->id,
            'pool_id' => $newPool->id,
            'application_status' => ApplicationStatus::DRAFT->name,
        ]);
        $educationExperience = EducationExperience::factory()->create(['user_id' => $newPoolCandidate->user_id]);
        $newPoolCandidate->educationRequirementEducationExperiences()->sync([$educationExperience->id]);

        // assert status
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL(
                $this->submitMutationDocument,
                [
                    'id' => $newPoolCandidate->id,
                    'sig' => 'sign',
                ]
            )->assertJson([
                'errors' => [[
                    'message' => ErrorCode::APPLICATION_POOL_CLOSED->name,
                ]],
            ]);

        $newPool->closing_date = Carbon::now()->addDays(1);
        $newPool->save();

        $this->actingAs($this->applicantUser, 'api')
            ->graphQL(
                $this->submitMutationDocument,
                [
                    'id' => $newPoolCandidate->id,
                    'sig' => 'sign',
                ]
            )->assertJson(
                fn (AssertableJson $json) => $json->has(
                    'data',
                    fn ($json) => $json->has(
                        'submitApplication',
                        fn ($json) => $json
                            ->has('signature')
                            ->has('status')
                            ->has('submittedAt')
                            ->whereType('submittedAt', 'string')
                    )
                )
            );
    }

    public function testApplicationSubmitScreeningQuestions(): void
    {
        $newPool = Pool::factory()->published()->create([
            'closing_date' => Carbon::now()->addDays(1),
            'advertisement_language' => PoolLanguage::ENGLISH->name, // avoid language requirements
            'area_of_selection' => PoolAreaOfSelection::PUBLIC->name, // avoid email requirements
        ]);
        $newPool->essentialSkills()->sync([]);
        $assessmentStep = AssessmentStep::factory()->create([
            'pool_id' => $newPool,
            'type' => AssessmentStepType::SCREENING_QUESTIONS_AT_APPLICATION->name,
            'sort_order' => 2,
        ]);
        ScreeningQuestion::where('pool_id', $newPool->id)->delete();
        $screeningQuestion = ScreeningQuestion::factory()->create([
            'pool_id' => $newPool,
            'assessment_step_id' => $assessmentStep,
        ]);

        $newPoolCandidate = PoolCandidate::factory()->create([
            'user_id' => $this->applicantUser->id,
            'pool_id' => $newPool->id,
            'application_status' => ApplicationStatus::DRAFT->name,
            'education_requirement_option' => EducationRequirementOption::EDUCATION->name,
        ]);
        $educationExperience = EducationExperience::factory()->create(['user_id' => $newPoolCandidate->user_id]);
        $newPoolCandidate->educationRequirementEducationExperiences()->sync([$educationExperience->id]);
        // Remove any responses created by factory
        ScreeningQuestionResponse::where('pool_candidate_id', $newPoolCandidate->id)->delete();

        $submitArgs = [
            'id' => $newPoolCandidate->id,
            'sig' => 'SIGNED',
        ];

        // assert cannot submit with no question
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL($this->submitMutationDocument, $submitArgs)->assertJsonFragment([
                ErrorCode::APPLICATION_MISSING_QUESTION_RESPONSE->name,
            ]);

        // Respond to the question
        ScreeningQuestionResponse::create([
            'pool_candidate_id' => $newPoolCandidate->id,
            'screening_question_id' => $screeningQuestion->id,
            'answer' => 'answer',
        ]);
        // assert successful submission after responding to question
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL($this->submitMutationDocument, $submitArgs)
            ->assertJson(
                fn (AssertableJson $json) => $json->has(
                    'data',
                    fn ($json) => $json->has(
                        'submitApplication',
                        fn ($json) => $json->has('signature')
                            ->has('status')
                            ->has('submittedAt')
                            ->whereType('submittedAt', 'string')
                    )
                )
            );
    }

    public function testApplicationSubmitGeneralQuestions(): void
    {
        $newPool = Pool::factory()->create([
            'closing_date' => Carbon::now()->addDays(1),
            'advertisement_language' => PoolLanguage::ENGLISH->name, // avoid language requirements
            'area_of_selection' => PoolAreaOfSelection::PUBLIC->name, // avoid email requirements
        ]);
        $newPool->essentialSkills()->sync([]);
        GeneralQuestion::where('pool_id', $newPool->id)->delete();
        $generalQuestion = GeneralQuestion::factory()->create([
            'pool_id' => $newPool,
        ]);

        $newPoolCandidate = PoolCandidate::factory()->create([
            'user_id' => $this->applicantUser->id,
            'pool_id' => $newPool->id,
            'application_status' => ApplicationStatus::DRAFT->name,
            'education_requirement_option' => EducationRequirementOption::EDUCATION->name,
        ]);
        $educationExperience = EducationExperience::factory()->create(['user_id' => $newPoolCandidate->user_id]);
        $newPoolCandidate->educationRequirementEducationExperiences()->sync([$educationExperience->id]);
        // Remove any responses created by factory
        GeneralQuestionResponse::where('pool_candidate_id', $newPoolCandidate->id)->delete();

        $submitArgs = [
            'id' => $newPoolCandidate->id,
            'sig' => 'SIGNED',
        ];

        // assert cannot submit with no question
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL($this->submitMutationDocument, $submitArgs)->assertJsonFragment([
                ErrorCode::APPLICATION_MISSING_QUESTION_RESPONSE->name,
            ]);

        // Respond to the question
        GeneralQuestionResponse::create([
            'pool_candidate_id' => $newPoolCandidate->id,
            'general_question_id' => $generalQuestion->id,
            'answer' => 'answer',
        ]);
        // assert successful submission after responding to question
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL($this->submitMutationDocument, $submitArgs)
            ->assertJson(
                fn (AssertableJson $json) => $json->has(
                    'data',
                    fn ($json) => $json->has(
                        'submitApplication',
                        fn ($json) => $json->has('signature')
                            ->has('status')
                            ->has('submittedAt')
                            ->whereType('submittedAt', 'string')
                    )
                )
            );
    }

    public function testApplicationDeletion(): void
    {
        $newPool = Pool::factory()->create([]);
        $newPool->essentialSkills()->sync([]);

        $newPoolCandidate = PoolCandidate::factory()->create([
            'user_id' => $this->applicantUser->id,
            'pool_id' => $newPool->id,
            'application_status' => ApplicationStatus::DRAFT->name,
            'expiry_date' => config('constants.far_future_date'),
        ]);

        $variables = ['id' => $newPoolCandidate->id];

        // Assert guests cannot delete application
        // Do this first because actingAs seems to keep querying as the user
        // until called again with a different user
        $this->graphQL($this->deleteMutationDocument, $variables)
            ->assertGraphQLErrorMessage($this->unauthenticatedMessage);

        // Assert candidate exists
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL($this->queryDocument, $variables)
            ->assertJson([
                'data' => [
                    'poolCandidate' => [
                        'status' => [
                            'value' => ApplicationStatus::DRAFT->name,
                        ],
                    ],
                ],
            ]);

        // Assert non-owners cannot delete application
        $this->actingAs($this->communityRecruiter, 'api')
            ->graphQL($this->deleteMutationDocument, $variables)
            ->assertGraphQLErrorMessage($this->unauthorizedMessage);

        // run deletion mutation and assert it returns the id, indicating success
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL($this->deleteMutationDocument, $variables)->assertJson([
                'data' => [
                    'deleteApplication' => ['id' => $newPoolCandidate->id],
                ],
            ]);

        // Assert candidate no longer exists
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL($this->queryDocument, $variables)
            ->assertJson([
                'data' => [
                    'poolCandidate' => null,
                ],
            ]);
    }

    public function testApplicationDeletionStatuses(): void
    {

        // RECYCLING FROM ABOVE TESTS
        // array of statuses that should fail the test, as they should not allow deletion
        $statusesThatShouldFail = [
            ApplicationStatus::QUALIFIED->name,
            ApplicationStatus::DISQUALIFIED->name,
            ApplicationStatus::TO_ASSESS->name,
            ApplicationStatus::REMOVED->name,
        ];

        $candidates = [];
        foreach ($statusesThatShouldFail as $status) {
            $candidates[] = PoolCandidate::factory()->create([
                'application_status' => $status,
                'user_id' => $this->applicantUser->id,
                'submitted_at' => config('constants.past_date'),
                'expiry_date' => config('constants.far_future_date'),
            ]);
        }

        $result = [
            'errors' => [[
                'message' => ErrorCode::APPLICATION_NOT_DRAFT->name,
            ]],
        ];

        foreach ($candidates as $candidate) {
            $this->actingAs($this->applicantUser, 'api')
                ->graphQL(
                    $this->deleteMutationDocument,
                    ['id' => $candidate->id]
                )->assertJson($result);
        }
    }

    public function testApplicationSuspension(): void
    {
        $newPool = Pool::factory()->create([
            'closing_date' => Carbon::now()->addDays(1),
            'advertisement_language' => PoolLanguage::ENGLISH->name,
            'area_of_selection' => PoolAreaOfSelection::PUBLIC->name, // avoid email requirements
        ]);
        $newPool->essentialSkills()->sync([]);
        $newPoolCandidate = PoolCandidate::factory()->create([
            'user_id' => $this->applicantUser->id,
            'pool_id' => $newPool->id,
            'application_status' => ApplicationStatus::DRAFT->name,
        ]);
        $educationExperience = EducationExperience::factory()->create(['user_id' => $newPoolCandidate->user_id]);
        $newPoolCandidate->educationRequirementEducationExperiences()->sync([$educationExperience->id]);

        // assert can't suspend a DRAFT
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL(
                $this->suspendMutationDocument,
                ['id' => $newPoolCandidate->id, 'isSuspended' => true]
            )->assertJsonFragment(['message' => ErrorCode::APPLICATION_NOT_SUBMITTED->name]);

        $this->actingAs($this->applicantUser, 'api')
            ->graphQL(
                $this->submitMutationDocument,
                [
                    'id' => $newPoolCandidate->id,
                    'sig' => 'sign',
                ]
            )->assertJsonFragment([
                'status' => [
                    'value' => ApplicationStatus::TO_ASSESS->name,
                ],
            ]);

        $this->travelTo(Carbon::now()->addMinute()); // to test timestamp related things, gaps in time are required

        // assert suspend successfully happens after application is submitted
        $response = $this->actingAs($this->applicantUser, 'api')
            ->graphQL(
                $this->suspendMutationDocument,
                ['id' => $newPoolCandidate->id, 'isSuspended' => true]
            );
        $suspendedDate = $response->json('data.changeApplicationSuspendedAt.suspendedAt');
        assertNotNull($suspendedDate);

        $this->travelTo(Carbon::now()->addMinute());

        // assert re-suspend does not error and matches the date string above
        $response2 = $this->actingAs($this->applicantUser, 'api')
            ->graphQL(
                $this->suspendMutationDocument,
                ['id' => $newPoolCandidate->id, 'isSuspended' => true]
            );
        $suspendedDate2 = $response2->json('data.changeApplicationSuspendedAt.suspendedAt');
        assertEquals($suspendedDate, $suspendedDate2);

        // assert un-suspend works
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL(
                $this->suspendMutationDocument,
                ['id' => $newPoolCandidate->id, 'isSuspended' => false]
            )->assertJsonFragment(['suspendedAt' => null]);
    }

    public function testApplicationSubmitEducationRequirement(): void
    {
        $newPool = Pool::factory()->create([
            'closing_date' => Carbon::now()->addDays(1),
            'advertisement_language' => PoolLanguage::ENGLISH->name,
            'area_of_selection' => PoolAreaOfSelection::PUBLIC->name, // avoid email requirements
        ]);
        $newPool->essentialSkills()->sync([]);
        $newPoolCandidate = PoolCandidate::factory()->create([
            'user_id' => $this->applicantUser->id,
            'pool_id' => $newPool->id,
            'application_status' => ApplicationStatus::DRAFT->name,
        ]);
        $newPoolCandidate->update(['education_requirement_option' => null]);
        $newPoolCandidate->educationRequirementEducationExperiences()->sync([]);
        $newPoolCandidate->educationRequirementWorkExperiences()->sync([]);
        $educationExperience = EducationExperience::factory()->create(['user_id' => $newPoolCandidate->user_id]);

        // assert can't submit with incomplete education requirement
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL(
                $this->submitMutationDocument,
                [
                    'id' => $newPoolCandidate->id,
                    'sig' => 'sign',
                ]
            )->assertJsonFragment([
                'id' => [ErrorCode::APPLICATION_EDUCATION_REQUIREMENT_INCOMPLETE->name],
            ]);

        $newPoolCandidate->education_requirement_option = EducationRequirementOption::EDUCATION->name;
        $newPoolCandidate->save();

        // assert still can't submit since requirement is only partially complete
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL(
                $this->submitMutationDocument,
                [
                    'id' => $newPoolCandidate->id,
                    'sig' => 'sign',
                ]
            )->assertJsonFragment([
                'id' => [ErrorCode::APPLICATION_EDUCATION_REQUIREMENT_INCOMPLETE->name],
            ]);

        $newPoolCandidate->educationRequirementEducationExperiences()->sync([$educationExperience->id]);

        // assert submit now successful
        $this->actingAs($this->applicantUser, 'api')
            ->graphQL(
                $this->submitMutationDocument,
                [
                    'id' => $newPoolCandidate->id,
                    'sig' => 'sign',
                ]
            )->assertJsonFragment([
                'signature' => 'sign',
            ]);
    }

    public function testApplicationSubmissionClaimVerification(): void
    {
        $newPool = Pool::factory()->create([
            'closing_date' => Carbon::now()->addDays(1),
            'advertisement_language' => PoolLanguage::ENGLISH->name,
            'area_of_selection' => PoolAreaOfSelection::PUBLIC->name, // avoid email requirements
        ]);
        $newPool->essentialSkills()->sync([]);

        // not veteran, has priority
        $this->applicantUser->armed_forces_status = ArmedForcesStatus::MEMBER->name;
        $this->applicantUser->has_priority_entitlement = true;
        $this->applicantUser->priority_number = 'abc';
        $this->applicantUser->save();

        $newPoolCandidate = PoolCandidate::factory()->create([
            'user_id' => $this->applicantUser->id,
            'pool_id' => $newPool->id,
            'application_status' => ApplicationStatus::DRAFT->name,
            'submitted_at' => null,
        ]);

        $educationExperience = EducationExperience::factory()->create(['user_id' => $newPoolCandidate->user_id]);
        $newPoolCandidate->education_requirement_option = EducationRequirementOption::EDUCATION->name;
        $newPoolCandidate->educationRequirementEducationExperiences()->sync([$educationExperience->id]);
        $newPoolCandidate->save();

        $this->actingAs($this->applicantUser, 'api')
            ->graphQL(
                $this->submitMutationDocument,
                [
                    'id' => $newPoolCandidate->id,
                    'sig' => 'sign',
                ]
            )->assertJsonFragment([
                'signature' => 'sign',
            ]);
        $newPoolCandidate->refresh();

        // assert verification defaults filled in upon submitting application
        assertSame($newPoolCandidate->veteran_verification, null);
        assertSame($newPoolCandidate->priority_verification, ClaimVerificationResult::UNVERIFIED->name);
    }

    public function testApplicationSubmissionWorkEmailVerifiedForInternalJobs(): void
    {
        Config::set('feature.application_email_verification', true); // this line should be removed once the feature flag FEATURE_APPLICATION_EMAIL_VERIFICATION is removed.
        $pool = Pool::factory()
            ->withPoolSkills(1, 0)
            ->create([
                'closing_date' => Carbon::now()->addDays(1),
                'area_of_selection' => PoolAreaOfSelection::EMPLOYEES->name,
            ]);

        $pool->essentialSkills()->sync([]);

        $candidateWithNoVerifiedWorkEmail = PoolCandidate::factory()->create([
            'user_id' => $this->nonGovEmployee->id,
            'pool_id' => $pool->id,
            'application_status' => ApplicationStatus::DRAFT->name,
            'submitted_at' => null,
        ]);

        $this->actingAs($this->nonGovEmployee, 'api')
            ->graphQL(
                $this->submitMutationDocument,
                [
                    'id' => $candidateWithNoVerifiedWorkEmail->id,
                    'sig' => 'sign',
                ]
            )->assertGraphQLErrorMessage(ErrorCode::APPLICATION_WORK_EMAIL_NOT_VERIFIED->name);

        $candidateWithVerifiedWorkEmail = PoolCandidate::factory()->create([
            'user_id' => $this->govEmployee->id,
            'pool_id' => $pool->id,
            'application_status' => ApplicationStatus::DRAFT->name,
            'submitted_at' => null,
        ]);

        $this->actingAs($this->govEmployee, 'api')
            ->graphQL(
                $this->submitMutationDocument,
                [
                    'id' => $candidateWithVerifiedWorkEmail->id,
                    'sig' => 'sign',
                ]
            )->assertJsonFragment([
                'signature' => 'sign',
            ]);
    }
}

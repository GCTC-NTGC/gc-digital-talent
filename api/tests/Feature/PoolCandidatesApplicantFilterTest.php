<?php

use App\Models\User;
use App\Models\Pool;
use App\Models\PoolCandidate;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\ClearsSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;
use Database\Helpers\ApiEnums;

class PoolCandidatesApplicantFilterTest extends TestCase
{
    use RefreshDatabase;
    use MakesGraphQLRequests;
    use ClearsSchemaCache;

    protected function setUp(): void
    {
        parent::setUp();
        $this->bootClearsSchemaCache();

        // Create admin user we run tests as
        // Note: this extra user does change the results of a couple queries
        $newUser = new User;
        $newUser->email = 'admin@test.com';
        $newUser->sub = 'admin@test.com';
        $newUser->roles = ['ADMIN'];
        $newUser->save();
    }

    public function testPoolCandidatesPaginatedApplicantFilter(): void
    {
        //
        // recycled from testSortingStatusThenPriority on ApplicantTest.php
        //

        $user = User::All()->first();
        $pool1 = Pool::factory()->create([
            'user_id' => $user['id']
        ]);

        // DRAFT, NOT PRESENT
        $candidateOne = PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_DRAFT,
            'user_id' => User::factory([
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
                'has_priority_entitlement' => true,
                'armed_forces_status' => ApiEnums::ARMED_FORCES_VETERAN,
                'citizenship' => ApiEnums::CITIZENSHIP_CITIZEN,
                'has_diploma' => false,
                'is_woman' => false,
            ])
        ]);
        // NEW APPLICATION, NO PRIORITY SO SECOND
        $candidateTwo = PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_NEW_APPLICATION,
            'user_id' => User::factory([
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
                'has_priority_entitlement' => false,
                'armed_forces_status' => ApiEnums::ARMED_FORCES_NON_CAF,
                'citizenship' => ApiEnums::CITIZENSHIP_OTHER,
                'has_diploma' => false,
                'is_woman' => false,
            ])
        ]);
        // APPLICATION REVIEW, NO PRIORITY SO THIRD
        $candidateThree = PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_APPLICATION_REVIEW,
            'user_id' => User::factory([
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
                'has_priority_entitlement' => false,
                'armed_forces_status' => ApiEnums::ARMED_FORCES_NON_CAF,
                'citizenship' => ApiEnums::CITIZENSHIP_OTHER,
                'has_diploma' => false,
                'is_woman' => false,
            ])
        ]);

        // NEW APPLICATION, VETERAN SO FIRST
        // has diploma and is woman
        $candidateFour = PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_NEW_APPLICATION,
            'user_id' => User::factory([
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
                'has_priority_entitlement' => false,
                'armed_forces_status' => ApiEnums::ARMED_FORCES_VETERAN,
                'citizenship' => ApiEnums::CITIZENSHIP_CITIZEN,
                'has_diploma' => true,
                'is_woman' => true,
            ])
        ]);
        // QUALIFIED AVAILABLE, HAS ENTITLEMENT FOURTH
        // has diploma and is woman
        $candidateFive = PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'id' => 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
            'expiry_date' => config('constants.far_future_date'),
            'submitted_at' => config('constants.past_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'job_looking_status' => ApiEnums::USER_STATUS_ACTIVELY_LOOKING,
                'has_priority_entitlement' => true,
                'armed_forces_status' => ApiEnums::ARMED_FORCES_VETERAN,
                'citizenship' => ApiEnums::CITIZENSHIP_CITIZEN,
                'has_diploma' => true,
                'is_woman' => true,
            ])
        ]);

        // Assert the order is correct
        // candidate one not present due to being DRAFT
        $this->graphQL(/** @lang Graphql */ '
            query poolCandidatesPaginatedApplicantFilter {
                poolCandidatesPaginatedApplicantFilter (orderBy: [
                    { column: "status_weight", order: ASC }
                    { user: { aggregate: MAX, column: PRIORITY_WEIGHT }, order: ASC }
                  ])
                {
                    data
                    {
                        id
                    }
                }
            }
            ')->assertJson([
            "data" => [
                "poolCandidatesPaginatedApplicantFilter" => [
                    "data" => [
                        ["id" => $candidateFour->id,],
                        ["id" => $candidateTwo->id,],
                        ["id" => $candidateThree->id,],
                        ["id" => $candidateFive->id,],
                    ]
                ]
            ]
        ]);

        // Assert that
        // PoolCandidates are filtered out by data on User, must have Diploma and be Woman
        // Candidate Four always precedes Candidate Five due to ORDERING
        $this->graphQL(/** @lang Graphql */ '
            query poolCandidatesPaginatedApplicantFilter ($where: ApplicantFilterOnPoolCandidateInput) {
                poolCandidatesPaginatedApplicantFilter (
                    where: $where
                    orderBy: [
                    { column: "status_weight", order: ASC }
                    { user: { aggregate: MAX, column: PRIORITY_WEIGHT }, order: ASC }
                  ])
                {
                    data
                    {
                        id
                    }
                }
            }
            ',
            [
                'where' => [
                    'hasDiploma' => true,
                    'equity' => [
                        'isWoman' => true,
                        'hasDisability' => false,
                        'isIndigenous' => false,
                        'isVisibleMinority' => false,
                    ],
                ]
            ]
            )->assertJson([
            "data" => [
                "poolCandidatesPaginatedApplicantFilter" => [
                    "data" => [
                        ["id" => $candidateFour->id,],
                        ["id" => $candidateFive->id,],
                    ]
                ]
            ]
        ]);
    }
}

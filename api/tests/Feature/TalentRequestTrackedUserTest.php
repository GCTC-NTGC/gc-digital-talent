<?php

namespace Tests\Feature;

use App\Enums\TalentRequestTrackedUserNotReferredReason;
use App\Enums\TalentRequestTrackedUserNotSelectedReason;
use App\Enums\TalentRequestTrackedUserReferralDecision;
use App\Enums\TalentRequestTrackedUserSelectionDecision;
use App\Models\ApplicantFilter;
use App\Models\Community;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Skill;
use App\Models\TalentRequest;
use App\Models\TalentRequestTrackedUser;
use App\Models\User;
use App\Models\UserSkill;
use Carbon\CarbonImmutable;
use Database\Seeders\DepartmentSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;
use Tests\UsesProtectedGraphqlEndpoint;

class TalentRequestTrackedUserTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesProtectedGraphqlEndpoint;

    protected Community $community;

    protected User $admin;

    protected User $recruiter;

    protected string $query = <<<'GRAPHQL'
        query TrackedUsers($id: ID!) {
            talentRequest(id: $id) {
                trackedUsers {
                    skillCount
                    user { id }
                    referralDecision { value }
                    selectionDecision { value }
                    notReferredReason { value }
                    notSelectedReason { value }
                }
            }
        }
        GRAPHQL;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([
            RolePermissionSeeder::class,
            DepartmentSeeder::class,
        ]);

        $this->community = Community::factory()->create();

        $this->admin = User::factory()
            ->asAdmin()
            ->create([
                'email' => 'admin@test.com',
                'sub' => 'admin@test.com',
            ]);

        $this->recruiter = User::factory()
            ->asCommunityRecruiter([$this->community->id])
            ->create([
                'email' => 'recruiter@test.com',
                'sub' => 'recruiter@test.com',
            ]);
    }

    private function createRequest(): TalentRequest
    {
        return TalentRequest::factory()->create(['community_id' => $this->community->id]);
    }

    public function testReturnsEmptyArrayWhenNoTrackedUsers(): void
    {
        $request = $this->createRequest();

        $this->actingAs($this->admin, 'api')
            ->graphQL($this->query, ['id' => $request->id])
            ->assertJson(['data' => ['talentRequest' => ['trackedUsers' => []]]]);
    }

    /**
     * @return array<string, array{0: array<string, string>, 1: array<string, mixed>}>
     */
    public static function decisionFieldsProvider(): array
    {
        return [
            'no decisions' => [
                [],
                [
                    'referralDecision' => null,
                    'selectionDecision' => null,
                    'notReferredReason' => null,
                    'notSelectedReason' => null,
                ],
            ],
            'referred' => [
                ['referral_decision' => TalentRequestTrackedUserReferralDecision::REFERRED->name],
                [
                    'referralDecision' => ['value' => TalentRequestTrackedUserReferralDecision::REFERRED->name],
                    'selectionDecision' => null,
                    'notReferredReason' => null,
                    'notSelectedReason' => null,
                ],
            ],
            'not referred with reason' => [
                [
                    'referral_decision' => TalentRequestTrackedUserReferralDecision::NOT_REFERRED->name,
                    'not_referred_reason' => TalentRequestTrackedUserNotReferredReason::OTHER->name,
                ],
                [
                    'referralDecision' => ['value' => TalentRequestTrackedUserReferralDecision::NOT_REFERRED->name],
                    'notReferredReason' => ['value' => TalentRequestTrackedUserNotReferredReason::OTHER->name],
                    'selectionDecision' => null,
                    'notSelectedReason' => null,
                ],
            ],
            'selected' => [
                [
                    'referral_decision' => TalentRequestTrackedUserReferralDecision::REFERRED->name,
                    'selection_decision' => TalentRequestTrackedUserSelectionDecision::SELECTED->name,
                ],
                [
                    'referralDecision' => ['value' => TalentRequestTrackedUserReferralDecision::REFERRED->name],
                    'selectionDecision' => ['value' => TalentRequestTrackedUserSelectionDecision::SELECTED->name],
                    'notReferredReason' => null,
                    'notSelectedReason' => null,
                ],
            ],
            'not selected with reason' => [
                [
                    'referral_decision' => TalentRequestTrackedUserReferralDecision::REFERRED->name,
                    'selection_decision' => TalentRequestTrackedUserSelectionDecision::NOT_SELECTED->name,
                    'not_selected_reason' => TalentRequestTrackedUserNotSelectedReason::OTHER->name,
                ],
                [
                    'referralDecision' => ['value' => TalentRequestTrackedUserReferralDecision::REFERRED->name],
                    'selectionDecision' => ['value' => TalentRequestTrackedUserSelectionDecision::NOT_SELECTED->name],
                    'notSelectedReason' => ['value' => TalentRequestTrackedUserNotSelectedReason::OTHER->name],
                    'notReferredReason' => null,
                ],
            ],
        ];
    }

    /**
     * @param  array<string, string>  $attributes
     * @param  array<string, mixed>  $expected
     */
    #[DataProvider('decisionFieldsProvider')]
    public function testDecisionFieldsResolve(array $attributes, array $expected): void
    {
        $request = $this->createRequest();
        $user = User::factory()->create();

        TalentRequestTrackedUser::factory()->create([
            'talent_request_id' => $request->id,
            'user_id' => $user->id,
            ...$attributes,
        ]);

        $this->actingAs($this->admin, 'api')
            ->graphQL($this->query, ['id' => $request->id])
            ->assertJsonFragment([
                'user' => ['id' => $user->id],
                ...$expected,
            ]);
    }

    /**
     * @return array<string, array{0: int, 1: int}>
     */
    public static function skillCountProvider(): array
    {
        return [
            'no matching skills' => [0, 0],
            'one matching skill' => [1, 1],
            'all matching skills' => [3, 3],
        ];
    }

    #[DataProvider('skillCountProvider')]
    public function testSkillCountCountsOnlyApplicantFilterSkills(int $matching, int $expected): void
    {
        $filterSkills = Skill::factory()->count(3)->create();
        $filter = ApplicantFilter::factory()->create(['community_id' => $this->community->id]);
        $filter->skills()->sync($filterSkills->pluck('id')->all());

        $request = TalentRequest::factory()->create([
            'community_id' => $this->community->id,
            'applicant_filter_id' => $filter->id,
        ]);

        $user = User::factory()->create();
        // an unrelated skill that must never be counted
        UserSkill::factory()->create(['user_id' => $user->id, 'skill_id' => Skill::factory()->create()->id]);
        foreach ($filterSkills->take($matching) as $skill) {
            UserSkill::factory()->create(['user_id' => $user->id, 'skill_id' => $skill->id]);
        }

        TalentRequestTrackedUser::factory()->create([
            'talent_request_id' => $request->id,
            'user_id' => $user->id,
        ]);

        $this->actingAs($this->admin, 'api')
            ->graphQL($this->query, ['id' => $request->id])
            ->assertJsonFragment([
                'user' => ['id' => $user->id],
                'skillCount' => $expected,
            ]);
    }

    public function testPlatformAdminSeesAllTrackedUsers(): void
    {
        $request = $this->createRequest();
        $users = User::factory()->count(3)->create();
        foreach ($users as $user) {
            TalentRequestTrackedUser::factory()->create([
                'talent_request_id' => $request->id,
                'user_id' => $user->id,
            ]);
        }

        $this->actingAs($this->admin, 'api')
            ->graphQL($this->query, ['id' => $request->id])
            ->assertJsonCount(3, 'data.talentRequest.trackedUsers');
    }

    public function testTrackedUsersFilteredToThoseTheViewerCanSee(): void
    {
        $request = $this->createRequest();

        // viewable: applicant with a submitted candidate in a published pool of the community
        $pool = Pool::factory()->for($this->admin)->published()
            ->create(['community_id' => $this->community->id]);
        $viewableUser = User::factory()->asApplicant()->create();
        PoolCandidate::factory()->for($viewableUser)->for($pool)
            ->create(['submitted_at' => CarbonImmutable::now()]);

        // hidden: plain applicant with no candidacy in the community
        $hiddenUser = User::factory()->asApplicant()->create();

        foreach ([$viewableUser, $hiddenUser] as $user) {
            TalentRequestTrackedUser::factory()->create([
                'talent_request_id' => $request->id,
                'user_id' => $user->id,
            ]);
        }

        $this->actingAs($this->recruiter, 'api')
            ->graphQL($this->query, ['id' => $request->id])
            ->assertJsonCount(1, 'data.talentRequest.trackedUsers')
            ->assertJsonFragment(['user' => ['id' => $viewableUser->id]])
            ->assertJsonMissing(['user' => ['id' => $hiddenUser->id]]);
    }

    /**
     * @return array<string, array{0: string}>
     */
    public static function cannotViewRequestProvider(): array
    {
        return [
            'applicant' => ['applicant'],
            'recruiter of other community' => ['other_recruiter'],
        ];
    }

    #[DataProvider('cannotViewRequestProvider')]
    public function testRolesWithoutAccessCannotViewRequest(string $role): void
    {
        $request = $this->createRequest();

        $actor = match ($role) {
            'applicant' => User::factory()->asApplicant()->create(),
            'other_recruiter' => User::factory()->asCommunityRecruiter([Community::factory()->create()->id])->create(),
        };

        $this->actingAs($actor, 'api')
            ->graphQL($this->query, ['id' => $request->id])
            ->assertGraphQLErrorMessage('This action is unauthorized.');
    }

    public function testUnauthenticatedCannotViewRequest(): void
    {
        $request = $this->createRequest();

        $this->graphQL($this->query, ['id' => $request->id])
            ->assertGraphQLErrorMessage('Unauthenticated.');
    }
}

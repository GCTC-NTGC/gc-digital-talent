<?php

namespace Tests\Unit;

use App\Models\Community;
use App\Models\CommunityInterest;
use App\Models\Department;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

use function PHPUnit\Framework\assertEqualsCanonicalizing;

class UserAuthorizationScopeTest extends TestCase
{
    use RefreshDatabase;

    protected static function createPlatformAdmin()
    {
        return User::factory()
            ->asAdmin()
            ->create();
    }

    protected static function createApplicant()
    {
        return User::factory()
            ->asApplicant()
            ->create();
    }

    protected static function createEmployee()
    {
        return User::factory()
            ->withGovEmployeeProfile()
            ->create();
    }

    protected static function createPool(Community|Department $teamable, User $owner)
    {
        $builder = Pool::factory()
            ->for($owner)
            ->published();

        return match (true) {
            $teamable instanceof Community => $builder->create([
                'community_id' => $teamable->id,
            ]),
            $teamable instanceof Department => $builder->create([
                'department_id' => $teamable->id,
            ]),
            default => throw new \Error('Unexpected teamable'),
        };
    }

    protected static function createPoolCandidate(User $applicant, Pool $pool)
    {
        return PoolCandidate::factory()
            ->for($applicant)
            ->for($pool)
            ->submitted()
            ->create();
    }

    protected static function createCommunityInterest(User $user, Community $community)
    {
        return CommunityInterest::factory()
            ->for($user)
            ->for($community)
            ->create([
                'consent_to_share_profile' => true,
            ]);
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    // a guest should be able to view no users
    public function testGuestSeesNoOne(): void
    {
        // no $actor User or mock for guest

        $someoneElse = self::createApplicant();

        $userIds = User::whereAuthorizedToView()->get()->pluck('id');
        assertEqualsCanonicalizing([], $userIds->toArray());
    }

    // an applicant should be able to view just themselves
    public function testApplicantSeesOnlyThemselves(): void
    {
        $actor = User::factory()
            ->asApplicant()
            ->create();

        Auth::shouldReceive('user')
            ->andReturn($actor);

        $someoneElse = self::createApplicant();

        $userIds = User::whereAuthorizedToView()->get()->pluck('id');
        assertEqualsCanonicalizing([
            $actor->id,
        ], $userIds->toArray());
    }

    // a platform admin should be able to view any user
    public function testAdminSeesEveryone(): void
    {
        $actor = User::factory()
            ->asAdmin()
            ->create();

        Auth::shouldReceive('user')
            ->andReturn($actor);

        $otherApplicant = self::createApplicant();
        $otherAdmin = self::createPlatformAdmin();

        $userIds = User::whereAuthorizedToView()->get()->pluck('id');
        assertEqualsCanonicalizing([
            $actor->id,
            $otherApplicant->id,
            $otherAdmin->id,
        ], $userIds->toArray());
    }

    // process operator can only see the user that submitted an application to the pool they are an operator on
    // and their own self
    public function testProcessOperatorSeesApplicantsToTheirPool(): void
    {
        $community = Community::factory()->create();
        $admin = self::createPlatformAdmin();

        $actorsPool = self::createPool($community, $admin);
        $otherPool = self::createPool($community, $admin);

        $actor = User::factory()
            ->asApplicant()
            ->asProcessOperator($actorsPool->id)
            ->create();

        Auth::shouldReceive('user')
            ->andReturn($actor);

        $applicantToActorsPool = self::createApplicant();
        self::createPoolCandidate($applicantToActorsPool, $actorsPool);

        $applicantToOtherPool = self::createApplicant();
        self::createPoolCandidate($applicantToOtherPool, $otherPool);

        $userIds = User::whereAuthorizedToView()->get()->pluck('id')->toArray();

        assertEqualsCanonicalizing([
            $actor->id,
            $applicantToActorsPool->id,
        ], $userIds);
    }

    // community recruiter can only see the user that submitted an application to the pool that is connected to the community that they belong to
    // and their own self
    public function testCommunityRecruiterSeesApplicantsToTheirCommunityPools(): void
    {
        $actorsCommunity = Community::factory()->create();
        $otherCommunity = Community::factory()->create();

        $admin = self::createPlatformAdmin();

        $actorsPool1 = self::createPool($actorsCommunity, $admin);
        $actorsPool2 = self::createPool($actorsCommunity, $admin);
        $otherPool = self::createPool($otherCommunity, $admin);

        $actor = User::factory()
            ->asApplicant()
            ->asCommunityRecruiter($actorsCommunity->id)
            ->create();

        Auth::shouldReceive('user')
            ->andReturn($actor);

        $applicantToActorsPool1 = self::createApplicant();
        self::createPoolCandidate($applicantToActorsPool1, $actorsPool1);

        $applicantToActorsPool2 = self::createApplicant();
        self::createPoolCandidate($applicantToActorsPool2, $actorsPool2);

        $applicantToOtherPool = self::createApplicant();
        self::createPoolCandidate($applicantToOtherPool, $otherPool);

        $userIds = User::whereAuthorizedToView()->get()->pluck('id')->toArray();

        assertEqualsCanonicalizing([
            $actor->id,
            $applicantToActorsPool1->id,
            $applicantToActorsPool2->id,
        ], $userIds);
    }

    // community talent coordinator can only see community talent
    // and their own self
    public function testCommunityTalentCoordinatorSeesCommunityTalent(): void
    {
        $community = Community::factory()->create();

        $actor = User::factory()
            ->asApplicant()
            ->asCommunityTalentCoordinator($community->id)
            ->create();

        Auth::shouldReceive('user')
            ->andReturn($actor);

        // perfectly set up
        $perfectUser = User::factory()
            ->withGovEmployeeProfile()
            ->create();
        CommunityInterest::factory()
            ->for($perfectUser)
            ->for($community)
            ->create(['consent_to_share_profile' => true]);

        // not a gov employee
        CommunityInterest::factory()
            ->for(User::factory()
                ->withGovEmployeeProfile()
                ->afterCreating(fn ($createdUser) => $createdUser->workExperiences->each->delete())
                ->create())
            ->for($community)
            ->create(['consent_to_share_profile' => true]);

        // not verified work email
        CommunityInterest::factory()
            ->for(User::factory()
                ->withGovEmployeeProfile()
                ->create(['work_email_verified_at' => null]))
            ->for($community)
            ->create(['consent_to_share_profile' => true]);

        // no consent
        CommunityInterest::factory()
            ->for(User::factory()
                ->withGovEmployeeProfile()
                ->create())
            ->for($community)
            ->create(['consent_to_share_profile' => false]);

        $userIds = User::whereAuthorizedToView()->get()->pluck('id');
        assertEqualsCanonicalizing([
            $actor->id,
            $perfectUser->id,
        ], $userIds->toArray());
    }

    // community talent coordinator can only see the community talent in the community that they belong to
    // and their own self
    public function testCommunityTalentCoordinatorSeesTheirCommunityTalent(): void
    {
        $actorsCommunity = Community::factory()->create();
        $otherCommunity = Community::factory()->create();

        $actor = User::factory()
            ->asApplicant()
            ->asCommunityTalentCoordinator($actorsCommunity->id)
            ->create();

        Auth::shouldReceive('user')
            ->andReturn($actor);

        $talentInActorsCommunity = self::createEmployee();
        self::createCommunityInterest($talentInActorsCommunity, $actorsCommunity);

        $talentInOtherCommunity = self::createEmployee();
        self::createCommunityInterest($talentInOtherCommunity, $otherCommunity);

        $userIds = User::whereAuthorizedToView()->get()->pluck('id')->toArray();

        assertEqualsCanonicalizing([
            $actor->id,
            $talentInActorsCommunity->id,
        ], $userIds);
    }

    // community admin can only see the user that submitted an application to the pool that is connected to the community that they belong to
    // and their own self
    public function testCommunityAdminSeesApplicantsToTheirCommunityPools(): void
    {
        $actorsCommunity = Community::factory()->create();
        $otherCommunity = Community::factory()->create();

        $admin = self::createPlatformAdmin();

        $actorsPool1 = self::createPool($actorsCommunity, $admin);
        $actorsPool2 = self::createPool($actorsCommunity, $admin);
        $otherPool = self::createPool($otherCommunity, $admin);

        $actor = User::factory()
            ->asApplicant()
            ->asCommunityAdmin($actorsCommunity->id)
            ->create();

        Auth::shouldReceive('user')
            ->andReturn($actor);

        $applicantToActorsPool1 = self::createApplicant();
        self::createPoolCandidate($applicantToActorsPool1, $actorsPool1);

        $applicantToActorsPool2 = self::createApplicant();
        self::createPoolCandidate($applicantToActorsPool2, $actorsPool2);

        $applicantToOtherPool = self::createApplicant();
        self::createPoolCandidate($applicantToOtherPool, $otherPool);

        $userIds = User::whereAuthorizedToView()->get()->pluck('id')->toArray();

        assertEqualsCanonicalizing([
            $actor->id,
            $applicantToActorsPool1->id,
            $applicantToActorsPool2->id,
        ], $userIds);
    }

    // community admin can only see the community talent in the community that they belong to
    // and their own self
    public function testCommunityAdminSeesTheirCommunityTalent(): void
    {
        $actorsCommunity = Community::factory()->create();
        $otherCommunity = Community::factory()->create();

        $actor = User::factory()
            ->asApplicant()
            ->asCommunityAdmin($actorsCommunity->id)
            ->create();

        Auth::shouldReceive('user')
            ->andReturn($actor);

        $talentInActorsCommunity = self::createEmployee();
        self::createCommunityInterest($talentInActorsCommunity, $actorsCommunity);

        $talentInOtherCommunity = self::createEmployee();
        self::createCommunityInterest($talentInOtherCommunity, $otherCommunity);

        $userIds = User::whereAuthorizedToView()->get()->pluck('id')->toArray();

        assertEqualsCanonicalizing([
            $actor->id,
            $talentInActorsCommunity->id,
        ], $userIds);
    }

    // department advisor can only see the user that submitted an application to the pool that is connected to the department that they belong to
    // and their own self
    public function testDepartmentAdvisorSeesApplicantsToTheirDepartmentPools(): void
    {
        $actorsDepartment = Department::factory()->create();
        $otherDepartment = Department::factory()->create();

        $admin = self::createPlatformAdmin();

        $actorsPool1 = self::createPool($actorsDepartment, $admin);
        $actorsPool2 = self::createPool($actorsDepartment, $admin);
        $otherPool = self::createPool($otherDepartment, $admin);

        $actor = User::factory()
            ->asApplicant()
            ->asDepartmentHRAdvisor($actorsDepartment->id)
            ->create();

        Auth::shouldReceive('user')
            ->andReturn($actor);

        $applicantToActorsPool1 = self::createApplicant();
        self::createPoolCandidate($applicantToActorsPool1, $actorsPool1);

        $applicantToActorsPool2 = self::createApplicant();
        self::createPoolCandidate($applicantToActorsPool2, $actorsPool2);

        $applicantToOtherPool = self::createApplicant();
        self::createPoolCandidate($applicantToOtherPool, $otherPool);

        $userIds = User::whereAuthorizedToView()->get()->pluck('id')->toArray();

        assertEqualsCanonicalizing([
            $actor->id,
            $applicantToActorsPool1->id,
            $applicantToActorsPool2->id,
        ], $userIds);
    }

    // department admin can only see the user that submitted an application to the pool that is connected to the department that they belong to
    // and their own self
    public function testDepartmentAdminSeesApplicantsToTheirDepartmentPools(): void
    {
        $actorsDepartment = Department::factory()->create();
        $otherDepartment = Department::factory()->create();

        $admin = self::createPlatformAdmin();

        $actorsPool1 = self::createPool($actorsDepartment, $admin);
        $actorsPool2 = self::createPool($actorsDepartment, $admin);
        $otherPool = self::createPool($otherDepartment, $admin);

        $actor = User::factory()
            ->asApplicant()
            ->asDepartmentAdmin($actorsDepartment->id)
            ->create();

        Auth::shouldReceive('user')
            ->andReturn($actor);

        $applicantToActorsPool1 = self::createApplicant();
        self::createPoolCandidate($applicantToActorsPool1, $actorsPool1);

        $applicantToActorsPool2 = self::createApplicant();
        self::createPoolCandidate($applicantToActorsPool2, $actorsPool2);

        $applicantToOtherPool = self::createApplicant();
        self::createPoolCandidate($applicantToOtherPool, $otherPool);

        $userIds = User::whereAuthorizedToView()->get()->pluck('id')->toArray();

        assertEqualsCanonicalizing([
            $actor->id,
            $applicantToActorsPool1->id,
            $applicantToActorsPool2->id,
        ], $userIds);
    }
}

<?php

namespace Tests\Unit;

use App\Models\Community;
use App\Models\CommunityInterest;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CommunityInterestPolicyTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    protected $guest;

    protected $applicant;

    protected $otherApplicant;

    protected $platformAdmin;

    protected $communityRecruiter;

    protected $communityAdmin;

    protected $communityTalentCoordinator;

    protected $departmentAdmin;

    protected $community;

    protected $verifiedEmployee;

    protected $otherVerifiedEmployee;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->community = Community::factory()->create();

        $this->guest = User::factory()
            ->asGuest()
            ->create([
                'email' => 'guest-user@test.com',
                'sub' => 'guest-user@test.com',
            ]);

        $this->applicant = User::factory()
            ->asApplicant()
            ->create([
                'email' => 'applicant-user@test.com',
                'sub' => 'applicant-user@test.com',
            ]);

        $this->otherApplicant = User::factory()
            ->asApplicant()
            ->create([
                'email' => 'other-applicant-user@test.com',
                'sub' => 'other-applicant-user@test.com',
            ]);

        $this->platformAdmin = User::factory()
            ->asAdmin()
            ->create([
                'email' => 'admin-user@test.com',
                'sub' => 'admin-user@test.com',
            ]);

        $this->communityRecruiter = User::factory()
            ->asCommunityRecruiter($this->community->id)
            ->create([
                'email' => 'community-recruiter-user@test.com',
            ]);

        $this->communityAdmin = User::factory()
            ->asCommunityAdmin($this->community->id)
            ->create([
                'email' => 'community-admin-user@test.com',
            ]);

        $this->communityTalentCoordinator = User::factory()
            ->asCommunityTalentCoordinator($this->community->id)
            ->create([
                'email' => 'community-talent-coordinator-user@test.com',
            ]);

        $this->departmentAdmin = User::factory()
            ->asApplicant()
            ->create([
                'email' => 'department-admin-user@test.com',
            ]);

        $this->verifiedEmployee = User::factory()
            ->withGovEmployeeProfile()
            ->create([
                'email' => 'verified-employee-user@test.com',
                'sub' => 'verified-employee-user@test.com',
            ]);

        $this->otherVerifiedEmployee = User::factory()
            ->withGovEmployeeProfile()
            ->create([
                'email' => 'other-verified-employee-user@test.com',
                'sub' => 'other-verified-employee-user@test.com',
            ]);
    }

    /**
     * The owner of a community interest, and a platform admin, can always view the attached user.
     * Team roles (community recruiter/admin/talent coordinator) may only do so when the community
     * interest has consented to share the profile, and the attached user is a verified gov employee.
     *
     * @return void
     */
    public function testViewUser()
    {
        // owner and platform admin can view the user regardless of consent or verification status
        $ownCommunityInterest = CommunityInterest::factory()
            ->consented(false)
            ->create([
                'user_id' => $this->applicant->id,
                'community_id' => $this->community->id,
            ]);

        $this->assertFalse($this->guest->can('viewUser', $ownCommunityInterest));
        $this->assertTrue($this->applicant->can('viewUser', $ownCommunityInterest));
        $this->assertFalse($this->otherApplicant->can('viewUser', $ownCommunityInterest));
        $this->assertTrue($this->platformAdmin->can('viewUser', $ownCommunityInterest));

        // consented community interest attached to a verified gov employee - team roles can view
        $consentedVerifiedInterest = CommunityInterest::factory()
            ->consented(true)
            ->create([
                'user_id' => $this->verifiedEmployee->id,
                'community_id' => $this->community->id,
            ]);

        $this->assertTrue($this->communityRecruiter->can('viewUser', $consentedVerifiedInterest));
        $this->assertTrue($this->communityAdmin->can('viewUser', $consentedVerifiedInterest));
        $this->assertTrue($this->communityTalentCoordinator->can('viewUser', $consentedVerifiedInterest));
        $this->assertFalse($this->departmentAdmin->can('viewUser', $consentedVerifiedInterest));
        $this->assertFalse($this->guest->can('viewUser', $consentedVerifiedInterest));

        // negative case: consent to share profile is false, even though the user is a verified gov employee
        $noConsentInterest = CommunityInterest::factory()
            ->consented(false)
            ->create([
                'user_id' => $this->otherVerifiedEmployee->id,
                'community_id' => $this->community->id,
            ]);

        $this->assertFalse($this->communityRecruiter->can('viewUser', $noConsentInterest));
        $this->assertFalse($this->communityAdmin->can('viewUser', $noConsentInterest));
        $this->assertFalse($this->communityTalentCoordinator->can('viewUser', $noConsentInterest));

        // negative case: consent to share profile is true, but the user is not a verified gov employee
        $notVerifiedInterest = CommunityInterest::factory()
            ->consented(true)
            ->create([
                'user_id' => $this->otherApplicant->id,
                'community_id' => $this->community->id,
            ]);

        $this->assertFalse($this->communityRecruiter->can('viewUser', $notVerifiedInterest));
        $this->assertFalse($this->communityAdmin->can('viewUser', $notVerifiedInterest));
        $this->assertFalse($this->communityTalentCoordinator->can('viewUser', $notVerifiedInterest));
    }
}

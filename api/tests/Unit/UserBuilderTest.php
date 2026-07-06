<?php

namespace Tests\Unit;

use App\Enums\EmployeeVerification;
use App\Enums\FlexibleWorkLocation;
use App\Enums\WorkRegion;
use App\Models\Community;
use App\Models\Pool;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

use function PHPUnit\Framework\assertEqualsCanonicalizing;

class UserBuilderTest extends TestCase
{
    use RefreshDatabase;

    protected $platformAdmin;

    protected $communityA;

    protected $pool;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->platformAdmin = User::factory()
            ->asAdmin()
            ->create([
                'flexible_work_locations' => [],
                'location_preferences' => [],
                'computed_is_gov_employee' => false,
                'work_email' => null,
            ]);

        $this->communityA = Community::factory()->create();

        $this->pool = Pool::factory()
            ->for($this->platformAdmin)
            ->published()
            ->create([
                'community_id' => $this->communityA->id,
            ]);
    }

    // test method whereFlexibleLocationAndRegionSpecialMatching()
    public function testWhereFlexibleLocationAndRegionSpecialMatching(): void
    {
        // create test users
        $remoteUserInBC = User::factory()->create([
            'flexible_work_locations' => [
                FlexibleWorkLocation::REMOTE->name,
            ],
            'location_preferences' => [
                WorkRegion::BRITISH_COLUMBIA->name,
            ],
        ]);
        $hybridUserInBcOn = User::factory()->create([
            'flexible_work_locations' => [
                FlexibleWorkLocation::HYBRID->name,
            ],
            'location_preferences' => [
                WorkRegion::BRITISH_COLUMBIA->name,
                WorkRegion::ONTARIO->name,
            ],
        ]);
        $onsiteUserInAtl = User::factory()->create([
            'flexible_work_locations' => [
                FlexibleWorkLocation::ONSITE->name,
            ],
            'location_preferences' => [
                WorkRegion::ATLANTIC->name,
            ],
        ]);
        $hybridOnsiteUserInNcr = User::factory()->create([
            'flexible_work_locations' => [
                FlexibleWorkLocation::HYBRID->name,
                FlexibleWorkLocation::ONSITE->name,
            ],
            'location_preferences' => [
                WorkRegion::NATIONAL_CAPITAL->name,
            ],
        ]);
        $allUserInQc = User::factory()->create([
            'flexible_work_locations' => [
                FlexibleWorkLocation::REMOTE->name,
                FlexibleWorkLocation::HYBRID->name,
                FlexibleWorkLocation::ONSITE->name,
            ],
            'location_preferences' => [
                WorkRegion::QUEBEC->name,
            ],
        ]);

        // empty returns all
        $userIds = User::whereFlexibleLocationAndRegionSpecialMatching(
            [],
            [],
        )->get()
            ->pluck('id')
            ->toArray();

        assertEqualsCanonicalizing([
            $remoteUserInBC->id,
            $hybridUserInBcOn->id,
            $onsiteUserInAtl->id,
            $hybridOnsiteUserInNcr->id,
            $allUserInQc->id,
            $this->platformAdmin->id, // platform admin pops up for this case
        ], $userIds);

        // remote, empty regions
        // returns remoteUserInBC, allUserInQc
        $userIds = User::whereFlexibleLocationAndRegionSpecialMatching(
            [],
            [
                FlexibleWorkLocation::REMOTE->name,
            ],
        )->get()
            ->pluck('id')
            ->toArray();

        assertEqualsCanonicalizing([
            $remoteUserInBC->id,
            $allUserInQc->id,
        ], $userIds);

        // remote and Hybrid, Ontario
        // returns remoteUserInBC, hybridUserInBcOn, allUserInQc
        $userIds = User::whereFlexibleLocationAndRegionSpecialMatching(
            [
                WorkRegion::ONTARIO->name,
            ],
            [
                FlexibleWorkLocation::REMOTE->name,
                FlexibleWorkLocation::HYBRID->name,
            ],
        )->get()
            ->pluck('id')
            ->toArray();

        assertEqualsCanonicalizing([
            $remoteUserInBC->id,
            $hybridUserInBcOn->id,
            $allUserInQc->id,
        ], $userIds);

        // onsite, Atlantic
        // returns onsiteUserInAtl
        $userIds = User::whereFlexibleLocationAndRegionSpecialMatching(
            [
                WorkRegion::ATLANTIC->name,
            ],
            [
                FlexibleWorkLocation::ONSITE->name,
            ],
        )->get()
            ->pluck('id')
            ->toArray();

        assertEqualsCanonicalizing([
            $onsiteUserInAtl->id,
        ], $userIds);

        // onsite, North
        // returns no one
        $userIds = User::whereFlexibleLocationAndRegionSpecialMatching(
            [
                WorkRegion::NORTH->name,
            ],
            [
                FlexibleWorkLocation::ONSITE->name,
            ],
        )->get()
            ->pluck('id')
            ->toArray();

        assertEqualsCanonicalizing([], $userIds);

        // no flexible, Atlantic and Quebec
        // returns onsiteUserInAtl, allUserInQc
        $userIds = User::whereFlexibleLocationAndRegionSpecialMatching(
            [
                WorkRegion::ATLANTIC->name,
                WorkRegion::QUEBEC->name,
            ],
            [],
        )->get()
            ->pluck('id')
            ->toArray();

        assertEqualsCanonicalizing([
            $onsiteUserInAtl->id,
            $allUserInQc->id,
        ], $userIds);
    }

    public function testWhereEmployeeVerificationIn(): void
    {
        // Non-gov employee — not a government employee at all
        $nonGovUser = User::factory()->create([
            'computed_is_gov_employee' => false,
            'work_email' => null,
            'work_email_verified_at' => null,
        ]);

        // Gov employee with no work email entered — not verified, no email
        $govNoEmail = User::factory()->create([
            'computed_is_gov_employee' => true,
            'work_email' => null,
            'work_email_verified_at' => null,
        ]);

        // Gov employee who submitted a work email but hasn't verified it yet
        $govUnverifiedEmail = User::factory()->create([
            'computed_is_gov_employee' => true,
            'work_email' => 'unverified@gc.ca',
            'work_email_verified_at' => null,
        ]);

        // Gov employee who has a verified work email — fully verified
        $govVerifiedEmail = User::factory()->create([
            'computed_is_gov_employee' => true,
            'work_email' => 'verified@gc.ca',
            'work_email_verified_at' => '2023-01-01',
        ]);

        // Empty array — skip filter, return all users
        $ids = User::whereEmployeeVerificationIn([])->pluck('id')->toArray();
        assertEqualsCanonicalizing([
            $this->platformAdmin->id,
            $nonGovUser->id,
            $govNoEmail->id,
            $govUnverifiedEmail->id,
            $govVerifiedEmail->id,
        ], $ids);

        // Null — same as empty, skip filter
        $ids = User::whereEmployeeVerificationIn(null)->pluck('id')->toArray();
        assertEqualsCanonicalizing([
            $this->platformAdmin->id,
            $nonGovUser->id,
            $govNoEmail->id,
            $govUnverifiedEmail->id,
            $govVerifiedEmail->id,
        ], $ids);

        // VERIFIED only — must have computed_is_gov_employee + work_email + work_email_verified_at
        // Uses string names to match how Lighthouse passes enum values from GraphQL input.
        $ids = User::whereEmployeeVerificationIn([EmployeeVerification::VERIFIED->name])->pluck('id')->toArray();
        assertEqualsCanonicalizing([
            $govVerifiedEmail->id,
        ], $ids);

        // NOT_VERIFIED only — gov employee + work_email present but not yet verified
        $ids = User::whereEmployeeVerificationIn([EmployeeVerification::NOT_VERIFIED->name])->pluck('id')->toArray();
        assertEqualsCanonicalizing([
            $govUnverifiedEmail->id,
        ], $ids);

        // Both — gov employees who have a work email (verified or not)
        $ids = User::whereEmployeeVerificationIn([
            EmployeeVerification::VERIFIED->name,
            EmployeeVerification::NOT_VERIFIED->name,
        ])->pluck('id')->toArray();
        assertEqualsCanonicalizing([
            $govUnverifiedEmail->id,
            $govVerifiedEmail->id,
        ], $ids);
    }
}

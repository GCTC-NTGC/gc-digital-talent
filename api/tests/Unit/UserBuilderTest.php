<?php

namespace Tests\Unit;

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
}

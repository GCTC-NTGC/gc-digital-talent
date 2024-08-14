<?php

namespace Tests\Unit;

use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Team;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class UserPolicyTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    protected $guest;

    protected $applicant;

    protected $otherApplicant;

    protected $poolOperator;

    protected $requestResponder;

    protected $platformAdmin;

    protected $team;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

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

        $this->requestResponder = User::factory()
            ->asRequestResponder()
            ->create([
                'email' => 'request-responder@test.com',
                'sub' => 'request-responder@test.com',
            ]);

        $this->team = Team::factory()->create([
            'name' => 'test-team',
        ]);
        $this->poolOperator = User::factory()
            ->asPoolOperator($this->team->name)
            ->create([
                'email' => 'team-user@test.com',
                'sub' => 'team-user@test.com',
            ]);

        $this->platformAdmin = User::factory()
            ->asAdmin()
            ->create([
                'email' => 'admin-user@test.com',
                'sub' => 'admin-user@test.com',
            ]);
    }

    /**
     * Only Platform Admins should be able to viewAny
     *
     * @return void
     */
    public function testViewAny()
    {
        $this->assertFalse($this->guest->can('viewAny', User::class));
        $this->assertFalse($this->applicant->can('viewAny', User::class));
        $this->assertFalse($this->poolOperator->can('viewAny', User::class));
        $this->assertTrue($this->requestResponder->can('viewAny', User::class));
        $this->assertTrue($this->platformAdmin->can('viewAny', User::class));
    }

    /**
     * Only Platform Admins and the own user should be able to view
     *
     * @return void
     */
    public function testView()
    {
        $this->assertFalse($this->guest->can('view', $this->applicant));
        $this->assertTrue($this->applicant->can('view', $this->applicant));
        $this->assertFalse($this->otherApplicant->can('view', $this->applicant));
        $this->assertFalse($this->poolOperator->can('view', $this->applicant));
        $this->assertTrue($this->requestResponder->can('view', $this->applicant));
        $this->assertTrue($this->platformAdmin->can('view', $this->applicant));
    }

    /**
     * Only Platform Admins should be able to viewBasicInfo
     *
     * @return void
     */
    public function testViewBasicInfo()
    {
        $this->assertFalse($this->guest->can('viewBasicInfo', $this->applicant));
        $this->assertFalse($this->applicant->can('viewBasicInfo', $this->applicant));
        $this->assertFalse($this->poolOperator->can('viewBasicInfo', $this->applicant));
        $this->assertFalse($this->requestResponder->can('viewBasicInfo', $this->applicant));
        $this->assertTrue($this->platformAdmin->can('viewBasicInfo', $this->applicant));
    }

    /**
     * Only Platform Admins and the own user should be able to update
     *
     * @return void
     */
    public function testUpdate()
    {
        $this->assertFalse($this->guest->can('update', $this->applicant));
        $this->assertTrue($this->applicant->can('update', $this->applicant));
        $this->assertFalse($this->otherApplicant->can('update', $this->applicant));
        $this->assertFalse($this->poolOperator->can('update', $this->applicant));
        $this->assertFalse($this->requestResponder->can('update', $this->applicant));
        $this->assertTrue($this->platformAdmin->can('update', $this->applicant));
    }

    /**
     * Only Platform Admins can delete users, and not themselves.
     *
     * @return void
     */
    public function testDelete()
    {
        $this->assertFalse($this->guest->can('delete', $this->applicant));
        $this->assertFalse($this->applicant->can('delete', $this->applicant));
        $this->assertFalse($this->poolOperator->can('delete', $this->applicant));
        $this->assertFalse($this->requestResponder->can('delete', $this->applicant));
        $this->assertTrue($this->platformAdmin->can('delete', $this->applicant));
        $this->assertFalse($this->platformAdmin->can('delete', $this->platformAdmin));
    }

    /**
     * Only Request Responders can view any applicant profile.
     *
     * @return void
     */
    public function viewAnyApplicants()
    {
        $this->assertFalse($this->guest->can('viewAnyApplicants', User::class));
        $this->assertFalse($this->applicant->can('viewAnyApplicants', User::class));
        $this->assertFalse($this->poolOperator->can('viewAnyApplicants', User::class));
        $this->assertTrue($this->requestResponder->can('viewAnyApplicants', User::class));
        $this->assertFalse($this->platformAdmin->can('viewAnyApplicants', User::class));
    }

    /**
     * Request Responders can view any applicant profile.
     * Pool Operators can view an applicant profile if they have applied to a pool in their team.
     *
     * @return void
     */
    public function viewApplicant()
    {
        $pool = Pool::factory()->create([
            'team_id' => $this->team->id,
        ]);
        PoolCandidate::factory()->create([
            'user_id' => $this->applicant->id,
            'pool_id' => $pool->id,
        ]);

        // This pool is in a different team than $this->poolOperator
        $otherPool = Pool::factory()->create();
        PoolCandidate::factory()->create([
            'user_id' => $this->otherApplicant->id,
            'pool_id' => $otherPool->id,
        ]);

        $this->assertFalse($this->guest->can('viewApplicant', $this->applicant));
        $this->assertFalse($this->applicant->can('viewApplicant', $this->applicant));
        $this->assertTrue($this->poolOperator->can('viewApplicant', $this->applicant));
        $this->assertFalse($this->poolOperator->can('viewApplicant', $this->otherApplicant));
        $this->assertTrue($this->requestResponder->can('viewApplicant', $this->applicant));
        $this->assertFalse($this->platformAdmin->can('viewApplicant', $this->applicant));
    }
}

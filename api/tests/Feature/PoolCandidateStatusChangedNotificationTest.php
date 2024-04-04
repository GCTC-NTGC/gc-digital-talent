<?php

use App\Enums\PoolCandidateStatus;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use App\Notifications\PoolCandidateStatusChanged;
use Database\Seeders\ClassificationSeeder;
use Database\Seeders\GenericJobTitleSeeder;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SkillFamilySeeder;
use Database\Seeders\SkillSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;

class PoolCandidateStatusChangedNotificationTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;

    protected $user;

    protected $pool;

    protected $candidateUser;

    protected $poolCandidate;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(ClassificationSeeder::class);
        $this->seed(GenericJobTitleSeeder::class);
        $this->seed(SkillFamilySeeder::class);
        $this->seed(SkillSeeder::class);
        $this->seed(RolePermissionSeeder::class);

        $this->candidateUser = User::factory()
            ->asApplicant()
            ->create();

        $this->pool = Pool::factory()
            ->published()
            ->create();

        $this->poolCandidate = PoolCandidate::factory()->create([
            'user_id' => $this->candidateUser->id,
            'pool_id' => $this->pool->id,
        ]);
    }

    /**
     * Test that notifications are generated for status changes
     *
     * @return void
     */
    public function testStatusChangeCausesNotifications()
    {
        if (! config('feature.status_notifications')) {
            $this->markTestSkipped('This test uses features behind the FEATURE_STATUS_NOTIFICATIONS flag.');
        }

        Notification::fake(); // initialize notification facade

        // set up submitted candidate
        $this->poolCandidate->pool_candidate_status = PoolCandidateStatus::NEW_APPLICATION->name;
        $this->poolCandidate->saveQuietly(); // don't generate events during set up

        // simulate screening in
        $this->poolCandidate->pool_candidate_status = PoolCandidateStatus::SCREENED_IN->name;
        $this->poolCandidate->save();

        // check that notification was fired
        Notification::assertSentTo([$this->candidateUser], PoolCandidateStatusChanged::class);
    }
}

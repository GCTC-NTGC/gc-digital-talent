<?php

namespace Tests\Feature\Notifications;

use App\Enums\ApplicationStatus;
use App\Enums\NotificationFamily;
use App\Enums\ScreeningStage;
use App\Models\Community;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use App\Notifications\ApplicationDeadlineExtended;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Notification;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;

class SendApplicationDeadlineExtendedTest extends TestCase
{
    use RefreshDatabase;
    use RefreshesSchemaCache;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'send-notifications:application-deadline-extended';

    private User $adminUser;

    private User $draftUser;

    private User $draftExpiredUser;

    private User $applicationReviewUser;

    private Pool $draftPool;

    private Pool $publishedPool;

    private PoolCandidate $draft;

    private PoolCandidate $draftExpired;

    private PoolCandidate $applicationReview;

    private PoolCandidate $userInDraftPool;

    protected function setUp(): void
    {
        parent::setUp();

        Notification::fake();

        $this->seed(RolePermissionSeeder::class);
        Community::factory()->create();

        $this->adminUser = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create([
                'sub' => 'adminUser',
                'enabled_email_notifications' => [NotificationFamily::APPLICATION_UPDATE->name],
                'enabled_in_app_notifications' => [NotificationFamily::APPLICATION_UPDATE->name],
            ]);

        $this->draftUser = User::factory()
            ->asApplicant()
            ->create([
                'sub' => 'draftUser',
                'enabled_email_notifications' => [NotificationFamily::APPLICATION_UPDATE->name],
                'enabled_in_app_notifications' => [NotificationFamily::APPLICATION_UPDATE->name],
            ]);

        $this->draftExpiredUser = User::factory()
            ->asApplicant()
            ->create([
                'sub' => 'draftExpiredUser',
                'enabled_email_notifications' => [NotificationFamily::APPLICATION_UPDATE->name],
                'enabled_in_app_notifications' => [NotificationFamily::APPLICATION_UPDATE->name],
            ]);

        $this->applicationReviewUser = User::factory()
            ->asApplicant()
            ->create([
                'sub' => 'applicationReviewUser',
                'enabled_email_notifications' => [NotificationFamily::APPLICATION_UPDATE->name],
                'enabled_in_app_notifications' => [NotificationFamily::APPLICATION_UPDATE->name],
            ]);

        $this->draftPool = Pool::factory()
            ->for($this->adminUser)
            ->withPoolSkills(1, 0)
            ->draft()
            ->create([
                'closing_date' => Carbon::parse('1993-01-16'),
            ]);

        $this->publishedPool = Pool::factory()
            ->for($this->adminUser)
            ->withPoolSkills(1, 0)
            ->published()
            ->create([
                'closing_date' => Carbon::parse('1993-01-16'),
            ]);

        $this->draft = PoolCandidate::factory()
            ->for($this->publishedPool)
            ->for($this->draftUser)
            ->create([
                'expiry_date' => config('constants.far_future_date'),
                'application_status' => ApplicationStatus::DRAFT->name,
            ]);

        $this->draftExpired = PoolCandidate::factory()
            ->for($this->publishedPool)
            ->for($this->draftExpiredUser)
            ->create([
                'application_status' => ApplicationStatus::DRAFT->name,
                'expiry_date' => config('constants.past_date'),
            ]);

        $this->applicationReview = PoolCandidate::factory()
            ->for($this->publishedPool)
            ->for($this->applicationReviewUser)
            ->create([
                'application_status' => ApplicationStatus::TO_ASSESS->name,
                'screening_stage' => ScreeningStage::APPLICATION_REVIEW->name,
            ]);

        $this->userInDraftPool = PoolCandidate::factory()
            ->for($this->draftPool)
            ->for($this->draftUser)
            ->create([
                'application_status' => ApplicationStatus::DRAFT->name,
            ]);
    }

    // Only send notification if the application is draft
    public function testNotificationOnlySentToDraft(): void
    {
        Notification::fake();
        Notification::assertNothingSent();

        $this->publishedPool->closing_date = Carbon::parse('3000-12-31');
        $this->publishedPool->save();

        Notification::assertSentTo([$this->draftUser], ApplicationDeadlineExtended::class);
        Notification::assertNotSentTo([$this->draftExpiredUser], ApplicationDeadlineExtended::class);
        Notification::assertNotSentTo([$this->applicationReviewUser], ApplicationDeadlineExtended::class);
    }

    // No notification sent to draft pools
    public function testNotificationToDraftPools(): void
    {
        Notification::fake();
        Notification::assertNothingSent();

        $this->draftPool->closing_date = Carbon::parse('3000-12-31');
        $this->draftPool->save();

        Notification::assertNotSentTo([$this->userInDraftPool], ApplicationDeadlineExtended::class);
    }
}

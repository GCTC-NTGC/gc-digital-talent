<?php

namespace Tests\Feature\Notifications;

use App\Enums\NotificationFamily;
use App\Models\User;
use App\Notifications\GcNotifyEmailChannel;
use App\Notifications\GcNotifyWorkEmailChannel;
use App\Notifications\System;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

use function PHPUnit\Framework\assertEquals;
use function PHPUnit\Framework\assertEqualsCanonicalizing;

class SystemTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    private function makeNotification(bool $channelEmail, bool $channelApp): System
    {
        return new System(
            $channelEmail,
            $channelApp,
            'subject en',
            'subject fr',
            'content en',
            'content fr',
            'message en',
            'message fr',
            'href en',
            'href fr',
        );
    }

    private function createUser(array $attributes = []): User
    {
        return User::factory()->create([
            'email' => 'contact@example.com',
            'work_email' => 'work@gc.ca',
            'work_email_verified_at' => Carbon::now(),
            'enabled_work_email_notifications' => [NotificationFamily::SYSTEM_MESSAGE->name],
            ...$attributes,
        ]);
    }

    public function testEmailAlsoSentToOptedInWorkEmail(): void
    {
        $user = $this->createUser();

        assertEqualsCanonicalizing(
            [GcNotifyEmailChannel::class, GcNotifyWorkEmailChannel::class, 'database'],
            $this->makeNotification(true, true)->via($user)
        );
    }

    public function testInAppOnlyNotSentToWorkEmail(): void
    {
        $user = $this->createUser();

        assertEquals(['database'], $this->makeNotification(false, true)->via($user));
    }

    public function testNotSentToWorkEmailWithoutOptIn(): void
    {
        $user = $this->createUser([
            'enabled_work_email_notifications' => [NotificationFamily::JOB_ALERT->name],
        ]);

        assertEquals([GcNotifyEmailChannel::class], $this->makeNotification(true, false)->via($user));
    }

    public function testNotSentToUnverifiedWorkEmail(): void
    {
        $user = $this->createUser(['work_email_verified_at' => null]);

        assertEquals([GcNotifyEmailChannel::class], $this->makeNotification(true, false)->via($user));
    }

    public function testNotSentToMissingWorkEmail(): void
    {
        $user = $this->createUser(['work_email' => null, 'work_email_verified_at' => null]);

        assertEquals([GcNotifyEmailChannel::class], $this->makeNotification(true, false)->via($user));
    }

    public function testNotSentToWorkEmailSameAsContactEmail(): void
    {
        $user = $this->createUser(['email' => 'Same@gc.ca', 'work_email' => 'same@GC.ca']);

        assertEquals([GcNotifyEmailChannel::class], $this->makeNotification(true, false)->via($user));
    }
}

<?php

namespace Tests\Feature;

use App\Jobs\GcNotifyApiRequest;
use App\Models\User;
use App\Notifications\AdHocEmail;
use App\Notifications\GcNotifyWorkEmailChannel;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Notifications\AnonymousNotifiable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class GcNotifyWorkEmailChannelTest extends TestCase
{
    use RefreshDatabase;

    protected GcNotifyWorkEmailChannel $channel;

    protected AdHocEmail $notification;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);

        config(['notify.client.apiKey' => 'test-key']);

        Queue::fake();

        $this->channel = new GcNotifyWorkEmailChannel();
        $this->notification = new AdHocEmail('template-id-en', 'template-id-fr');
    }

    public function testSendsToVerifiedWorkEmail(): void
    {
        $user = User::factory()->create([
            'email' => 'contact@example.com',
            'work_email' => 'work@gc.ca',
            'work_email_verified_at' => Carbon::now(),
        ]);

        $this->channel->send($user, $this->notification);

        Queue::assertPushed(GcNotifyApiRequest::class, 1);
        Queue::assertPushed(
            GcNotifyApiRequest::class,
            fn (GcNotifyApiRequest $job) => $job->message->emailAddress === 'work@gc.ca'
        );
    }

    public function testDoesNotSendWhenWorkEmailUnverified(): void
    {
        $user = User::factory()->create([
            'work_email' => 'work@gc.ca',
            'work_email_verified_at' => null,
        ]);

        $this->channel->send($user, $this->notification);

        Queue::assertNothingPushed();
    }

    public function testDoesNotSendWhenWorkEmailMissing(): void
    {
        $user = User::factory()->create([
            'work_email' => null,
            'work_email_verified_at' => null,
        ]);

        $this->channel->send($user, $this->notification);

        Queue::assertNothingPushed();
    }

    public function testDoesNotSendToAnonymousNotifiableWithoutRoute(): void
    {
        $this->channel->send(new AnonymousNotifiable(), $this->notification);

        Queue::assertNothingPushed();
    }
}

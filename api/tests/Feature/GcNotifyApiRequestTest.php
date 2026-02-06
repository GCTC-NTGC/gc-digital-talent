<?php

namespace Tests\Feature;

use App\Exceptions\ExternalServiceException;
use App\Facades\Notify;
use App\Jobs\GcNotifyApiRequest;
use App\Notifications\Messages\GcNotifyEmailMessage;
use Exception;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class GcNotifyApiRequestTest extends TestCase
{
    protected $message;

    protected function setUp(): void
    {
        parent::setUp();

        $this->message = new GcNotifyEmailMessage(
            templateId: '1',
            emailAddress: config('notify.smokeTest.emailAddress'),
            messageVariables: [
                'body' => 'test',
            ]);

    }

    /** Test that notification can be queue and sent */
    public function testHappyPath(): void
    {
        Notify::expects('sendEmail')
            ->andReturn(new Response(Http::response('ok', 201)->wait()))
            ->once();

        $job = (new GcNotifyApiRequest($this->message))->withFakeQueueInteractions();
        $job->handle();

        $job->assertNotReleased();
        $job->assertNotDeleted();
        $job->assertNotFailed();
    }

    /** Test that notification doesn't catch exception in the notify client so it can be retried */
    public function testClientException(): void
    {
        $this->expectException(ConnectionException::class);

        Notify::expects('sendEmail')
            ->andThrow(new ConnectionException())
            ->once();

        $job = (new GcNotifyApiRequest($this->message))->withFakeQueueInteractions();
        $job->handle();

        $job->assertNotReleased();
        $job->assertNotDeleted();
        $job->assertNotFailed();
    }

    /** Test that notification is failed if an error comes back */
    public function testClientFailure(): void
    {
        Notify::expects('sendEmail')
            ->andReturn(new Response(Http::response('bad request', 400)->wait()))
            ->once();

        $job = (new GcNotifyApiRequest($this->message))->withFakeQueueInteractions();
        $job->handle();

        $job->assertNotReleased();
        $job->assertNotDeleted();
        $job->assertFailed();
    }

    /* If there are too many requests, an exception is thrown so it can be retried */
    public function testTooManyRequests(): void
    {
        $this->expectException(ExternalServiceException::class);

        Notify::expects('sendEmail')
            ->andReturn(new Response(Http::response('too many requests', 429)->wait()))
            ->once();

        $job = (new GcNotifyApiRequest($this->message))->withFakeQueueInteractions();
        $job->handle();

        $job->assertNotReleased();
        $job->assertNotDeleted();
        $job->assertNotFailed();
    }

    /* Check our rate limiter */
    // public function testOurRateLimiter(): void
    // {
    //     Notify::expects('sendEmail')
    //         ->andReturn(new Response(Http::response('ok', 201)->wait()))
    //         ->times(5);

    //     $job = (new GcNotifyApiRequest($this->message))->withFakeQueueInteractions();
    //     $job->dispatch(1);

    //     $job->assertNotReleased();
    //     $job->assertNotDeleted();
    //     $job->assertNotFailed();
    // }
}

<?php

namespace Tests\Feature;

use App\Facades\Notify;
use App\Jobs\GcNotifyApiRequest;
use App\Notifications\Messages\GcNotifyEmailMessage;
use Closure;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
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

    // chain together the middleware closures on a job the way the actual queue would do it
    protected function buildMiddlewareStack(GcNotifyApiRequest $job): Closure
    {
        $middlewareArray = $job->middleware();
        $next = function () use ($job) {
            $job->handle();
        };
        foreach (array_reverse($middlewareArray) as $middleware) {
            $next = function () use ($middleware, $job, $next) {
                return $middleware->handle($job, $next);
            };
        }

        return $next;
    }

    /** Test that notification can be queue and sent */
    public function testHappyPath(): void
    {
        Notify::expects('sendEmail')
            ->andReturn(new Response(Http::response('created', 201)->wait()))
            ->once();

        $job = (new GcNotifyApiRequest($this->message))->withFakeQueueInteractions();
        $execute = $this->buildMiddlewareStack($job);
        $execute();

        $job->assertNotReleased();
        $job->assertNotDeleted();
        $job->assertNotFailed();
    }

    /** Test that the job is released back on the queue for API exceptions */
    public function testClientException(): void
    {
        Notify::expects('sendEmail')
            ->andThrow(new ConnectionException())
            ->once();

        $job = (new GcNotifyApiRequest($this->message))->withFakeQueueInteractions();
        $execute = $this->buildMiddlewareStack($job);
        $execute();

        $job->assertReleased(); // exception results in throttle retry
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
        $execute = $this->buildMiddlewareStack($job);
        $execute();

        $job->assertNotReleased();
        $job->assertNotDeleted();
        $job->assertFailed(); // immediate failure for bad requests
    }

    /* If there are too many requests, the job is released so it can be retried */
    public function testTooManyRequests(): void
    {
        Notify::expects('sendEmail')
            ->andReturn(new Response(Http::response('too many requests', 429)->wait()))
            ->once();

        $job = (new GcNotifyApiRequest($this->message))->withFakeQueueInteractions();
        $execute = $this->buildMiddlewareStack($job);
        $execute();

        $job->assertReleased();  // released for throttled retry
        $job->assertNotDeleted();
        $job->assertNotFailed();
    }

    /* Check our rate limiter */
    public function testOurRateLimiter(): void
    {
        // Set the rate limiter to 2 requests per minute for this test
        config(['notify.client.max_requests_per_minute' => 2]);

        Notify::expects('sendEmail')
            ->andReturn(new Response(Http::response('ok', 201)->wait()))
            ->twice(); // only two get though and the third gets released

        // define more jobs than the limiter will allow
        $job1 = (new GcNotifyApiRequest($this->message))->withFakeQueueInteractions();
        $execute1 = $this->buildMiddlewareStack($job1);
        $job2 = (new GcNotifyApiRequest($this->message))->withFakeQueueInteractions();
        $execute2 = $this->buildMiddlewareStack($job2);
        $job3 = (new GcNotifyApiRequest($this->message))->withFakeQueueInteractions();
        $execute3 = $this->buildMiddlewareStack($job3);

        // call middleware stacks
        $execute1();
        $job1->assertNotReleased();  // goes through
        $job1->assertNotDeleted();
        $job1->assertNotFailed();

        $execute2();
        $job2->assertNotReleased();  // goes through
        $job2->assertNotDeleted();
        $job2->assertNotFailed();

        $execute3();
        $job3->assertReleased();  // gets released since it hits the limiter
        $job3->assertNotDeleted();
        $job3->assertNotFailed();
    }
}

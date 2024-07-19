<?php

namespace Tests\Feature;

use App\Facades\Notify;
use App\Models\User;
use App\Notifications\VerifyEmail;
use Database\Seeders\ClassificationSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Notification;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;
use Tests\UsesUnprotectedGraphqlEndpoint;

use function PHPUnit\Framework\assertEquals;
use function PHPUnit\Framework\assertNotNull;
use function PHPUnit\Framework\assertNull;

class UserVerifyEmailTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesUnprotectedGraphqlEndpoint;

    protected $regularUser;

    protected $adminUser;

    private $sendVerificationEmailMutation =
        /** @lang GraphQL */
        'mutation SendVerificationEmail($id: ID!) {
            sendUserEmailVerification(id: $id) {
                id
            }
        }';

    private $verifyEmailMutation =
        /** @lang GraphQL */
        'mutation VerifyMyEmail($id: ID!, $code: String!) {
            verifyUserEmail(id: $id, code: $code) {
                id
                isEmailVerified
            }
        }';

    protected function setUp(): void
    {
        parent::setUp();
        Notify::spy(); // don't actually send anything

        // Run necessary seeders
        $this->seed(ClassificationSeeder::class);
        $this->seed(RolePermissionSeeder::class);

        $this->regularUser = User::factory()
            ->asApplicant()
            ->create([
                'id' => '00000000-0000-0000-0000-000000000001',
                'email' => 'regular.user@example.org',
                'email_verified_at' => null,
            ]);

        $this->adminUser = User::factory()
            ->asAdmin()
            ->create();
    }

    public function testUserCanGenerateNotification()
    {
        Notification::fake();

        $this->actingAs($this->regularUser, 'api')->graphQL(
            $this->sendVerificationEmailMutation,
            ['id' => '00000000-0000-0000-0000-000000000001']
        );

        Notification::assertSentTo(
            [$this->regularUser], VerifyEmail::class
        );

    }

    public function testUserCantGenerateNotificationForSomeoneElse()
    {
        Notification::fake();

        $this->actingAs($this->adminUser, 'api')->graphQL(
            $this->sendVerificationEmailMutation,
            ['id' => '00000000-0000-0000-0000-000000000001']
        )
            ->assertGraphQLErrorMessage('This action is unauthorized.');

        Notification::assertNothingSent();
    }

    public function testCodeSaved()
    {
        $this->actingAs($this->regularUser, 'api')->graphQL(
            $this->sendVerificationEmailMutation,
            ['id' => '00000000-0000-0000-0000-000000000001']
        );

        $token = Cache::get('email-verification-00000000-0000-0000-0000-000000000001');
        assertNotNull($token);
        assertNotNull($token['code']);
        assertEquals('email', $token['field']);
        assertEquals($this->regularUser->email, $token['value']);
    }

    public function testCanVerifyWithCode()
    {
        Cache::put(
            'email-verification-00000000-0000-0000-0000-000000000001',
            [
                'code' => '1234',
                'field' => 'email',
                'value' => 'regular.user@example.org',
            ],
            now()->addHours(2)
        );

        $this->actingAs($this->regularUser, 'api')->graphQL(
            $this->verifyEmailMutation,
            [
                'id' => '00000000-0000-0000-0000-000000000001',
                'code' => '1234',
            ]
        );

        $this->regularUser->refresh();
        assertNotNull($this->regularUser->email_verified_at);
    }

    public function testCantVerifyWithBadCode()
    {
        Cache::put(
            'email-verification-00000000-0000-0000-0000-000000000001',
            [
                'code' => '1234',
                'field' => 'email',
                'value' => 'regular.user@example.org',
            ],
            now()->addHours(2)
        );

        $this->actingAs($this->regularUser, 'api')->graphQL(
            $this->verifyEmailMutation,
            [
                'id' => '00000000-0000-0000-0000-000000000001',
                'code' => '6789',
            ]
        )->assertGraphQLErrorMessage('VERIFICATION_FAILED');

        $this->regularUser->refresh();
        assertNull($this->regularUser->email_verified_at);
    }

    public function testCantVerifyWithBadField()
    {
        Cache::put(
            'email-verification-00000000-0000-0000-0000-000000000001',
            [
                'code' => '1234',
                'field' => 'work_email',
                'value' => 'regular.user@example.org',
            ],
            now()->addHours(2)
        );

        $this->actingAs($this->regularUser, 'api')->graphQL(
            $this->verifyEmailMutation,
            [
                'id' => '00000000-0000-0000-0000-000000000001',
                'code' => '1234',
            ]
        )->assertGraphQLErrorMessage('VERIFICATION_FAILED');

        $this->regularUser->refresh();
        assertNull($this->regularUser->email_verified_at);
    }

    public function testCantVerifyWithBadEmail()
    {
        Cache::put(
            'email-verification-00000000-0000-0000-0000-000000000001',
            [
                'code' => '1234',
                'field' => 'email',
                'value' => 'different.user@example.org',
            ],
            now()->addHours(2)
        );

        $this->actingAs($this->regularUser, 'api')->graphQL(
            $this->verifyEmailMutation,
            [
                'id' => '00000000-0000-0000-0000-000000000001',
                'code' => '1234',
            ]
        )->assertGraphQLErrorMessage('VERIFICATION_FAILED');

        $this->regularUser->refresh();
        assertNull($this->regularUser->email_verified_at);
    }

    public function testCantVerifyWithExpiredCode()
    {
        Cache::put(
            'email-verification-00000000-0000-0000-0000-000000000001',
            [
                'code' => '1234',
                'field' => 'email',
                'value' => 'regular.user@example.org',
            ],
            now()->addHours(2)
        );

        $this->travel(3)->hours();

        $this->actingAs($this->regularUser, 'api')->graphQL(
            $this->verifyEmailMutation,
            [
                'id' => '00000000-0000-0000-0000-000000000001',
                'code' => '1234',
            ]
        )->assertGraphQLErrorMessage('VERIFICATION_FAILED');

        $this->regularUser->refresh();
        assertNull($this->regularUser->email_verified_at);
    }

    public function testChangingEmailClearsVerification()
    {
        // start off verified
        $this->regularUser->email_verified_at = Carbon::now();
        $this->regularUser->save();
        assertNotNull($this->regularUser->email_verified_at);

        // change email away from the verified one
        $this->regularUser->email = 'new.email@example.org';
        $this->regularUser->save();

        // check that verification was cleared
        assertNull($this->regularUser->email_verified_at);
    }
}

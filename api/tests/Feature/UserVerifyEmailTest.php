<?php

namespace Tests\Feature;

use App\Enums\EmailType;
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
        'mutation SendVerificationEmail($emailType: EmailType) {
            sendUserEmailVerification(emailType: $emailType) {
                id
            }
        }';

    private $verifyEmailMutation =
        /** @lang GraphQL */
        'mutation VerifyMyEmail($code: String!, $emailType: EmailType) {
            verifyUserEmail(code: $code, emailType: $emailType) {
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
                'work_email' => 'regular.user@gc.ca',
                'work_email_verified_at' => null,
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
        );

        Notification::assertSentTo(
            [$this->regularUser], VerifyEmail::class
        );

    }

    public function testCodeSaved()
    {
        $this->actingAs($this->regularUser, 'api')->graphQL(
            $this->sendVerificationEmailMutation,
        );

        $token = Cache::get('CONTACT-email-verification-00000000-0000-0000-0000-000000000001');
        assertNotNull($token);
        assertNotNull($token['code']);
        assertEquals('email', $token['field']);
        assertEquals($this->regularUser->email, $token['value']);
    }

    public function testCanVerifyWithCode()
    {
        Cache::put(
            'CONTACT-email-verification-00000000-0000-0000-0000-000000000001',
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
                'code' => '1234',
            ]
        );

        $this->regularUser->refresh();
        assertNotNull($this->regularUser->email_verified_at);
    }

    public function testCantVerifyWithBadCode()
    {
        Cache::put(
            'CONTACT-email-verification-00000000-0000-0000-0000-000000000001',
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
                'code' => '6789',
            ]
        )->assertGraphQLErrorMessage('VERIFICATION_FAILED');

        $this->regularUser->refresh();
        assertNull($this->regularUser->email_verified_at);
    }

    public function testCantVerifyWithBadField()
    {
        Cache::put(
            'CONTACT-email-verification-00000000-0000-0000-0000-000000000001',
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
                'code' => '1234',
            ]
        )->assertGraphQLErrorMessage('VERIFICATION_FAILED');

        $this->regularUser->refresh();
        assertNull($this->regularUser->email_verified_at);
    }

    public function testCantVerifyWithBadEmail()
    {
        Cache::put(
            'CONTACT-email-verification-00000000-0000-0000-0000-000000000001',
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
                'code' => '1234',
            ]
        )->assertGraphQLErrorMessage('VERIFICATION_FAILED');

        $this->regularUser->refresh();
        assertNull($this->regularUser->email_verified_at);
    }

    public function testCantVerifyWithExpiredCode()
    {
        Cache::put(
            'CONTACT-email-verification-00000000-0000-0000-0000-000000000001',
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

    public function testWorkEmailCodeSaved()
    {
        $this->actingAs($this->regularUser, 'api')->graphQL(
            $this->sendVerificationEmailMutation,
            [
                'emailType' => 'WORK',
            ]
        );

        $token = Cache::get('WORK-email-verification-00000000-0000-0000-0000-000000000001');
        assertNotNull($token);
        assertNotNull($token['code']);
        assertEquals('work_email', $token['field']);
        assertEquals($this->regularUser->work_email, $token['value']);
    }

    public function testCanVerifyWorkEmailWithCode()
    {
        Cache::put(
            'WORK-email-verification-00000000-0000-0000-0000-000000000001',
            [
                'code' => '1234',
                'field' => 'work_email',
                'value' => 'regular.user@gc.ca',
            ],
            now()->addHours(2)
        );

        $this->actingAs($this->regularUser, 'api')->graphQL(
            $this->verifyEmailMutation,
            [
                'code' => '1234',
                'emailType' => 'WORK',
            ]
        );

        $this->regularUser->refresh();
        assertNotNull($this->regularUser->work_email_verified_at);
    }

    public function testChangingWorkEmailClearsVerification()
    {
        // start off verified
        $this->regularUser->work_email_verified_at = Carbon::now();
        $this->regularUser->save();
        assertNotNull($this->regularUser->work_email_verified_at);

        // change email away from the verified one
        $this->regularUser->work_email = 'new.email@gc.ca';
        $this->regularUser->save();

        // check that verification was cleared
        assertNull($this->regularUser->work_email_verified_at);
    }

    public function testNullEmailFailsSending()
    {
        $this->regularUser->work_email = null;
        $this->regularUser->work_email_verified_at = null;
        $this->regularUser->save();

        $this->actingAs($this->regularUser, 'api')
            ->graphQL($this->sendVerificationEmailMutation, [
                'emailType' => EmailType::WORK->name,
            ])
            ->assertGraphQLErrorMessage('Email type '.EmailType::WORK->name.' not set');

    }
}

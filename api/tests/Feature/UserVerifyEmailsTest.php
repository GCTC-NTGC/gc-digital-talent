<?php

namespace Tests\Feature;

use App\Enums\EmailType;
use App\Enums\ErrorCode;
use App\Facades\Notify;
use App\Models\User;
use App\Notifications\VerifyEmails;
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

class UserVerifyEmailsTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;
    use UsesUnprotectedGraphqlEndpoint;

    protected $regularUser;

    protected $adminUser;

    private $sendVerificationEmailsMutation =
        /** @lang GraphQL */
        'mutation SendVerificationEmail($input: SendUserEmailsVerificationInput!) {
            sendUserEmailsVerification(sendUserEmailsVerificationInput: $input) {
                id
            }
        }';

    private $verifyEmailsMutation =
        /** @lang GraphQL */
        'mutation VerifyMyEmails($code: String!) {
            verifyUserEmails(code: $code) {
                id
                email
                isEmailVerified
                workEmail
                isWorkEmailVerified
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
            $this->sendVerificationEmailsMutation,
            [
                'input' => [
                    'emailAddress' => 'regular.user.2@example.org',
                    'emailTypes' => [EmailType::CONTACT->name],
                ],
            ]
        );

        Notification::assertSentTo(
            [$this->regularUser], VerifyEmails::class
        );

    }

    public function testCodeSaved()
    {
        $this->actingAs($this->regularUser, 'api')->graphQL(
            $this->sendVerificationEmailsMutation,
            [
                'input' => [
                    'emailAddress' => 'regular.user.2@example.org',
                    'emailTypes' => [EmailType::CONTACT->name],
                ],
            ]
        );

        $token = Cache::get('email-verification-00000000-0000-0000-0000-000000000001');
        assertNotNull($token);
        assertNotNull($token['code']);
        assertEquals([EmailType::CONTACT->name], $token['emailTypes']);
        assertEquals('regular.user.2@example.org', $token['emailAddress']);
    }

    public function testCanVerifyWithCode()
    {
        Cache::put(
            'email-verification-00000000-0000-0000-0000-000000000001',
            [
                'code' => '1234',
                'emailTypes' => [EmailType::CONTACT->name],
                'emailAddress' => 'regular.user.2@example.org',
            ],
            now()->addHours(2)
        );

        // stable verified_at timestamps
        Carbon::setTestNow('2000-01-01 00:00:00');

        $this->actingAs($this->regularUser, 'api')->graphQL(
            $this->verifyEmailsMutation,
            [
                'code' => '1234',
            ]
        );

        $this->assertDatabaseHas('users', [
            'id' => '00000000-0000-0000-0000-000000000001',
            'email' => 'regular.user.2@example.org',
            'email_verified_at' => '2000-01-01 00:00:00',
        ]);
    }

    public function testCantVerifyWithBadCode()
    {
        Cache::put(
            'email-verification-00000000-0000-0000-0000-000000000001',
            [
                'code' => '1234',
                'emailTypes' => [EmailType::CONTACT->name],
                'emailAddress' => 'regular.user.2@example.org',
            ],
            now()->addHours(2)
        );

        $this->actingAs($this->regularUser, 'api')->graphQL(
            $this->verifyEmailsMutation,
            [
                'code' => '6789',
            ]
        )->assertGraphQLErrorMessage('VERIFICATION_FAILED');

        $this->assertDatabaseHas('users', [
            'id' => '00000000-0000-0000-0000-000000000001',
            'email' => 'regular.user@example.org',
            'email_verified_at' => null,
        ]);
    }

    public function testCantVerifyWithBadField()
    {
        Cache::put(
            'email-verification-00000000-0000-0000-0000-000000000001',
            [
                'code' => '1234',
                'emailTypes' => [EmailType::WORK->name],
                'emailAddress' => 'regular.user.2@example.org',
            ],
            now()->addHours(2)
        );

        $this->actingAs($this->regularUser, 'api')->graphQL(
            $this->verifyEmailsMutation,
            [
                'code' => '1234',
            ]
        )->assertGraphQLErrorMessage(ErrorCode::NOT_GOVERNMENT_EMAIL->name);

        $this->assertDatabaseHas('users', [
            'id' => '00000000-0000-0000-0000-000000000001',
            'work_email' => 'regular.user@gc.ca',
            'work_email_verified_at' => null,
        ]);
    }

    public function testCantVerifyWithExpiredCode()
    {
        Cache::put(
            'email-verification-00000000-0000-0000-0000-000000000001',
            [
                'code' => '1234',
                'emailTypes' => [EmailType::CONTACT->name],
                'emailAddress' => 'regular.user.2@example.org',
            ],
            now()->addHours(2)
        );

        $this->travel(3)->hours();

        $this->actingAs($this->regularUser, 'api')->graphQL(
            $this->verifyEmailsMutation,
            [
                'code' => '1234',
            ]
        )->assertGraphQLErrorMessage(ErrorCode::VERIFICATION_FAILED->name);

        $this->assertDatabaseHas('users', [
            'id' => '00000000-0000-0000-0000-000000000001',
            'email' => 'regular.user@example.org',
            'email_verified_at' => null,
        ]);
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
            $this->sendVerificationEmailsMutation,
            [
                'input' => [
                    'emailAddress' => 'regular.user.2@gc.ca',
                    'emailTypes' => [EmailType::WORK->name],
                ],
            ]
        );

        $token = Cache::get('email-verification-00000000-0000-0000-0000-000000000001');
        assertNotNull($token);
        assertNotNull($token['code']);
        assertEquals([EmailType::WORK->name], $token['emailTypes']);
        assertEquals('regular.user.2@gc.ca', $token['emailAddress']);
    }

    public function testCanVerifyWorkEmailWithCode()
    {
        Cache::put(
            'email-verification-00000000-0000-0000-0000-000000000001',
            [
                'code' => '1234',
                'emailTypes' => [EmailType::WORK->name],
                'emailAddress' => 'regular.user.2@gc.ca',
            ],
            now()->addHours(2)
        );

        // stable verified_at timestamps
        Carbon::setTestNow('2000-01-01 00:00:00');

        $this->actingAs($this->regularUser, 'api')->graphQL(
            $this->verifyEmailsMutation,
            [
                'code' => '1234',
            ]
        );

        $this->assertDatabaseHas('users', [
            'id' => '00000000-0000-0000-0000-000000000001',
            'work_email' => 'regular.user.2@gc.ca',
            'work_email_verified_at' => '2000-01-01 00:00:00',
        ]);
    }

    public function testCanVerifyBothSimultaneouslyWithCode()
    {
        Cache::put(
            'email-verification-00000000-0000-0000-0000-000000000001',
            [
                'code' => '1234',
                'emailTypes' => [EmailType::CONTACT->name, EmailType::WORK->name],
                'emailAddress' => 'regular.user.2@gc.ca',
            ],
            now()->addHours(2)
        );

        // stable verified_at timestamps
        Carbon::setTestNow('2000-01-01 00:00:00');

        $this->actingAs($this->regularUser, 'api')->graphQL(
            $this->verifyEmailsMutation,
            [
                'code' => '1234',
            ]
        );

        $this->assertDatabaseHas('users', [
            'id' => '00000000-0000-0000-0000-000000000001',
            'email' => 'regular.user.2@gc.ca',
            'email_verified_at' => '2000-01-01 00:00:00',
            'work_email' => 'regular.user.2@gc.ca',
            'work_email_verified_at' => '2000-01-01 00:00:00',
        ]);
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

    public function testCannotRequestCodeForDuplicateEmail()
    {
        // Create another user with their own email
        User::factory()->create([
            'email' => 'regular.user.2@example.org',
        ]);

        $this->actingAs($this->regularUser, 'api')->graphQL(
            $this->sendVerificationEmailsMutation,
            [
                'input' => [
                    'emailAddress' => 'regular.user.2@example.org',
                    'emailTypes' => [EmailType::CONTACT->name],
                ],
            ]
        )->assertGraphQLValidationError('sendUserEmailsVerificationInput.emailAddress', ErrorCode::EMAIL_ADDRESS_IN_USE->name);
    }

    public function testCannotRequestCodeForDuplicateEmailWithWork()
    {
        // Create another user with their own email
        User::factory()->create([
            'work_email' => 'regular.user.2@example.org',
        ]);

        $this->actingAs($this->regularUser, 'api')->graphQL(
            $this->sendVerificationEmailsMutation,
            [
                'input' => [
                    'emailAddress' => 'regular.user.2@example.org',
                    'emailTypes' => [EmailType::CONTACT->name],
                ],
            ]
        )->assertGraphQLValidationError('sendUserEmailsVerificationInput.emailAddress', ErrorCode::EMAIL_ADDRESS_IN_USE->name);
    }

    public function testCannotRequestCodeForDuplicateEmailCaseInsensitive()
    {
        // Create another user with their own email
        User::factory()->create([
            'work_email' => 'regular.user.2@example.org',
        ]);

        $this->actingAs($this->regularUser, 'api')->graphQL(
            $this->sendVerificationEmailsMutation,
            [
                'input' => [
                    'emailAddress' => 'REGULAR.USER.2@EXAMPLE.ORG',
                    'emailTypes' => [EmailType::CONTACT->name],
                ],
            ]
        )->assertGraphQLValidationError('sendUserEmailsVerificationInput.emailAddress', ErrorCode::EMAIL_ADDRESS_IN_USE->name);
    }

    public function testCannotVerifyWithDuplicateContactEmail()
    {
        // Create another user with a contact email
        User::factory()->create([
            'email' => 'contact.duplicate@example.org',
        ]);

        Cache::put(
            'email-verification-00000000-0000-0000-0000-000000000001',
            [
                'code' => '5678',
                'emailTypes' => [EmailType::CONTACT->name],
                'emailAddress' => 'contact.duplicate@example.org',
            ],
            now()->addHours(2)
        );

        $this->actingAs($this->regularUser, 'api')->graphQL(
            $this->verifyEmailsMutation,
            [
                'code' => '5678',
            ]
        )->assertGraphQLValidationError('emailAddress', ErrorCode::EMAIL_ADDRESS_IN_USE->name);
    }

    public function testCannotVerifyWithDuplicateWorkEmail()
    {
        // Create another user with a work email
        User::factory()->create([
            'work_email' => 'work.duplicate@example.org',
        ]);

        Cache::put(
            'email-verification-00000000-0000-0000-0000-000000000001',
            [
                'code' => '5679',
                'emailTypes' => [EmailType::WORK->name],
                'emailAddress' => 'work.duplicate@example.org',
            ],
            now()->addHours(2)
        );

        $this->actingAs($this->regularUser, 'api')->graphQL(
            $this->verifyEmailsMutation,
            [
                'code' => '5679',
            ]
        )->assertGraphQLValidationError('emailAddress', ErrorCode::EMAIL_ADDRESS_IN_USE->name);
    }

    public function testCannotVerifyWithDuplicateWorkEmailCaseInsensitive()
    {
        // Create another user with a work email
        User::factory()->create([
            'work_email' => 'work.duplicate@example.org',
        ]);

        Cache::put(
            'email-verification-00000000-0000-0000-0000-000000000001',
            [
                'code' => '5680',
                'emailTypes' => [EmailType::CONTACT->name],
                'emailAddress' => 'WORK.DUPLICATE@EXAMPLE.ORG',
            ],
            now()->addHours(2)
        );

        $this->actingAs($this->regularUser, 'api')->graphQL(
            $this->verifyEmailsMutation,
            [
                'code' => '5680',
            ]
        )->assertGraphQLValidationError('emailAddress', ErrorCode::EMAIL_ADDRESS_IN_USE->name);
    }
}

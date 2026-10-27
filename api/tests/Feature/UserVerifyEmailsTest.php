<?php

namespace Tests\Feature;

use App\Enums\EmailType;
use App\Enums\ErrorCode;
use App\Facades\Notify;
use App\GraphQL\Exceptions\ClientSafeTooManyRequestsException;
use App\Models\User;
use App\Notifications\VerifyEmails;
use Database\Seeders\ClassificationSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Notification;
use Illuminate\Testing\TestResponse;
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

    // should match the limit in App\GraphQL\Mutations\VerifyUserEmails
    private const MAX_VERIFY_ATTEMPTS = 10;

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

    /**
     * Store a verification token for the regular user, as if a code had been sent
     */
    private function putVerificationToken(string $code = '1234', string $emailAddress = 'regular.user.2@gc.ca'): void
    {
        Cache::put(
            'email-verification-'.$this->regularUser->id,
            [
                'code' => $code,
                'emailTypes' => [EmailType::WORK->name],
                'emailAddress' => $emailAddress,
            ],
            now()->addHours(2)
        );
    }

    /**
     * Attempt to verify emails as the given user with the given code
     */
    private function attemptVerify(User $user, string $code): TestResponse
    {
        return $this->actingAs($user, 'api')->graphQL(
            $this->verifyEmailsMutation,
            ['code' => $code]
        );
    }

    /**
     * Use up every allowed attempt for the user with bad codes
     */
    private function exhaustVerifyAttempts(User $user): void
    {
        collect(range(1, self::MAX_VERIFY_ATTEMPTS))->each(
            fn () => $this->attemptVerify($user, 'BAD-CODE')
                ->assertGraphQLErrorMessage(ErrorCode::VERIFICATION_FAILED->name)
        );
    }

    public function testUserCanGenerateNotification()
    {
        Notification::fake();

        $this->actingAs($this->regularUser, 'api')->graphQL(
            $this->sendVerificationEmailsMutation,
            [
                'input' => [
                    'emailAddress' => 'regular.user.2@gc.ca',
                    'emailTypes' => [EmailType::WORK->name],
                ],
            ]
        );

        Notification::assertSentTo(
            [$this->regularUser], VerifyEmails::class
        );

    }

    public function testCantVerifyWithBadCode()
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

        $this->actingAs($this->regularUser, 'api')->graphQL(
            $this->verifyEmailsMutation,
            [
                'code' => '6789',
            ]
        )->assertGraphQLErrorMessage('VERIFICATION_FAILED');

        $this->assertDatabaseHas('users', [
            'id' => '00000000-0000-0000-0000-000000000001',
            'work_email' => 'regular.user@gc.ca',
            'work_email_verified_at' => null,
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
                'emailTypes' => [EmailType::WORK->name],
                'emailAddress' => 'regular.user.2@gc.ca',
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
            'work_email' => 'regular.user@gc.ca',
            'work_email_verified_at' => null,
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
            'email' => 'regular.user.2@gc.ca',
        ]);

        $this->actingAs($this->regularUser, 'api')->graphQL(
            $this->sendVerificationEmailsMutation,
            [
                'input' => [
                    'emailAddress' => 'regular.user.2@gc.ca',
                    'emailTypes' => [EmailType::WORK->name],
                ],
            ]
        )->assertGraphQLValidationError('sendUserEmailsVerificationInput.emailAddress', ErrorCode::EMAIL_ADDRESS_IN_USE->name);
    }

    public function testCanRequestCodeForAnotherUsersWorkEmail()
    {
        Notification::fake();

        // Another user's work email can be requested, it will be adopted on verification
        User::factory()->create([
            'work_email' => 'regular.user.2@gc.ca',
        ]);

        $this->actingAs($this->regularUser, 'api')->graphQL(
            $this->sendVerificationEmailsMutation,
            [
                'input' => [
                    'emailAddress' => 'regular.user.2@gc.ca',
                    'emailTypes' => [EmailType::WORK->name],
                ],
            ]
        )->assertJsonMissingPath('errors');

        Notification::assertSentTo(
            [$this->regularUser], VerifyEmails::class
        );
    }

    public function testCannotRequestCodeForDuplicateEmailCaseInsensitive()
    {
        // Create another user with their own email
        User::factory()->create([
            'email' => 'regular.user.2@gc.ca',
        ]);

        $this->actingAs($this->regularUser, 'api')->graphQL(
            $this->sendVerificationEmailsMutation,
            [
                'input' => [
                    'emailAddress' => 'REGULAR.USER.2@GC.CA',
                    'emailTypes' => [EmailType::WORK->name],
                ],
            ]
        )->assertGraphQLValidationError('sendUserEmailsVerificationInput.emailAddress', ErrorCode::EMAIL_ADDRESS_IN_USE->name);
    }

    public function testVerifyAdoptsWorkEmailFromAnotherUser()
    {
        $otherUser = User::factory()->create([
            'email' => 'other.user@example.org',
            'work_email' => 'work.duplicate@gc.ca',
        ]);

        $this->putVerificationToken('5679', 'work.duplicate@gc.ca');

        // stable verified_at timestamps
        Carbon::setTestNow('2000-01-01 00:00:00');

        $this->attemptVerify($this->regularUser, '5679')
            ->assertJsonMissingPath('errors')
            ->assertJsonPath('data.verifyUserEmails.workEmail', 'work.duplicate@gc.ca')
            ->assertJsonPath('data.verifyUserEmails.isWorkEmailVerified', true);

        // the other user's work email is moved to the backup
        $otherUser->refresh();
        $this->assertNull($otherUser->work_email);
        $this->assertSame('work.duplicate@gc.ca', $otherUser->work_email_backup);
        // their contact email is untouched
        $this->assertSame('other.user@example.org', $otherUser->email);
        $this->assertNull($otherUser->email_backup);

        $this->assertDatabaseHas('users', [
            'id' => $this->regularUser->id,
            'work_email' => 'work.duplicate@gc.ca',
            'work_email_verified_at' => '2000-01-01 00:00:00',
        ]);
    }

    public function testVerifyAdoptsWorkEmailCaseInsensitively()
    {
        $otherUser = User::factory()->create([
            'work_email' => 'Work.Duplicate@GC.ca',
        ]);

        $this->putVerificationToken('5680', 'work.duplicate@gc.ca');

        $this->attemptVerify($this->regularUser, '5680')
            ->assertJsonMissingPath('errors')
            ->assertJsonPath('data.verifyUserEmails.workEmail', 'work.duplicate@gc.ca');

        // the backup keeps the original casing
        $otherUser->refresh();
        $this->assertNull($otherUser->work_email);
        $this->assertSame('Work.Duplicate@GC.ca', $otherUser->work_email_backup);
    }

    public function testVerifyAdoptsWorkEmailFromSoftDeletedUser()
    {
        // trashed() skips the deleting hook, so the work email is still set
        $otherUser = User::factory()->trashed()->create([
            'work_email' => 'work.duplicate@gc.ca',
        ]);

        $this->putVerificationToken('5681', 'work.duplicate@gc.ca');

        $this->attemptVerify($this->regularUser, '5681')
            ->assertJsonMissingPath('errors')
            ->assertJsonPath('data.verifyUserEmails.workEmail', 'work.duplicate@gc.ca');

        $otherUser = User::withTrashed()->findOrFail($otherUser->id);
        $this->assertNull($otherUser->work_email);
        $this->assertSame('work.duplicate@gc.ca', $otherUser->work_email_backup);
    }

    public function testVerifyDoesNotTakeSimilarWorkEmail()
    {
        // "_" would match any single character in a LIKE pattern
        $otherUser = User::factory()->create([
            'work_email' => 'axb@gc.ca',
        ]);

        $this->putVerificationToken('5682', 'a_b@gc.ca');

        $this->attemptVerify($this->regularUser, '5682')
            ->assertJsonMissingPath('errors')
            ->assertJsonPath('data.verifyUserEmails.workEmail', 'a_b@gc.ca');

        $otherUser->refresh();
        $this->assertSame('axb@gc.ca', $otherUser->work_email);
        $this->assertNull($otherUser->work_email_backup);
    }

    public function testFailedVerifyDoesNotTakeWorkEmail()
    {
        $otherUser = User::factory()->create([
            'work_email' => 'work.duplicate@gc.ca',
        ]);

        $this->putVerificationToken('5683', 'work.duplicate@gc.ca');

        $this->attemptVerify($this->regularUser, 'BAD-CODE')
            ->assertGraphQLErrorMessage(ErrorCode::VERIFICATION_FAILED->name);

        $otherUser->refresh();
        $this->assertSame('work.duplicate@gc.ca', $otherUser->work_email);
        $this->assertNull($otherUser->work_email_backup);

        $this->assertDatabaseHas('users', [
            'id' => $this->regularUser->id,
            'work_email' => 'regular.user@gc.ca',
            'work_email_verified_at' => null,
        ]);
    }

    public function testCannotVerifyWithAnotherUsersContactEmail()
    {
        // contact emails are still protected, only work emails are adopted
        $otherUser = User::factory()->create([
            'email' => 'contact.duplicate@gc.ca',
        ]);

        $this->putVerificationToken('5684', 'CONTACT.DUPLICATE@GC.CA');

        $this->attemptVerify($this->regularUser, '5684')
            ->assertGraphQLValidationError('emailAddress', ErrorCode::EMAIL_ADDRESS_IN_USE->name);

        $otherUser->refresh();
        $this->assertSame('contact.duplicate@gc.ca', $otherUser->email);
        $this->assertNull($otherUser->email_backup);

        $this->assertDatabaseHas('users', [
            'id' => $this->regularUser->id,
            'work_email' => 'regular.user@gc.ca',
            'work_email_verified_at' => null,
        ]);
    }

    public function testVerifyIsRateLimitedAfterTooManyAttempts()
    {
        $this->putVerificationToken();
        $this->exhaustVerifyAttempts($this->regularUser);

        $this->attemptVerify($this->regularUser, 'BAD-CODE')
            ->assertGraphQLErrorMessage(ErrorCode::RATE_LIMIT->name);
    }

    public function testRateLimitedAttemptWithCorrectCodeDoesNotVerify()
    {
        $this->putVerificationToken('1234');
        $this->exhaustVerifyAttempts($this->regularUser);

        $this->attemptVerify($this->regularUser, '1234')
            ->assertGraphQLErrorMessage(ErrorCode::RATE_LIMIT->name);

        $this->assertDatabaseHas('users', [
            'id' => $this->regularUser->id,
            'work_email' => 'regular.user@gc.ca',
            'work_email_verified_at' => null,
        ]);
    }

    public function testRateLimitResponseIncludesRemainingSeconds()
    {
        $this->putVerificationToken();
        $this->exhaustVerifyAttempts($this->regularUser);

        $remainingSeconds = $this->attemptVerify($this->regularUser, 'BAD-CODE')
            ->json('errors.0.extensions.'.ClientSafeTooManyRequestsException::KEY.'.remaining_seconds');

        $this->assertIsInt($remainingSeconds);
        $this->assertGreaterThan(0, $remainingSeconds);
        $this->assertLessThanOrEqual(60, $remainingSeconds);
    }

    public function testRateLimitResetsAfterDecay()
    {
        $this->putVerificationToken('1234');
        $this->exhaustVerifyAttempts($this->regularUser);
        $this->attemptVerify($this->regularUser, '1234')
            ->assertGraphQLErrorMessage(ErrorCode::RATE_LIMIT->name);

        $this->travel(61)->seconds();

        $this->attemptVerify($this->regularUser, '1234')
            ->assertJsonMissingPath('errors')
            ->assertJsonPath('data.verifyUserEmails.workEmail', 'regular.user.2@gc.ca');
    }

    public function testRateLimitIsPerUser()
    {
        $this->putVerificationToken();
        $this->exhaustVerifyAttempts($this->regularUser);

        // admin has no token, so fails verification rather than being throttled
        $this->attemptVerify($this->adminUser, 'BAD-CODE')
            ->assertGraphQLErrorMessage(ErrorCode::VERIFICATION_FAILED->name);
    }

    public function testMissingTokenAttemptsCountTowardLimit()
    {
        // no token put in the cache
        $this->exhaustVerifyAttempts($this->regularUser);

        $this->attemptVerify($this->regularUser, 'BAD-CODE')
            ->assertGraphQLErrorMessage(ErrorCode::RATE_LIMIT->name);
    }
}

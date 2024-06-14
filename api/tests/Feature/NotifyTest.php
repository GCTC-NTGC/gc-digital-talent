<?php

namespace Tests\Feature;

use App\Facades\Notify;
use Tests\TestCase;

class NotifyTest extends TestCase
{
    private $templates;

    private $username;

    private $bulkName;

    protected function setUp(): void
    {
        parent::setUp();

        $this->username = 'Test Name';
        $this->bulkName = 'Bulk Test';
        $this->templates = config('notify.templates');

        $apiKey = config('notify.client.apiKey');
        if (! $apiKey) {
            $this->markTestSkipped('API key not found');
        }
    }

    /**
     * Check key exists
     */
    private function checkKey(string $key, string $skipMessage): void
    {
        $value = config($key);
        if (! $value) {
            $this->markTestSkipped($skipMessage);
        }
    }

    /**
     * Test sending an Email
     *
     * @return void
     */
    public function testEmail()
    {
        $this->checkKey('notify.templates.test_email', 'Email template ID not found.');

        $response = Notify::sendEmail(
            config('notify.smokeTest.emailAddress'),
            $this->templates['test_email'],
            ['name' => $this->username]
        );

        $this->assertSingleResponseSuccess($response);
    }

    /**
     * Test sending an SMS
     *
     * @return void
     */
    public function testSms()
    {
        $this->checkKey('notify.templates.test_sms', 'SMS template ID not found.');

        $response = Notify::sendSms(
            config('notify.smokeTest.phoneNumber'),
            $this->templates['test_sms'],
            ['name' => $this->username]
        );

        $this->assertSingleResponseSuccess($response);
    }

    /**
     * Test sending Bulk Email
     *
     * @return void
     */
    public function testBulkSms()
    {
        $this->markTestSkipped('Prevent hitting the server.');

        $this->checkKey('notify.templates.test_sms', 'SMS template ID not found.');

        $response = Notify::sendBulkSms(
            $this->bulkName,
            [
                [
                    'phone_number' => config('notify.smokeTest.phoneNumber'),
                    'personalisation' => [
                        'name' => $this->username.' 1',
                    ],
                ],
                [
                    'phone_number' => config('notify.smokeTest.phoneNumber2'),
                    'personalisation' => [
                        'name' => $this->username.' 2',
                    ],
                ],
                [
                    'phone_number' => config('notify.smokeTest.phoneNumber3'),
                    'personalisation' => [
                        'name' => $this->username.' 3',
                    ],
                ],

            ],
            $this->templates['test_sms']
        );

        $this->assertBulkResponseSuccess($response);
    }

    /**
     * Test sending Bulk Email
     *
     * @return void
     */
    public function testBulkEmail()
    {
        $this->markTestSkipped('Bulk send doesn\'t work with team API keys.');

        $this->checkKey('notify.templates.test_email', 'Email template ID not found.');

        $response = Notify::sendBulkEmail(
            $this->bulkName,
            [
                [
                    'email' => config('notify.smokeTest.emailAddress'),
                    'personalisation' => [
                        'name' => $this->username.' 1',
                    ],
                ],
                [
                    'email' => config('notify.smokeTest.emailAddress2'),
                    'personalisation' => [
                        'name' => $this->username.' 2',
                    ],
                ],
                [
                    'email' => config('notify.smokeTest.emailAddress3'),
                    'personalisation' => [
                        'name' => $this->username.' 3',
                    ],
                ],

            ],
            $this->templates['test_email']
        );

        $this->assertBulkResponseSuccess($response);
    }

    /**
     * Make some general assertions
     */
    private function assertSingleResponseSuccess($response)
    {
        $json = $response->json();

        $this->assertTrue($response->successful());
        $this->assertEquals(201, $response->status());
        $this->assertArrayHasKey('id', $json);
        $this->assertStringContainsStringIgnoringCase($this->username, $json['content']['body']);
    }

    /**
     * Make some general assertions
     */
    private function assertBulkResponseSuccess($response)
    {
        $json = $response->json('data');

        $this->assertTrue($response->successful());
        $this->assertEquals(201, $response->status());
        $this->assertArrayHasKey('id', $json);
        $this->assertStringContainsStringIgnoringCase($this->bulkName, $json['original_file_name']);
        $this->assertEquals(3, $json['notification_count']);
    }
}

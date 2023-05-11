<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Facades\Notify;
use Illuminate\Support\Facades\Http;

class NotifyTest extends TestCase
{
    private $templates;
    private $username;
    private $bulkName;

    protected function setUp(): void
    {
        parent::setUp();

        $this->username = "Test Name";
        $this->bulkName = "Bulk Test";
        $this->templates = config('notify.templates');

        $apiKey = config('notify.client.apiKey');
        if (!$apiKey) {
            $this->markTestSkipped("API key not found");
        }
    }

    /**
     * Test sending an Email
     *
     * @return void
     */
    public function test_email()
    {
        $response = Notify::sendEmail(
            'simulate-delivered@notification.canada.ca',
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
    public function test_sms()
    {
        $response = Notify::sendSms(
            '+16132532222',
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
    public function test_bulk_sms()
    {
        $this->markTestSkipped("Prevent hitting the server.");

        $response = Notify::sendBulkSms(
            $this->bulkName,
            [
                [
                    'phone_number' => '+16132532222',
                    'personalisation' => [
                        'name' => $this->username . ' 1'
                    ],
                ],
                [
                    'phone_number' => '+16132532223',
                    'personalisation' => [
                        'name' => $this->username . ' 2'
                    ],
                ],
                [
                    'phone_number' => '+16132532224',
                    'personalisation' => [
                        'name' => $this->username . ' 3'
                    ],
                ],

            ],
            $this->templates['test_bulk_sms']
        );

        $this->assertBulkResponseSuccess($response);
    }
    /**
     * Test sending Bulk Email
     *
     * @return void
     */
    public function test_bulk_email()
    {
        $this->markTestSkipped("Prevent hitting the server.");

        $response = Notify::sendBulkEmail(
            $this->bulkName,
            [
                [
                    'email' => 'simulate-delivered@notification.canada.ca',
                    'personalisation' => [
                        'name' => $this->username . ' 1'
                    ],
                ],
                [
                    'email' => 'simulate-delivered-2@notification.canada.ca',
                    'personalisation' => [
                        'name' => $this->username . ' 2'
                    ],
                ],
                [
                    'email' => 'simulate-delivered-3@notification.canada.ca',
                    'personalisation' => [
                        'name' => $this->username . ' 3'
                    ],
                ],

            ],
            $this->templates['test_bulk_email']
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

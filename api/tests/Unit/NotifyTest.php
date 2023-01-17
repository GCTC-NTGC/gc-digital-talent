<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Facades\Notify;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

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
            $this->templates['email'],
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
            $this->templates['sms'],
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
        $response = Notify::sendBulk(
            $this->bulkName,
            [
                ['phone number', 'name'],
                ['+16132532222', $this->username . ' 1'],
                ['+16132532223', $this->username . ' 2'],
                ['+16132532224', $this->username . ' 3'],
            ],
            $this->templates['bulk_sms']
        );

        Log::debug($response->json());

       $this->assertBulkResponseSuccess($response);
    }
    /**
     * Test sending Bulk Email
     *
     * @return void
     */
    public function test_bulk_email()
    {
        $response = Notify::sendBulk(
            $this->bulkName,
            [
                ['email address', 'name'],
                ['simulate-delivered@notification.canada.ca', $this->username . ' 1'],
                ['simulate-delivered-2@notification.canada.ca', $this->username . ' 2'],
                ['simulate-delivered-3@notification.canada.ca', $this->username . ' 3'],
            ],
            $this->templates['bulk_email']
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

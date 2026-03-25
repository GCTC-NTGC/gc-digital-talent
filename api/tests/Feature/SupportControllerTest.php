<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class SupportControllerTest extends TestCase
{
    #[DataProvider('supportTicketDataProvider')]
    public function testCreateTicketSanitization(array $input, array $expectedTicketBody, array $cookies = [])
    {
        // Mock the request to avoid hitting the real API
        Config::set('freshdesk.api.endpoint', 'https://test.freshdesk.com/api/v2');
        Config::set('freshdesk.api.key', 'test-key');
        Http::fake([
            '*/contacts?email=*' => Http::response([], 200),
            '*/contacts' => Http::response(['id' => 456], 201),
            '*/tickets' => Http::response(['id' => 123], 201),
        ]);

        $response = $this->withHeaders(['Accept-Language' => 'en'])
            ->withCookies($cookies)
            ->postJson('/api/support/tickets', $input);

        $response->assertStatus(200);

        Http::assertSent(function ($request) use ($expectedTicketBody) {
            if ($request->method() !== 'POST' || ! str_contains($request->url(), '/tickets')) {
                return true;
            }

            $actualBody = $request->data();

            $this->assertEquals($expectedTicketBody['name'], $actualBody['name'], 'Name mismatch');
            $this->assertEquals($expectedTicketBody['email'], $actualBody['email'], 'Email mismatch');
            $this->assertEquals($expectedTicketBody['description'], $actualBody['description'], 'Description mismatch');

            if (isset($expectedTicketBody['custom_fields'])) {
                $this->assertEquals($expectedTicketBody['custom_fields'], $actualBody['custom_fields'], 'Custom fields mismatch');
            }

            return true;
        });
    }

    public static function supportTicketDataProvider(): array
    {
        return [
            'sanitizes_html_and_trims' => [
                'input' => [
                    'name' => '  <b>John Doe</b>  ',
                    'email' => ' testing@domain.com ',
                    'subject' => 'bug',
                    'description' => '<script>alert("xss")</script>I have a bug.',
                ],
                'expectedTicketBody' => [
                    'name' => 'John Doe',
                    'email' => 'testing@domain.com',
                    'description' => 'I have a bug.',
                ],
                'cookies' => [],
            ],
            'handles_user_id_and_agent' => [
                'input' => [
                    'name' => 'Jane Smith',
                    'email' => 'jane@example.com',
                    'subject' => 'question',
                    'description' => 'Just a question.',
                ],
                'expectedTicketBody' => [
                    'name' => 'Jane Smith',
                    'email' => 'jane@example.com',
                    'description' => 'Just a question.',
                ],
                'cookies' => [],
            ],
        ];
    }
}

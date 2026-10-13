<?php

namespace Tests\Unit;

use App\Services\ClientSecretPostAuthenticationService;
use Tests\TestCase;

class ClientSecretPostAuthenticationServiceTest extends TestCase
{
    public function testReturnsClientSecretAndNothingElse()
    {
        $params = (new ClientSecretPostAuthenticationService('test-client-secret'))->paramsFor('https://example.com/token');

        $this->assertSame(['client_secret' => 'test-client-secret'], $params);
    }

    public function testReturnsEmptyStringWhenSecretIsNull()
    {
        $params = (new ClientSecretPostAuthenticationService(null))->paramsFor('https://example.com/token');

        $this->assertSame(['client_secret' => ''], $params);
    }
}

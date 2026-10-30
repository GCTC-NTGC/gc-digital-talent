<?php

namespace Tests\Feature;

use App\Contracts\BearerTokenService;
use App\Services\DummyBearerTokenService;
use Tests\TestCase;

class DummyAuthDisabledTest extends TestCase
{
    public function testDummyRoutesDoNotExistWithOpenid()
    {
        $this->assertSame('openid', config('auth.login_provider'));

        $this->postJson('/api/dummy-auth/token', ['sub' => 'a-sub'])->assertNotFound();
        $this->get('/api/dummy-auth/logout')->assertNotFound();
        // the OpenID provider rejects a dummy form post because there's no login session
        $this->post('/auth-callback', ['sub' => 'a-sub'])->assertRedirectContains('logout_reason=invalid-session');
    }

    public function testDummyTokensAreNotAccepted()
    {
        $this->assertNotInstanceOf(DummyBearerTokenService::class, $this->app->make(BearerTokenService::class));
    }
}

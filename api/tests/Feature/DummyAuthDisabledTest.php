<?php

namespace Tests\Feature;

use App\Contracts\BearerTokenService;
use App\Services\DummyBearerTokenService;
use Tests\TestCase;

class DummyAuthDisabledTest extends TestCase
{
    public function testDummyRoutesDoNotExistWithCanadaLogin()
    {
        $this->assertSame('canadalogin', config('auth.login_provider'));

        $this->postJson('/api/dummy-auth/token', ['sub' => 'a-sub'])->assertNotFound();
        $this->get('/api/dummy-auth/logout')->assertNotFound();
        $this->post('/login', ['sub' => 'a-sub'])->assertStatus(405);
    }

    public function testDummyTokensAreNotAccepted()
    {
        $this->assertNotInstanceOf(DummyBearerTokenService::class, $this->app->make(BearerTokenService::class));
    }
}

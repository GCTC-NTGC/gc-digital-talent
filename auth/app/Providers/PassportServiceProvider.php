<?php

namespace App\Providers;

use App\Passport\AccessTokenRepository;
use Laravel\Passport\Bridge\ClientRepository;
use Laravel\Passport\Bridge\ScopeRepository;
use League\OAuth2\Server\AuthorizationServer;

class PassportServiceProvider extends \Laravel\Passport\PassportServiceProvider {

	public function makeAuthorizationServer() {

		return new AuthorizationServer(
			$this->app->make( ClientRepository::class ),
			$this->app->make( AccessTokenRepository::class ),
			$this->app->make( ScopeRepository::class ),
			$this->makeCryptKey( 'private' ),
			app( 'encrypter' )->getKey()
		);
	}

}

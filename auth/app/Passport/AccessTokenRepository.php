<?php

namespace App\Passport;

use App\Passport\AccessToken;
use Laravel\Passport\Bridge\AccessTokenRepository as BaseRepository;
use League\OAuth2\Server\Entities\ClientEntityInterface;

class AccessTokenRepository extends BaseRepository {

	public function getNewToken( ClientEntityInterface $clientEntity, array $scopes, $userIdentifier = null ) {
		return new AccessToken( $userIdentifier, $scopes, $clientEntity );
	}
}

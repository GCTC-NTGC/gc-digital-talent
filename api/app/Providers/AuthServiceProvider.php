<?php

namespace App\Providers;

use DateTimeZone;
use App\Models\User;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Log;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\JWT\UnencryptedToken;
use Lcobucci\JWT\Validation\Constraint\IssuedBy;
use Lcobucci\JWT\Validation\Constraint\RelatedTo;
use Lcobucci\JWT\Validation\Constraint\LooseValidAt;
use Lcobucci\JWT\Validation\Constraint\SignedWith;
use Lcobucci\Clock\SystemClock;
use Lcobucci\JWT\Validation\RequiredConstraintsViolated;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Boot the authentication services for the application.
     *
     * @return void
     */
    public function boot()
    {
        // Here you may define how you wish users to be authenticated for your Lumen
        // application. The callback which receives the incoming request instance
        // should return either a User instance or null. You're free to obtain
        // the User instance via an API token or any other method necessary.

        $this->app['auth']->viaRequest('api', function ($request) {
            if ($request->input('api_token')) {
                return User::where('api_token', $request->input('api_token'))->first();
            }
            if ($request->bearerToken()) {
                $bearerToken = $request->bearerToken(); // 1. extract JWT access token from request.
                $config = Configuration::forAsymmetricSigner(
                    new Signer\Rsa\Sha256(),
                    InMemory::empty(), // Private key is only used for generating tokens, which is not being done here, therefore empty is used.
                    InMemory::plainText(env('AUTH_SERVER_PUBLIC_KEY')),
                );
                $clock = new SystemClock(new DateTimeZone(config('app.timezone')));
                $token = $config->parser()->parse($bearerToken);
                assert($token instanceof UnencryptedToken);
                $config->setValidationConstraints(
                    new IssuedBy(env('AUTH_SERVER_ISS')),
                    new RelatedTo($token->claims()->get('sub')),
                    new LooseValidAt($clock),
                    new SignedWith($config->signer(), $config->verificationKey()),
                );
                $constraints = $config->validationConstraints();

                try { // 2. validate access token.
                    $config->validator()->assert($token, ...$constraints);
                } catch (RequiredConstraintsViolated $e) {
                    Log::notice($e->violations());
                    return abort(401, 'Authorization token not valid.');
                }

                $userMatch = User::where('id', $token->claims()->get('sub'))->first(); // 3. match "sub" claim to user id.
                if($userMatch) {
                    return $userMatch;
                } else {
                    return null;
                }
            }
        });
    }
}

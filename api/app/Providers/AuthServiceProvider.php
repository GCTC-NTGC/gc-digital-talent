<?php

namespace App\Providers;

use DateTimeZone;

use App\Models\Classification;
use App\Models\CmoAsset;
use App\Models\Department;
use App\Models\OperationalRequirement;
use App\Models\PoolCandidate;
use App\Models\Pool;
use App\Models\User;

use App\Policies\ClassificationPolicy;
use App\Policies\CmoAssetPolicy;
use App\Policies\DepartmentPolicy;
use App\Policies\OperationalRequirementPolicy;
use App\Policies\PoolCandidatePolicy;
use App\Policies\PoolPolicy;
use App\Policies\UserPolicy;
use App\Services\Contracts\AuthClientInterface;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Log;
use Lcobucci\JWT\Configuration;
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
    public function boot(AuthClientInterface $authClient)
    {
        // Here you may define how you wish users to be authenticated for your Lumen
        // application. The callback which receives the incoming request instance
        // should return either a User instance or null. You're free to obtain
        // the User instance via an API token or any other method necessary.

        Gate::policy(Classification::class, ClassificationPolicy::class);
        Gate::policy(CmoAsset::class, CmoAssetPolicy::class);
        Gate::policy(Department::class, DepartmentPolicy::class);
        Gate::policy(OperationalRequirement::class, OperationalRequirementPolicy::class);
        Gate::policy(PoolCandidate::class, PoolCandidatePolicy::class);
        Gate::policy(Pool::class, PoolPolicy::class);
        Gate::policy(User::class, UserPolicy::class);

        $this->app['auth']->viaRequest('api', function ($request) use ($authClient) {
            if ($request->input('api_token')) {
                return User::where('api_token', $request->input('api_token'))->first();
            }
            if ($request->bearerToken()) {
                $bearerToken = $request->bearerToken(); // 1. extract JWT access token from request.

                $unsecuredConfig = Configuration::forUnsecuredSigner(); // need a config to parse the token and get the key id
                $unsecuredToken = $unsecuredConfig->parser()->parse($bearerToken);

                $keyId = strval($unsecuredToken->headers()->get('kid'));
                $config = $authClient->getConfiguration($keyId);

                $clock = new SystemClock(new DateTimeZone(config('app.timezone')));
                $token = $config->parser()->parse($bearerToken);

                assert($token instanceof UnencryptedToken);
                $config->setValidationConstraints(
                    new IssuedBy($authClient->getIssuer()),
                    new RelatedTo($token->claims()->get('sub')),
                    new LooseValidAt($clock),
                    new SignedWith($config->signer(), $config->verificationKey()),
                );
                $constraints = $config->validationConstraints();

                try { // 2. validate access token.
                    $config->validator()->assert($token, ...$constraints);
                } catch (RequiredConstraintsViolated $e) {
                    $violations = [];
                    foreach ($e->violations() as $violationError) {
                        array_push($violations, $violationError->getMessage());
                    }
                    Log::notice('Authorization token not valid: ', $violations);
                    return abort(401, 'Authorization token not valid.');
                }

                $userMatch = User::where('sub', $token->claims()->get('sub'))->first(); // 3. match "sub" claim to user 'sub' field.
                if($userMatch) {
                    return $userMatch;
                } else {
                    return null;
                }
            }
        });
    }
}

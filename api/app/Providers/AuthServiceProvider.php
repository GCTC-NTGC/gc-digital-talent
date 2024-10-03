<?php

namespace App\Providers;

use App\Exceptions\AuthenticationException;
use App\Models\AwardExperience;
use App\Models\Classification;
use App\Models\CommunityExperience;
use App\Models\Department;
use App\Models\EducationExperience;
use App\Models\PersonalExperience;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Role;
use App\Models\User;
use App\Models\WorkExperience;
use App\Policies\ClassificationPolicy;
use App\Policies\DepartmentPolicy;
use App\Policies\ExperiencePolicy;
use App\Policies\PoolCandidatePolicy;
use App\Policies\PoolPolicy;
use App\Policies\UserPolicy;
use App\Services\OpenIdBearerTokenService;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Lcobucci\JWT\Validation\RequiredConstraintsViolated;
use Throwable;

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
    public function boot(OpenIdBearerTokenService $tokenService)
    {
        // Here you may define how you wish users to be authenticated for your Laravel
        // application. The callback which receives the incoming request instance
        // should return either a User instance or null. You're free to obtain
        // the User instance via an API token or any other method necessary.

        Gate::policy(Classification::class, ClassificationPolicy::class);
        Gate::policy(Department::class, DepartmentPolicy::class);
        Gate::policy(PoolCandidate::class, PoolCandidatePolicy::class);
        Gate::policy(Pool::class, PoolPolicy::class);
        Gate::policy(User::class, UserPolicy::class);
        Gate::policy(WorkExperience::class, ExperiencePolicy::class);
        Gate::policy(CommunityExperience::class, ExperiencePolicy::class);
        Gate::policy(PersonalExperience::class, ExperiencePolicy::class);
        Gate::policy(EducationExperience::class, ExperiencePolicy::class);
        Gate::policy(AwardExperience::class, ExperiencePolicy::class);

        $this->app['auth']->viaRequest('api', function ($request) use ($tokenService) {
            $user = null;
            $errorPool = app(\Nuwave\Lighthouse\Execution\ErrorPool::class);
            try {
                $user = $this->resolveUserOrAbort($request->bearerToken(), $tokenService);
            } catch (Throwable $e) {
                $errorPool->record($e);
            }

            return $user;
        });
    }

    /**
     * Get the associated user model for a request or abort if something goes wrong with the lookup
     */
    public function resolveUserOrAbort($bearerToken, $tokenService): ?User
    {
        if ($bearerToken) {
            try {
                $claims = $tokenService->validateAndGetClaims($bearerToken);  // 2. validate access token.
                $sub = $claims->get('sub');
            } catch (RequiredConstraintsViolated $e) {
                $violations = [];
                foreach ($e->violations() as $violationError) {
                    array_push($violations, $violationError->getMessage());
                }
                throw new AuthenticationException('Authorization token not valid: '.implode(',', $violations), 'invalid_token');
            } catch (Throwable $e) {
                throw new AuthenticationException('Error while validating authorization token: '.$e->getMessage(), 'token_validation');
            }

            // By this point we have verified that the token is legitimate
            $userMatch = User::where('sub', $sub)->withTrashed()->first();

            if ($userMatch) {
                if ($userMatch->deleted_at != null) {
                    throw new AuthenticationException('Login as deleted user: '.$userMatch->sub, 'user_deleted');
                }

                return $userMatch;
            } else {
                // No user found for given subscriber - lets auto-register them
                $newUser = new User;
                $newUser->sub = $sub;
                $newUser->save();
                $newUser->syncRoles([  // every new user is automatically an base_user and an applicant
                    Role::where('name', 'base_user')->sole(),
                    Role::where('name', 'applicant')->sole(),
                ], null);

                return $newUser;
            }
        }

        // If a default user is set, and there is no bearer token, treat the request as if it were from the default user.
        if (config('oauth.default_user')) {
            $user = User::where('sub', config('oauth.default_user'))->first();
            if ($user) {
                return $user;
            }
        }

        return null;
    }
}

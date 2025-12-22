<?php

namespace App\GraphQL\Mutations;

use App\GraphQL\Validators\Mutation\SubmitApplicationValidator;
use App\Models\PoolCandidate;
use App\Notifications\ApplicationReceived;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Nuwave\Lighthouse\Exceptions\ValidationException;

final class SubmitApplication
{
    /**
     * Submit an application
     */
    public function __invoke($_, array $args)
    {
        // grab the specific application
        // submit to validator the PoolCandidate model
        $application = PoolCandidate::find($args['id'])->load('user');
        $submitValidator = new SubmitApplicationValidator($application);
        // We haven't saved the signature yet, so manually add it to the array
        $application['signature'] = $args['signature'];
        $validator = Validator::make($application->toArray(), $submitValidator->rules(), $submitValidator->messages());
        if ($validator->fails()) {
            throw new ValidationException($validator->errors()->first(), $validator);
        }

        // all validation has successfully completed above, execute the core function of this resolver
        // add signature and submission, as well as update the set expiry date and status, update([]) not used due to not working correctly
        $application->submit($args['signature']);

        $application->refresh();

        // Send email notification
        try {
            $message = new ApplicationReceived(
                $application->user->email, // applicants email
                $application->user->getFullName(), // applicants name
                $application->pool->name['en'], // pool title
                $application->pool->name['fr'], // pool title
                $application->id, // application ID number
                $application->user->preferredLocale(), // applicants preferred language
            );
            $application->notify($message);

        } catch (\Throwable $e) {
            Log::error('Problem sending application received email '.$e);
        }

        return $application;
    }
}

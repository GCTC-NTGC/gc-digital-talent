<?php

namespace App\GraphQL\Mutations;

use App\Events\ApplicationSubmitted;
use App\Models\PoolCandidate;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Nuwave\Lighthouse\Exceptions\ValidationException;
use App\GraphQL\Validators\Mutation\SubmitApplicationValidator;
use Database\Helpers\ApiEnums;

final class SubmitApplication
{
    /**
     * Submit an application
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        // grab the specific application
        // submit to validator the PoolCandidate model
        $application = PoolCandidate::find($args['id']);
        $submitValidator = new SubmitApplicationValidator($application);
        // Add values from the mutation to the application before validation/saving
        // TODO - decide on a default expiry date, placeholder of year past submission
        $dateNow = Carbon::now();
        $expiryDate = Carbon::now()->addYear();
        $application->submitted_at = $dateNow;
        $application->pool_candidate_status = ApiEnums::CANDIDATE_STATUS_NEW_APPLICATION;
        $application->expiry_date = $expiryDate;
        $application->signature = $args['signature'];

        $validator = Validator::make($application->toArray(), $submitValidator->rules(), $submitValidator->messages());
        if ($validator->fails()) {
            throw new ValidationException($validator->errors()->first(), $validator);
        }

        // all validation has successfully completed above, execute the core function of this resolver
        // update([]) not used due to not working correctly
        $success = $application->save();
        ApplicationSubmitted::dispatchIf($success, $application);

        return $application;
    }
}

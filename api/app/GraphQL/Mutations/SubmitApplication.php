<?php

namespace App\GraphQL\Mutations;

use App\Enums\ApplicationStep;
use App\Enums\ArmedForcesStatus;
use App\Enums\ClaimVerificationResult;
use App\Enums\PoolCandidateStatus;
use App\GraphQL\Validators\Mutation\SubmitApplicationValidator;
use App\Models\PoolCandidate;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Nuwave\Lighthouse\Exceptions\ValidationException;

final class SubmitApplication
{
    /**
     * Submit an application
     *
     * @param  array{}  $args
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
        $dateNow = Carbon::now();
        $application->submitted_at = $dateNow;
        $application->pool_candidate_status = PoolCandidateStatus::NEW_APPLICATION->name;
        $application->setInsertSubmittedStepAttribute(ApplicationStep::REVIEW_AND_SUBMIT->name);

        // claim verification
        if ($application->user->armed_forces_status == ArmedForcesStatus::VETERAN->name) {
            $application->veteran_verification = ClaimVerificationResult::UNVERIFIED->name;
        }
        if ($application->user->has_priority_entitlement) {
            $application->priority_verification = ClaimVerificationResult::UNVERIFIED->name;
        }

        $finalDecision = $application->computeFinalDecision();
        $application->computed_final_decision = $finalDecision['decision'];
        $application->computed_final_decision_weight = $finalDecision['weight'];

        // need to save application before setting application snapshot since fields have yet to be saved to the database.
        $application->save();

        $application->setApplicationSnapshot();

        $application->refresh();

        return $application;
    }
}

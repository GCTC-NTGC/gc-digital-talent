<?php

namespace App\GraphQL\Mutations;

use App\Enums\ApplicationStep;
use App\Enums\ArmedForcesStatus;
use App\Enums\ClaimVerificationResult;
use App\Enums\PoolCandidateStatus;
use App\GraphQL\Validators\Mutation\SubmitApplicationValidator;
use App\Models\PoolCandidate;
use App\Notifications\ApplicationReceived;
use Carbon\Carbon;
use GraphQL\Error\Error;
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

        // need to save application before setting application snapshot since fields have yet to be saved to the database.
        $application->save();

        $application->setApplicationSnapshot(false);

        [$stepId, $assessmentStatus] = $application->computeAssessmentStatus();

        $application->computed_assessment_status = $assessmentStatus;
        $application->assessment_step_id = $stepId;

        $application->save();

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

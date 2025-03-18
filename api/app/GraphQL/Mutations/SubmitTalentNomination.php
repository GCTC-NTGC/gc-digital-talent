<?php

namespace App\GraphQL\Mutations;

use App\Enums\TalentNominationStep;
use App\GraphQL\Validators\Mutation\SubmitTalentNominationValidator;
use App\Models\TalentNomination;
use App\Models\TalentNominationGroup;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Nuwave\Lighthouse\Exceptions\ValidationException;

final class SubmitTalentNomination
{
    /**
     * Submit an application
     */
    public function __invoke($_, array $args)
    {
        $nomination = TalentNomination::find($args['id'])
            ->load('developmentPrograms')
            ->load('skills');
        $submitValidator = new SubmitTalentNominationValidator($nomination);
        $validator = Validator::make($nomination->toArray(), $submitValidator->rules(), $submitValidator->messages());
        if ($validator->fails()) {
            throw new ValidationException($validator->errors()->first(), $validator);
        }

        // create or update the TalentNominationGroup that this will be attached to
        $talentNominationGroup = TalentNominationGroup::firstOrCreate([
            'nominee_id' => $nomination->nominee_id,
            'talent_nomination_event_id' => $nomination->talent_nomination_event_id,
        ]);

        // all validation has successfully completed above, execute the core function of this resolver
        $nomination->submitted_at = Carbon::now();
        $nomination->setInsertSubmittedStepAttribute(TalentNominationStep::REVIEW_AND_SUBMIT->name);
        $nomination->talent_nomination_group_id = $talentNominationGroup->id;

        $nomination->save();
        $nomination->refresh();

        return $nomination;
    }
}

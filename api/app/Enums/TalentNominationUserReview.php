<?php

namespace App\Enums;

use App\Traits\HasLocalization;
use GraphQL\Type\Definition\Description;

// How does the information on a talent nomination user look?
enum TalentNominationUserReview
{
    use HasLocalization;

    #[Description(description: 'The information provided is correct')]
    case CORRECT;
    #[Description(description: 'The information provided is incorrect or out of date')]
    case INCORRECT_OUT_OF_DATE;
    #[Description(description: 'The information refers to the wrong person')]
    case WRONG_PERSON;

    public static function getLangFilename(): string
    {
        return 'talent_nomination_user_review';
    }
}

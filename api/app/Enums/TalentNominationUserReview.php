<?php

namespace App\Enums;

use App\Traits\HasLocalization;
use GraphQL\Type\Definition\Description;

// How does the information on a talent nomination user look?
enum TalentNominationUserReview
{
    use HasLocalization;

    #[Description(description: 'The user information looks correct.')]
    case CORRECT;
    #[Description(description: 'The user information looks incorrect or refers to the wrong person.')]
    case INCORRECT;
    #[Description(description: 'The user information is out of date.')]
    case OUT_OF_DATE;

    public static function getLangFilename(): string
    {
        return 'talent_nomination_user_review';
    }
}

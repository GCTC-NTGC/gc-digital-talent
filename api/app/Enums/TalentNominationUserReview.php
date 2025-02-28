<?php

namespace App\Enums;

use GraphQL\Type\Definition\Description;

// How does the information on a talent nomination user look?
enum TalentNominationUserReview
{
    #[Description(description: 'The user information looks correct.')]
    case CORRECT;
    #[Description(description: 'The user information looks incorrect or refers to the wrong person.')]
    case INCORRECT;
    #[Description(description: 'The user information is out of date.')]
    case OUT_OF_DATE;
}

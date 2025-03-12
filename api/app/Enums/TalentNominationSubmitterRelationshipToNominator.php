<?php

namespace App\Enums;

use App\Traits\HasLocalization;
use GraphQL\Type\Definition\Description;

// What relationship does the submitter have to the nominator?
enum TalentNominationSubmitterRelationshipToNominator
{
    use HasLocalization;

    #[Description(description: 'Submitter is an administrative support staff for the nominator.')]
    case SUPPORT_STAFF;
    #[Description(description: 'Submitter is an employee or subordinate of the nominator.')]
    case EMPLOYEE;
    #[Description(description: 'Submitter has some other relationship to the nominator.')]
    case OTHER;

    public static function getLangFilename(): string
    {
        return 'talent_nomination_submitter_relationship_to_nominator';
    }
}

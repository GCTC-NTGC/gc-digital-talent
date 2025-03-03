<?php

namespace App\Enums;

use GraphQL\Type\Definition\Description;

// What relationship does the submitter have to the nominator?
enum TalentNominationSubmitterRelationshipToNominator
{
    #[Description(description: 'Submitter is an administrative support staff for the nominator.')]
    case SUPPORT_STAFF;
    #[Description(description: 'Submitter is an employee or subordinate of the nominator.')]
    case EMPLOYEE;
    #[Description(description: 'Submitter has some other relationship to the nominator.')]
    case OTHER;
}

<?php

namespace App\Enums;

use GraphQL\Type\Definition\Description;

// What relationship does the nominee have to the nominator?
enum TalentNominationNomineeRelationshipToNominator
{
    #[Description(description: 'Nominee is a current employee of the nominator.')]
    case CURRENT_EMPLOYEE;
    #[Description(description: 'Nominee is a former employee of the nominator.')]
    case FORMER_EMPLOYEE;
    #[Description(description: 'Nominee is an employee in another work than the nominator.')]
    case ANOTHER_WORK_EMPLOYEE;
    #[Description(description: 'Nominee is a mentee of the nominator.')]
    case MENTEE;
    #[Description(description: 'Nominee some other relationship to the nominator.')]
    case OTHER;
}

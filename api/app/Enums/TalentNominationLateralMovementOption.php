<?php

namespace App\Enums;

use GraphQL\Type\Definition\Description;

// What options are available for lateral movement?
enum TalentNominationLateralMovementOption
{
    #[Description(description: 'A small department or agency')]
    case SMALL_DEPARTMENT;
    #[Description(description: 'A large department or agency')]
    case LARGE_DEPARTMENT;
    #[Description(description: 'A central department or agency')]
    case CENTRAL_DEPARTMENT;
    #[Description(description: 'Any other department or agency, regardless of size or type')]
    case NEW_DEPARTMENT;
    #[Description(description: 'A program within another department or agency')]
    case PROGRAM_EXPERIENCE;
    #[Description(description: 'Another policy domain')]
    case POLICY_EXPERIENCE;
    case OTHER;
}

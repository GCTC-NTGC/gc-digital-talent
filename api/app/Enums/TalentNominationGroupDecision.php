<?php

namespace App\Enums;

// A decision that a nomination evaluator can make regarding a specific nomination option
enum TalentNominationGroupDecision
{
    case APPROVED;
    case REJECTED;
}

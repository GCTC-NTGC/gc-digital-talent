<?php

namespace App\Enums;

// How does the information on a talent nomination user look?
enum TalentNominationGroupStatus
{
    case IN_PROGRESS;
    case APPROVED;
    case PARTIALLY_APPROVED;
    case REJECTED;
}

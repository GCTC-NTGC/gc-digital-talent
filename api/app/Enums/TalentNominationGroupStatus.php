<?php

namespace App\Enums;

use App\Traits\HasLocalization;
use GraphQL\Type\Definition\Description;

// The overall status of a nomination group, based on the decisions made by the evaluators
enum TalentNominationGroupStatus
{
    use HasLocalization;

    #[Description(description: 'Decisions are still being made')]
    case IN_PROGRESS;
    #[Description(description: 'The nomination group has been approved')]
    case APPROVED;
    #[Description(description: 'The nomination group has some types approved and some types rejected')]
    case PARTIALLY_APPROVED;
    #[Description(description: 'The nomination group has been rejected')]
    case REJECTED;

    public static function getLangFilename(): string
    {
        return 'talent_nomination_group_status';
    }
}

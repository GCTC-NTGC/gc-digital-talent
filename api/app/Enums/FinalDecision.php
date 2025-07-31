<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum FinalDecision
{
    use HasLocalization;

    case DISQUALIFIED;
    case DISQUALIFIED_PENDING;
    case DISQUALIFIED_REMOVED;

    case QUALIFIED;
    case QUALIFIED_EXPIRED;
    case QUALIFIED_PENDING;
    case QUALIFIED_PLACED;
    case QUALIFIED_REMOVED;

    case REMOVED;

    case TO_ASSESS;
    case TO_ASSESS_REMOVED;

    // for use in computing qualified recruitment candidacies
    // FinalDecision::QUALIFIED_PENDING intentionally omitted
    public static function applicableToQualifiedRecruitment(): array
    {
        return [
            FinalDecision::QUALIFIED->name,
            FinalDecision::QUALIFIED_EXPIRED->name,
            FinalDecision::QUALIFIED_PLACED->name,
            FinalDecision::QUALIFIED_REMOVED->name,
        ];
    }

    public static function getLangFilename(): string
    {
        return 'final_decision';
    }
}

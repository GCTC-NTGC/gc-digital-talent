<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum PoolCandidateStatus
{
    use HasLocalization;

    case DRAFT;
    case DRAFT_EXPIRED;
    case NEW_APPLICATION;
    case APPLICATION_REVIEW;
    case SCREENED_IN;
    case SCREENED_OUT_APPLICATION;
    case SCREENED_OUT_NOT_INTERESTED;
    case SCREENED_OUT_NOT_RESPONSIVE;
    case UNDER_ASSESSMENT;
    case SCREENED_OUT_ASSESSMENT;
    case QUALIFIED_AVAILABLE;
    case QUALIFIED_UNAVAILABLE;
    case QUALIFIED_WITHDREW;
    case PLACED_TENTATIVE;
    case PLACED_CASUAL;
    case PLACED_TERM;
    case PLACED_INDETERMINATE;
    case EXPIRED;
    case REMOVED;

    public static function qualifiedEquivalentGroup(): array
    {
        return [
            PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
            PoolCandidateStatus::PLACED_TENTATIVE->name,
            PoolCandidateStatus::PLACED_CASUAL->name,
        ];
    }

    public static function placedGroup(): array
    {
        return [
            PoolCandidateStatus::PLACED_CASUAL->name,
            PoolCandidateStatus::PLACED_INDETERMINATE->name,
            PoolCandidateStatus::PLACED_TENTATIVE->name,
            PoolCandidateStatus::PLACED_TERM->name,
        ];
    }

    public static function removedGroup(): array
    {
        return [
            PoolCandidateStatus::SCREENED_OUT_NOT_INTERESTED->name,
            PoolCandidateStatus::SCREENED_OUT_NOT_RESPONSIVE->name,
            PoolCandidateStatus::QUALIFIED_UNAVAILABLE->name,
            PoolCandidateStatus::QUALIFIED_WITHDREW->name,
            PoolCandidateStatus::REMOVED->name,
        ];
    }

    public static function finalDecisionGroup(): array
    {
        return [
            PoolCandidateStatus::QUALIFIED_AVAILABLE->name,
            PoolCandidateStatus::QUALIFIED_UNAVAILABLE->name,
            PoolCandidateStatus::QUALIFIED_WITHDREW->name,
            PoolCandidateStatus::PLACED_TENTATIVE->name,
            PoolCandidateStatus::PLACED_CASUAL->name,
            PoolCandidateStatus::PLACED_TERM->name,
            PoolCandidateStatus::PLACED_INDETERMINATE->name,
            PoolCandidateStatus::EXPIRED->name,
            PoolCandidateStatus::SCREENED_OUT_APPLICATION->name,
            PoolCandidateStatus::SCREENED_OUT_ASSESSMENT->name,
        ];
    }

    public static function toAssessGroup(): array
    {
        return [
            PoolCandidateStatus::NEW_APPLICATION->name,
            PoolCandidateStatus::APPLICATION_REVIEW->name,
            PoolCandidateStatus::SCREENED_IN->name,
            PoolCandidateStatus::UNDER_ASSESSMENT->name,
        ];
    }

    public static function getLangFilename(): string
    {
        return 'pool_candidate_status';
    }
}

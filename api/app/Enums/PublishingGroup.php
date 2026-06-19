<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum PublishingGroup
{
    use HasLocalization;

    case IAP;
    case IT_JOBS;
    case EXECUTIVE_JOBS;
    case OTHER;

    public static function candidatesAvailableInSearch(): array
    {
        return [
            PublishingGroup::IT_JOBS->name,
            PublishingGroup::EXECUTIVE_JOBS->name,
            PublishingGroup::OTHER->name,
        ];
    }

    public static function getLangFilename(): string
    {
        return 'publishing_group';
    }
}

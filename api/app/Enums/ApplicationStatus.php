<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum ApplicationStatus
{
    use HasLocalization;

    case DRAFT;
    case TO_ASSESS;
    case REMOVED;
    case DISQUALIFIED;
    case QUALIFIED;

    public static function assessedGroup(): array
    {
        return [
            ApplicationStatus::QUALIFIED->name,
            ApplicationStatus::DISQUALIFIED->name,
        ];
    }

    public static function statusChangedNotificationGroup(): array
    {
        return [
            ApplicationStatus::QUALIFIED->name,
            ApplicationStatus::DISQUALIFIED->name,
            ApplicationStatus::REMOVED->name,
        ];
    }

    public static function getLangFilename(): string
    {
        return 'application_status';
    }
}

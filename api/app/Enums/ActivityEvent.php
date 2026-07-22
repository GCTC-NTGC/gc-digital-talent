<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum ActivityEvent: string
{
    use HasLocalization;

    // Core events
    case CREATED = 'created';
    case UPDATED = 'updated';
    case DELETED = 'deleted';

    case SUBMITTED = 'submitted';
    case QUALIFIED = 'qualified';
    case DISQUALIFIED = 'disqualified';
    case PLACED = 'placed';
    case ADDED = 'added';
    case REMOVED = 'removed';
    case REINSTATED = 'reinstated';
    case REVERTED = 'reverted';
    case PUBLISHED = 'published';

    // Special applications
    case SPECIAL_APPLICATION_CREATED = 'special_application_created';
    case SPECIAL_APPLICATION_SUBMITTED = 'special_application_submitted';

    public static function getLangFilename(): string
    {
        return 'activity_event';
    }
}

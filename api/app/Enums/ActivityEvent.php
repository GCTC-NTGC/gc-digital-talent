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
    case SPECIAL_APPLICATION_CREATED = 'specialApplicationCreated';
    case SPECIAL_APPLICATION_SUBMITTED = 'specialApplicationSubmitted';

    public static function getLangFilename(): string
    {
        return 'activity_event';
    }
}

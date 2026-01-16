<?php

namespace App\Enums;

enum ActivityEvent: string
{
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
}

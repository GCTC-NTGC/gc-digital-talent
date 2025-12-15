<?php

namespace App\Enums;

enum PoolCandidateEvent: string
{
    case SUBMITTED = 'submitted';
    case QUALIFIED = 'qualified';
    case DISQUALIFIED = 'disqualified';
    case PLACED = 'placed';
    case REMOVED = 'removed';
    case REINSTANTED = 'reinstated';
}

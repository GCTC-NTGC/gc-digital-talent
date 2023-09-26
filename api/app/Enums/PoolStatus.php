<?php

namespace App\Enums;

enum PoolStatus
{
    case DRAFT;
    case PUBLISHED;
    case CLOSED;
    case ARCHIVED;
}

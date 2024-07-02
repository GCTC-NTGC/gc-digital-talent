<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum PoolStream
{
    use HasLocalization;

    case ACCESS_INFORMATION_PRIVACY;
    case BUSINESS_ADVISORY_SERVICES;
    case DATABASE_MANAGEMENT;
    case ENTERPRISE_ARCHITECTURE;
    case INFRASTRUCTURE_OPERATIONS;
    case PLANNING_AND_REPORTING;
    case PROJECT_PORTFOLIO_MANAGEMENT;
    case SECURITY;
    case SOFTWARE_SOLUTIONS;
    case INFORMATION_DATA_FUNCTIONS;
    case EXECUTIVE_GROUP;

    public static function getLangFilename(): string
    {
        return 'pool_stream';
    }
}

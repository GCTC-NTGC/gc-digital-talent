<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum EmployeeVerification
{
    use HasLocalization;

    case VERIFIED;
    case NOT_VERIFIED;

    public static function getLangFilename(): string
    {
        return 'employee_verification';
    }
}

<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum EducationRequirementOption
{
    use HasLocalization;

    case APPLIED_WORK;
    case EDUCATION;
    case PROFESSIONAL_DESIGNATION;

    public static function classificationRequirements(?string $group)
    {
        return match ($group) {
            'EX' => [self::PROFESSIONAL_DESIGNATION->name, self::APPLIED_WORK->name, self::EDUCATION->name],
            default => [self::APPLIED_WORK->name, self::EDUCATION->name]
        };
    }

    public static function getLangFilename(): string
    {
        return 'education_requirement';
    }
}

<?php

namespace App\Enums;

use App\Traits\HasLocalization;
use Illuminate\Support\Facades\Lang;

enum ExperienceType: string
{
    use HasLocalization;

    case WORK = 'work';
    case EDUCATION = 'education';
    case AWARD = 'award';
    case COMMUNITY = 'community';
    case PERSONAL = 'personal';

    public static function getLangFilename(): string
    {
        return 'experiences';
    }

    public function localize(?string $locale = null): string
    {
        return Lang::get($this->getLangFilename().'.'.strtolower($this->name), [], $locale);
    }
}

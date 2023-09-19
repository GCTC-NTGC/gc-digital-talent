<?php

namespace App\Enums\DirectiveForms;

enum PersonnelLanguage
{
    case ENGLISH_ONLY;
    case FRENCH_ONLY;
    case BILINGUAL_INTERMEDIATE;
    case BILINGUAL_ADVANCED;
    case OTHER;
}

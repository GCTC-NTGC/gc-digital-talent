<?php

namespace App\Enums;

use GraphQL\Type\Definition\Description;

enum ApplicationStep
{
    case WELCOME;
    case SELF_DECLARATION;
    case REVIEW_YOUR_PROFILE;
    #[Description(description: 'This is the career timeline.')]
    case REVIEW_YOUR_RESUME;
    case EDUCATION_REQUIREMENTS;
    case SKILL_REQUIREMENTS;
    case SCREENING_QUESTIONS;
    case REVIEW_AND_SUBMIT;
}

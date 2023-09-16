<?php

namespace App\Enums;

enum EducationStatus
{
    case SUCCESS_CREDENTIAL;
    case SUCCESS_NO_CREDENTIAL;
    case IN_PROGRESS;
    case AUDITED;
    case DID_NOT_COMPLETE;
}

<?php

namespace App\Enums;

enum ClaimVerificationResult
{
    case ACCEPTED;
    case REJECTED;
    case UNVERIFIED;
    // a null value represents "unclaimed"
}

<?php

namespace App\Enums;

use Illuminate\Support\Carbon;

enum ClaimVerificationResult
{
    case ACCEPTED;
    case REJECTED;
    case UNVERIFIED;
    // a null value represents "unclaimed"

    public static function claimActive(?string $verification, ?Carbon $expiry)
    {

        return $verification && $verification !== self::REJECTED->name && (is_null($expiry) || $expiry->isFuture());
    }
}

<?php

namespace App\GraphQL\Mutations;

use App\Models\Pool;
use GraphQL\Error\FormattedError;
use Illuminate\Support\Carbon;

final class ExtendPoolAdvertisementClosingDate
{
    /**
     * Extends the pool advertisements closing date.
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $poolAdvertisement = Pool::find($args['id']);
        $newExpiryDate = $args['new_expiry_date'];

        if ($poolAdvertisement->expiry_date < Carbon::now()->endOfDay() &&
            $newExpiryDate < $poolAdvertisement->expiry_date) {
            throw FormattedError::setInternalErrorMessage("New expiry date must be in the future and greater than the old expiry date.");
        }

        $poolAdvertisement->update(['expiry_date' => $newExpiryDate]);
        return $poolAdvertisement;
    }
}

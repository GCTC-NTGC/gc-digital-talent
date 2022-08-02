<?php

namespace App\GraphQL\Mutations;

use App\Models\Pool;

final class ChangePoolExpiryDate
{
    /**
     * Extends the pool advertisements closing date.
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $poolAdvertisement = Pool::find($args['id']);
        $poolAdvertisement->update(['expiry_date' => $args['new_expiry_date']]);
        return $poolAdvertisement;
    }
}

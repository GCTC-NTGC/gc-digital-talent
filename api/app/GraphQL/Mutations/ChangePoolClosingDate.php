<?php

namespace App\GraphQL\Mutations;

use App\Models\Pool;

final class ChangePoolClosingDate
{
    /**
     * Extends the pool advertisements closing date.
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $poolAdvertisement = Pool::find($args['id']);
        $poolAdvertisement->update(['closing_date' => $args['new_closing_date']]);
        return $poolAdvertisement;
    }
}

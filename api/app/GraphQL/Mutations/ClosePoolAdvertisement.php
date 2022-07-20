<?php

namespace App\GraphQL\Mutations;

use App\Models\Pool;
use Illuminate\Support\Carbon;

final class ClosePoolAdvertisement
{
    /**
     * Closes the pool advertisements by setting the expiry_date to now().
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $poolAdvertisement = Pool::find($args['id']);
        $poolAdvertisement->update(['expiry_date' => Carbon::now()->endOfDay()]);
        return $poolAdvertisement;
    }
}

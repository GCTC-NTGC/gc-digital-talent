<?php

namespace App\GraphQL\Mutations;

use App\Models\Pool;
use Illuminate\Support\Carbon;

final class ClosePoolAdvertisement
{
    /**
     * Closes the pool advertisements by setting the closing_date to now().
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $poolAdvertisement = Pool::find($args['id']);
        $poolAdvertisement->update(['closing_date' => Carbon::now()]);
        return $poolAdvertisement;
    }
}

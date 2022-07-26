<?php

namespace App\GraphQL\Mutations;

use App\Models\Pool;

final class PublishPoolAdvertisement
{
    /**
     * Publishes the pool advertisement.
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $poolAdvertisement = Pool::find($args['id']);
        $poolAdvertisement->update(['is_published' => true]);
        return $poolAdvertisement;
    }
}

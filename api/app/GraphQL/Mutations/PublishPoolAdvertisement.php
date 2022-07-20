<?php

namespace App\GraphQL\Mutations;

use App\Models\Pool;
use Database\Helpers\ApiEnums;
use GraphQL\Error\FormattedError;
use Illuminate\Support\Carbon;

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

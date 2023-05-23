<?php

namespace App\GraphQL\Mutations;

use App\Models\Pool;

final class DuplicatePoolAdvertisement
{
    /**
     * Duplicates a pool advertisement
     *
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $pool = Pool::find($args['id']);

        $newPool = $pool->replicate()->fill([
            'name' => [
                'en' => $pool->name['en'] . ' (copy)',
                'fr' => $pool->name['fr'] . ' (copie)',
            ],
            'key' => $pool->key . '_' . time(), // Ensure unique key
            'closing_date' => null,
            'published_at' => null,
        ]);
        $newPool->save();

        return $newPool;
    }
}

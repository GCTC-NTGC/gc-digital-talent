<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use Illuminate\Support\Facades\DB;

final readonly class SitewideAnnouncement
{
    public function __invoke(null $_, array $args)
    {
        $dbRow = DB::table('settings')->where('key', 'sitewide_announcement')->first(['value']);

        if (is_null($dbRow) || is_null($dbRow->value)) {
            return null;
        }

        $value = json_decode($dbRow->value);

        return $value;
    }
}

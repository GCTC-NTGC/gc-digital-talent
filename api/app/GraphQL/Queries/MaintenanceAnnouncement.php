<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use Illuminate\Support\Facades\DB;

final readonly class MaintenanceAnnouncement
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $dbRow = DB::table('settings')->where('key', 'maintenance_announcement')->first(['value']);
        $value = json_decode($dbRow->value);

        return $value;
    }
}

<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

final readonly class UpdateMaintenanceAnnouncement
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $parsedObj = [
            'isEnabled' => boolval($args['isEnabled']),
            'publishDate' => Carbon::parse($args['publishDate'])->toDateTimeString(),
            'expiryDate' => Carbon::parse($args['expiryDate'])->toDateTimeString(),
            'message' => [
                'en' => strval($args['message']['en']),
                'fr' => strval($args['message']['fr']),
            ],
        ];

        DB::table('settings')
            ->where('key', 'maintenance_announcement')
            ->update(['value' => json_encode($parsedObj)]);

        return $parsedObj;
    }
}

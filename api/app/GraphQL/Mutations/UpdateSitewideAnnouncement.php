<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

final readonly class UpdateSitewideAnnouncement
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        // parse and save the input
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
            ->updateOrInsert(
                ['key' => 'sitewide_announcement'],
                ['value' => json_encode($parsedObj)],
            );

        // read the value back out for response
        $retrievedRow = DB::table('settings')->where('key', 'sitewide_announcement')->first(['value']);

        if (is_null($retrievedRow) || is_null($retrievedRow->value)) {
            return null;
        }

        $retrievedValue = json_decode($retrievedRow->value);

        return $retrievedValue;
    }
}

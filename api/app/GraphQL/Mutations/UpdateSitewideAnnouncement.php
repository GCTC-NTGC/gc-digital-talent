<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\UnauthorizedException;

final readonly class UpdateSitewideAnnouncement
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        /** @var \App\Models\User */
        $user = Auth::user();
        throw_unless($user->isAbleTo('update-any-announcement'), UnauthorizedException::class);

        // parse and save the input
        $parsedObj = [
            'isEnabled' => boolval($args['isEnabled']),
            'publishDate' => Carbon::parse($args['publishDate'])->toDateTimeString(),
            'expiryDate' => Carbon::parse($args['expiryDate'])->toDateTimeString(),
            'title' => [
                'en' => strval($args['title']['en']),
                'fr' => strval($args['title']['fr']),
            ],
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

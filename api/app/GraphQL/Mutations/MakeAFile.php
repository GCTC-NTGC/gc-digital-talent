<?php

namespace App\GraphQL\Mutations;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\UnauthorizedException;

final class MakeAFile
{
    /**
     * Closes the pool by setting the archived_at to now().
     *
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $userId = Auth::id();

        throw_unless(is_string($userId), UnauthorizedException::class);

        $response = Http::get('https://loremflickr.com/640/360');

        $newFilename = ((string) Str::orderedUuid()).'.jpg'; // https://stackoverflow.com/a/50535499

        Storage::disk('userGenerated')->put($userId.'/'.$newFilename, $response->body());

        return $newFilename;
    }
}

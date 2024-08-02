<?php

namespace App\GraphQL\Mutations;

use App\Generators\UserDocGenerator;
use App\Jobs\GenerateUserFile;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\UnauthorizedException;

final class DownloadUsersDoc
{
    /**
     * Dispatches the generation of a
     * csv containing pool candidates
     *
     * @disregard P1003 We never intend to use this
     */
    public function __invoke($_, array $args)
    {

        $user = Auth::user();
        throw_unless(is_string($user?->id), UnauthorizedException::class);

        $locale = $args['locale'] ?? 'en';

        try {
            // Make sure this user can see candidates before sending
            // them to the generation job
            $ids = User::whereIn('id', $args['ids'])
                ->authorizedToView()
                ->get('id')
                ->pluck('id') // Seems weird but we are just flattening it out
                ->toArray();

            $fileName = sprintf('%s_%s.docx', Lang::get('filename.users', [], $locale), date('Y-m-d_His'));

            $generator = new UserDocGenerator(
                ids: $ids,
                anonymous: $args['anonymous'] ?? true, // Probably safer to fallback to anonymous
                fileName: $fileName,
                dir: $user->id,
                lang: strtolower($locale),
            );

            GenerateUserFile::dispatch($generator, $user);

            return true;
        } catch (\Exception $e) {
            Log::error('Error starting user document generation '.$e->getMessage());

            return false;
        }

        return false;
    }
}

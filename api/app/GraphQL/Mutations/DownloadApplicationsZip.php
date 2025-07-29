<?php

namespace App\GraphQL\Mutations;

use App\Generators\ApplicationZipGenerator;
use App\Jobs\GenerateUserFile;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\UnauthorizedException;

final class DownloadApplicationsZip
{
    /**
     * Dispatches the generation of a
     * zip containing pool candidates
     *
     * @disregard P1003 No intention of using the var
     */
    public function __invoke($_, array $args)
    {
        $user = Auth::user();
        throw_unless(is_string($user?->id), UnauthorizedException::class);

        $ids = $args['ids'] ?? [];

        try {
            $generator = new ApplicationZipGenerator(
                ids: $ids,
                fileName: sprintf('%s_%s', __('filename.candidates'), date('Y-m-d_His')),
                dir: $user->id,
                lang: App::getLocale(),
                authenticatedUser: $user,
            );

            $generator->setUserId($user->id);

            GenerateUserFile::dispatch($generator, $user);

            return true;
        } catch (\Exception $e) {
            Log::error('Error starting application document generation '.$e->getMessage());

            return false;
        }
    }
}

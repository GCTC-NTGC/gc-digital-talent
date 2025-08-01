<?php

namespace App\GraphQL\Mutations;

use App\Generators\UserExcelGenerator;
use App\Jobs\GenerateUserFile;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\UnauthorizedException;

final class DownloadUsersExcel
{
    /**
     * Dispatches the generation of a
     * excel containing pool candidates
     *
     * @disregard P1003 We are not going to be using this var
     */
    public function __invoke($_, array $args)
    {

        $user = Auth::user();
        throw_unless(is_string($user?->id), UnauthorizedException::class);

        $ids = $args['ids'] ?? null;
        $filters = $args['where'] ?? null;

        try {
            $generator = new UserExcelGenerator(
                fileName: sprintf('%s_%s', __('filename.profiles'), date('Y-m-d_His')),
                dir: $user->id,
                lang: App::getLocale(),
            );

            $generator
                ->setAuthenticatedUserId($user->id)
                ->setIds($ids)
                ->setFilters($filters);

            GenerateUserFile::dispatch($generator, $user);

            return true;
        } catch (\Exception $e) {
            Log::error('Error starting user excel generation '.$e->getMessage());

            return false;
        }
    }
}

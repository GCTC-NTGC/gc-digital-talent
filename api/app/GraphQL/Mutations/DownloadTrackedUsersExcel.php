<?php

namespace App\GraphQL\Mutations;

use App\Generators\UserExcelGenerator;
use App\Jobs\GenerateUserFile;
use App\Models\TalentRequestTrackedUser;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\UnauthorizedException;

final class DownloadTrackedUsersExcel
{
    /**
     * Dispatch an excel of the users tracked by a talent request, resolving them
     * server-side from the same filter the tracking table uses (so "download all"
     * covers every matching row across pages, not just the loaded page).
     *
     * @disregard P1003 We are not going to be using this var
     */
    public function __invoke($_, array $args)
    {
        $user = Auth::user();
        throw_unless(is_string($user?->id), UnauthorizedException::class);

        $where = $args['where'] ?? [];

        try {
            $userIds = TalentRequestTrackedUser::query()
                ->where('talent_request_id', $args['talentRequestId'])
                ->whereAuthorizedToView()
                ->whereStatusIn($where['statuses'] ?? null)
                ->whereUserNameOrEmail($where['generalSearch'] ?? null)
                ->pluck('user_id')
                ->all();

            $generator = new UserExcelGenerator(
                fileName: sprintf('%s_%s', __('filename.profiles'), date('Y-m-d_His')),
                dir: $user->id,
                lang: App::getLocale(),
            );

            $generator
                ->setAuthenticatedUserId($user->id)
                ->setIds($userIds);

            GenerateUserFile::dispatch($generator, $user);

            return true;
        } catch (\Exception $e) {
            Log::error('Error starting tracked user excel generation '.$e->getMessage());

            return false;
        }
    }
}

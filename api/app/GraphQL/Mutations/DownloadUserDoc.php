<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Generators\UserDocGenerator;
use App\Models\User;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\UnauthorizedException;

final readonly class DownloadUserDoc
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $user = Auth::user();
        throw_unless(is_string($user?->id), UnauthorizedException::class);

        try {
            $targetUser = User::findOrFail($args['id']);

            $generator = new UserDocGenerator(
                user: $targetUser,
                anonymous: $args['anonymous'] ?? true, // Probably safer to fallback to anonymous
                dir: $user->id,
                lang: App::getLocale(),
            );

            $generator->setUserId($user->id);

            $generator->generate()->write();

            return $generator->getFileNameWithExtension();
        } catch (\Exception $e) {
            Log::error('Error starting user document generation '.$e);

            return null;
        }

        return null;
    }
}

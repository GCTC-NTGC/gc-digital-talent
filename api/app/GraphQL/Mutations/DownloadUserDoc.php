<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Generators\UserDocGenerator;
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
            $fileName = sprintf('%s_%s.docx', __('filename.user'), date('Y-m-d_His'));

            $generator = new UserDocGenerator(
                ids: [$args['id']],
                anonymous: $args['anonymous'] ?? true, // Probably safer to fallback to anonymous
                fileName: $fileName,
                dir: $user->id,
                lang: App::getLocale(),
            );

            $generator->generate()->write();

            return trim($generator->getFileName());
        } catch (\Exception $e) {
            Log::error('Error starting user document generation '.$e->getMessage());

            return null;
        }

        return null;
    }
}

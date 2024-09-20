<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\UnauthorizedException;

final readonly class DownloadPoolCandidateDoc
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $user = Auth::user();
        throw_unless(is_string($user?->id), UnauthorizedException::class);

        try {

            $fileName = sprintf('%s_%s.docx', __('filename.candidate'), date('Y-m-d_His'));

            $generator = new PoolCandidateUserZipGenerator(
                ids: [$args['id']],
                anonymous: $args['anonymous'] ?? true, // Probably safer to fallback to anonymous
                fileName: $fileName,
                dir: $user->id,
                lang: App::getLocale()
            );

            $generator->setUserId($user->id);

            $generator->generate()->write();

            return $generator->getFileName();
        } catch (\Exception $e) {
            Log::error('Error starting candidate document generation '.$e->getMessage());

            return null;
        }

        return null;
    }
}

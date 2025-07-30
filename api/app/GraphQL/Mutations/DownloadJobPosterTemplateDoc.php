<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Generators\JobPosterTemplateGenerator;
use App\Models\JobPosterTemplate;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\UnauthorizedException;

final readonly class DownloadJobPosterTemplateDoc
{
    /** @param  array{id: string|null}  $args */
    public function __invoke(null $_, array $args)
    {
        $user = Auth::user();
        throw_unless(is_string($user?->id), UnauthorizedException::class);

        try {
            $targetPoster = JobPosterTemplate::findOrFail($args['id']);
            $generator = new JobPosterTemplateGenerator(
                jobPoster: $targetPoster,
                dir: $user->id,
                lang: App::getLocale(),
            );

            $generator->setAuthenticatedUserId($user->id);

            $generator->generate()->write();

            return $generator->getFileNameWithExtension();
        } catch (\Exception $e) {
            Log::error('Error starting job poster template document generation '.$e);

            return null;
        }
    }
}

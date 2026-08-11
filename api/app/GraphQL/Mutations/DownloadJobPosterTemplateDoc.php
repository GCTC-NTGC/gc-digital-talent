<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Generators\JobPosterTemplateGenerator;
use App\Models\JobPosterTemplate;
use App\Support\FilePath;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Log;

final readonly class DownloadJobPosterTemplateDoc
{
    /** @param  array{id: string|null}  $args */
    public function __invoke(null $_, array $args)
    {
        try {
            $targetPoster = JobPosterTemplate::findOrFail($args['id']);
            $generator = new JobPosterTemplateGenerator(
                jobPoster: $targetPoster,
                dir: FilePath::PUBLIC_PATH,
                lang: App::getLocale(),
            );

            $generator->generate()->write();

            return $generator->getFileNameWithExtension();
        } catch (\Exception $e) {
            Log::error('Error starting job poster template document generation '.$e);

            return null;
        }
    }
}

<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Generators\ApplicationDocGenerator;
use App\Models\PoolCandidate;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\UnauthorizedException;

final readonly class DownloadApplicationDoc
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $user = Auth::user();
        throw_unless(is_string($user?->id), UnauthorizedException::class);

        try {
            $targetApplicant = PoolCandidate::findOrFail($args['id']);
            $generator = new ApplicationDocGenerator(
                candidate: $targetApplicant,
                dir: $user->id,
                lang: App::getLocale()
            );

            $generator->setUserId($user->id);

            $generator->generate()->write();

            return $generator->getFileNameWithExtension();
        } catch (\Exception $e) {
            Log::error('Error starting candidate document generation '.$e);

            return null;
        }

        return null;
    }
}

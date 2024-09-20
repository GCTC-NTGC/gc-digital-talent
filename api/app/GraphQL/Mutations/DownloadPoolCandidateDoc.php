<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Generators\PoolCandidateDocGenerator;
use App\Models\PoolCandidate;
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
            $candidate = PoolCandidate::findOrFail($args['id']);
            $generator = new PoolCandidateDocGenerator(
                candidate: $candidate,
                anonymous: $args['anonymous'] ?? true, // Probably safer to fallback to anonymous
                dir: $user->id,
                lang: App::getLocale()
            );

            $generator->setUserId($user->id);

            $generator->generate()->write();

            return $generator->getFileNameWithExtension();
        } catch (\Exception $e) {
            Log::error('Error starting candidate document generation '.$e->getMessage());

            return null;
        }

        return null;
    }
}

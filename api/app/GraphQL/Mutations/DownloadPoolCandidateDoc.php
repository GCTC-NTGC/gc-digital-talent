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
    /**
     * @disregard P1003 Will not use
     *
     * @param  array{id: ?string, anonymous: ?bool}  $args
     */
    public function __invoke(null $_, array $args)
    {
        $user = Auth::user();
        throw_unless(is_string($user?->id), UnauthorizedException::class);

        $targetApplicant = PoolCandidate::findOrFail($args['id'])->load(['user']);
        $firstName = $targetApplicant->user?->first_name;
        $lastName = $targetApplicant->user?->last_name;
        if (isset($firstName)) {
            $firstName = iconv('UTF-8', 'ASCII//TRANSLIT', $firstName); // handle accented characters
            $firstName = preg_replace('/[^a-zA-Z]+/', '', $firstName); // remove anything that isn't an alphabet character
            $firstName = trim($firstName);
        }
        if (isset($lastName)) {
            $lastName = iconv('UTF-8', 'ASCII//TRANSLIT', $lastName);
            $lastName = preg_replace('/[^a-zA-Z]+/', '', $lastName);
            $lastName = trim($lastName);
        }

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
            Log::error('Error starting candidate document generation '.$e);

            return null;
        }
    }
}

<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Generators\PoolCandidateUserDocGenerator;
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

        $targetApplicant = PoolCandidate::find($args['id'])->load(['user']);
        $firstName = $targetApplicant?->user?->first_name;
        $lastName = $targetApplicant?->user?->last_name;
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

            $fileName = sprintf('%s - %s - Application - Candidature.docx', $firstName ? $firstName : '', $lastName ? $lastName : '');

            $generator = new PoolCandidateUserDocGenerator(
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

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

        $targetApplicant = PoolCandidate::find($args['id'])->load(['user']);
        $firstName = $targetApplicant?->user?->first_name;
        $lastName = $targetApplicant?->user?->last_name;
        if (isset($firstName)) {
            $firstName = trim(filter_var($firstName, FILTER_SANITIZE_EMAIL));
        }
        if (isset($lastName)) {
            $lastName = trim(filter_var($lastName, FILTER_SANITIZE_EMAIL));
        }

        try {

            $fileName = sprintf('%s - %s - Application - Candidature.docx', $firstName ? $firstName : '', $lastName ? $lastName : '');

            $generator = new ApplicationDocGenerator(
                ids: [$args['id']],
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

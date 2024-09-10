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

        $targetUser = User::find($args['id']);
        $firstName = $targetUser?->first_name;
        $lastName = $targetUser?->last_name;
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

            $fileName = $args['anonymous'] ?
                sprintf('%s - %s - Profile - Profil.docx', $firstName ? $firstName : '', $lastName ? substr($lastName, 0, 1) : '') :
                sprintf('%s - %s - Profile - Profil.docx', $firstName ? $firstName : '', $lastName ? $lastName : '');

            $generator = new UserDocGenerator(
                ids: [$args['id']],
                anonymous: $args['anonymous'] ?? true, // Probably safer to fallback to anonymous
                fileName: $fileName,
                dir: $user->id,
                lang: App::getLocale(),
            );

            $generator->setUserId($user->id);

            $generator->generate()->write();

            return $generator->getFileName();
        } catch (\Exception $e) {
            Log::error('Error starting user document generation '.$e->getMessage());

            return null;
        }

        return null;
    }
}

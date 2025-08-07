<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Generators\NominationDocGenerator;
use App\Models\TalentNominationGroup;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\UnauthorizedException;

final readonly class DownloadNominationDoc
{
    /**
     * @param  array{id: ?string}  $args
     */
    public function __invoke(null $_, array $args)
    {
        $user = Auth::user();
        throw_unless(is_string($user?->id), UnauthorizedException::class);

        try {
            $targetTalentNominationGroup = TalentNominationGroup::findOrFail($args['id']);

            $generator = new NominationDocGenerator(
                talentNominationGroup: $targetTalentNominationGroup,
                dir: $user->id,
                lang: App::getLocale(),
            );

            $generator->setAuthenticatedUserId($user->id);

            $generator->generate()->write();

            return $generator->getFileNameWithExtension();
        } catch (\Exception $e) {
            Log::error('Error starting talent nomination document generation '.$e);

            return null;
        }
    }
}

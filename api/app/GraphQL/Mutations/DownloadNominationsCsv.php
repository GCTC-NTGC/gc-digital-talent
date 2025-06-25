<?php

namespace App\GraphQL\Mutations;

use App\Generators\NominationsCsvGenerator;
use App\Jobs\GenerateUserFile;
use App\Models\TalentNominationEvent;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\UnauthorizedException;

final class DownloadNominationsCsv
{
    /**
     * Dispatches the generation of a
     * csv containing community interests
     *
     * @disregard P1003 We are not going to be using this var
     */
    public function __invoke($_, array $args)
    {

        $user = Auth::user();
        throw_unless(is_string($user?->id), UnauthorizedException::class);

        $ids = $args['ids'] ?? null;
        $talentNominationEventId = $args['talentNominationEventId'] ?? null;
        $talentNominationEvent = TalentNominationEvent::findOrFail($talentNominationEventId);
        $talentNominationEventName = App::getLocale() === 'en' ? $talentNominationEvent->name['en'] : $talentNominationEvent->name['fr'];

        try {
            $generator = new NominationsCsvGenerator(
                fileName: sprintf('%s%s_%s', str_replace(' ', '', $talentNominationEventName), __('filename.nominations'), date('Y-m-d_His')),
                talentNominationEventId: $talentNominationEventId,
                dir: $user->id,
                lang: App::getLocale(),
            );

            $generator
                ->setUserId($user->id)
                ->setIds($ids);

            GenerateUserFile::dispatch($generator, $user);

            return true;
        } catch (\Exception $e) {
            Log::error('Error starting'.$talentNominationEventName.' nominations csv generation '.$e->getMessage());

            return false;
        }
    }
}

<?php

namespace App\Notifications\Utils;

use Illuminate\Support\Facades\Lang;

class NominationUtils
{
    public static function combineNominationOptionDescriptions(
        string $locale,
        bool $nominateForAdvancement,
        bool $nominateForLateralMovement,
        bool $nominateForDevelopmentPrograms,
    ) {
        $nominationOptionDescriptions = collect([]);
        if ($nominateForAdvancement) {
            $nominationOptionDescriptions->push(Lang::get('talent_nomination_option.advancement', [], $locale));
        }
        if ($nominateForLateralMovement) {
            $nominationOptionDescriptions->push(Lang::get('talent_nomination_option.lateral_movement', [], $locale));
        }
        if ($nominateForDevelopmentPrograms) {
            $nominationOptionDescriptions->push(Lang::get('talent_nomination_option.development_programs', [], $locale));
        }

        $combinedNominationOptionDescriptions = match ($nominationOptionDescriptions->count()) {
            0 => Lang::get('common.not_provided', [], $locale),
            1 => $nominationOptionDescriptions->sole(),
            2 => $nominationOptionDescriptions->join(Lang::get('join.and_list', [], $locale)),
            default => $nominationOptionDescriptions->join(', ', Lang::get('join.last_item_in_comma_list')),
        };

        return $combinedNominationOptionDescriptions;
    }
}

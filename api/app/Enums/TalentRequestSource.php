<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum TalentRequestSource
{
    use HasLocalization;

    case QUALIFIED_IN_POOL;
    case AT_LEVEL;
    case ADVANCEMENT;

    public static function getLangFilename(): string
    {
        return 'talent_request_source';
    }

    // the User relation holding this source's matched records, or null if not implemented yet
    public function matchRelation(): ?string
    {
        return match ($this) {
            self::QUALIFIED_IN_POOL => 'matchingQualifiedInPoolSources',
            self::AT_LEVEL => 'matchingAtLevelSources',
            default => null,
        };
    }

    /**
     * The implemented sources a talent request queries: those named in $selected, or every
     * implemented source when $selected is null/empty (an unset/empty talentSources filter
     * means "all sources"). Unimplemented sources (no matchRelation) are never returned.
     *
     * @param  ?array<string>  $selected  TalentRequestSource names, e.g. ApplicantFilter talentSources
     * @return array<self>
     */
    public static function selected(?array $selected): array
    {
        $implemented = array_filter(self::cases(), fn (self $source) => $source->matchRelation() !== null);

        if (empty($selected)) {
            return array_values($implemented);
        }

        return array_values(array_filter(
            $implemented,
            fn (self $source) => in_array($source->name, $selected, true)
        ));
    }
}

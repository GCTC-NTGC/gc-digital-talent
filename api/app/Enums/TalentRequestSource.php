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

    // the User relation holding this source's matched records
    public function matchRelation(): string
    {
        return match ($this) {
            self::QUALIFIED_IN_POOL => 'matchingQualifiedInPoolSources',
            self::AT_LEVEL => 'matchingAtLevelSources',
            self::ADVANCEMENT => 'matchingAdvancementSources',
        };
    }

    /**
     * The sources a talent request queries: those named in $selected, or every source when
     * $selected is null/empty (an unset/empty talentSources filter means "all sources").
     *
     * @param  ?array<string>  $selected  TalentRequestSource names, e.g. ApplicantFilter talentSources
     * @return array<self>
     */
    public static function selected(?array $selected): array
    {
        if (empty($selected)) {
            return self::cases();
        }

        return array_values(array_filter(
            self::cases(),
            fn (self $source) => in_array($source->name, $selected, true)
        ));
    }
}

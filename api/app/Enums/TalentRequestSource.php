<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum TalentRequestSource
{
    use HasLocalization;

    case QUALIFIED_IN_POOL;
    case AT_LEVEL;
    case ADVANCEMENT;
    case LATERAL_MOVEMENT;

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
            self::LATERAL_MOVEMENT => 'matchingLateralMovementSources',
        };
    }

    /**
     * The TalentNominationGroup nomination type (see
     * TalentNominationGroupBuilder::forNominationType()) this source's matches are
     * decided/expired/classified under, or null for sources not backed by TalentNominationGroup.
     * Needed wherever a fresh query gets built from the related model (whereHas()'s existence
     * subquery, batch loaders) instead of reusing the matching*Sources() relation's own query,
     * since forNominationType() chained there doesn't survive that rebuild.
     */
    public function matchNominationType(): ?string
    {
        return match ($this) {
            self::ADVANCEMENT => 'advancement',
            self::LATERAL_MOVEMENT => 'lateral_movement',
            default => null,
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

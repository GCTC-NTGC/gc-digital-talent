<?php

namespace App\Contracts;

// Guarantees a builder can scope results to what the current user is authorized to view, for
// talent-request purposes. Split from TalentRequestMatchable (which extends this) because
// view-authorization doesn't depend on nomination type the way matching does — see
// TalentNominationGroupBuilder, which implements this but not TalentRequestMatchable.
interface TalentRequestViewable
{
    public function whereAuthorizedToView(?array $args = null): self;
}

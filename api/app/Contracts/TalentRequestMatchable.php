<?php

namespace App\Contracts;

// Guarantees a builder has one unambiguous whereMatchesTalentRequest() (see
// TalentRequestSource::matchRelation()). TalentNominationGroupBuilder does NOT implement this: a
// TalentNominationGroup row is decided independently per nomination type, so it has no single
// match — only whereMatchesTalentRequestForAdvancement()/ForLateralMovement() (see
// TalentRequestSource::matchMethod() and TalentNominationGroupMatchable).
interface TalentRequestMatchable extends TalentRequestViewable
{
    public function whereMatchesTalentRequest(?array $filters): self;
}

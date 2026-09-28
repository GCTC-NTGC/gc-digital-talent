<?php

namespace App\Contracts;

// TalentNominationGroup rows are decided independently per nomination type, so this has one
// match method per type instead of TalentRequestMatchable's single method.
interface TalentNominationGroupMatchable
{
    public function whereMatchesTalentRequestForAdvancement(?array $filters): self;

    public function whereMatchesTalentRequestForLateralMovement(?array $filters): self;
}

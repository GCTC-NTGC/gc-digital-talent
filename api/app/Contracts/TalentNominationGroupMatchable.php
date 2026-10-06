<?php

namespace App\Contracts;

interface TalentNominationGroupMatchable extends TalentRequestViewable
{
    public function whereMatchesTalentRequestForAdvancement(?array $filters): self;

    public function whereMatchesTalentRequestForLateralMovement(?array $filters): self;
}

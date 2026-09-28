<?php

namespace App\Contracts;

interface TalentRequestMatchable extends TalentRequestViewable
{
    public function whereMatchesTalentRequest(?array $filters): self;
}

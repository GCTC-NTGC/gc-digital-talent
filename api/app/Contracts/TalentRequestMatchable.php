<?php

namespace App\Contracts;

// Guarantees a builder can filter to talent-request matches; see TalentRequestSource::matchRelation().
interface TalentRequestMatchable
{
    public function whereMatchesTalentRequest(?array $filters): self;

    public function whereAuthorizedToView(?array $args = null): self;
}

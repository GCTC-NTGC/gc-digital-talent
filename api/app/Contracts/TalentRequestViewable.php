<?php

namespace App\Contracts;

interface TalentRequestViewable
{
    public function whereAuthorizedToView(?array $args = null): self;
}

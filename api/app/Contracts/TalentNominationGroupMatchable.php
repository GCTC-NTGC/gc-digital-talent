<?php

namespace App\Contracts;

// Guarantees TalentNominationGroupBuilder's two nomination-type-specific match methods exist —
// the PHP-enforced version of what TalentRequestMatchable can't guarantee for this builder,
// since it has no single, unambiguous whereMatchesTalentRequest(). Delete or rename either
// method and the class fails to declare, instead of only failing at runtime.
interface TalentNominationGroupMatchable
{
    public function whereMatchesTalentRequestForAdvancement(?array $filters): self;

    public function whereMatchesTalentRequestForLateralMovement(?array $filters): self;
}

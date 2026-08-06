<?php

namespace App\Support\Query;

/**
 * Contract for advanced ordering scopes.
 */
readonly class AdvancedOrder
{
    public string $direction;

    public ?string $nulls;

    public bool $caseInsensitive;

    public bool $accentInsensitive;

    public function __construct(array $input)
    {
        $direction = strtoupper($input['direction'] ?? 'ASC');
        $this->direction = in_array($direction, ['ASC', 'DESC']) ? $direction : 'ASC';

        $nulls = strtoupper($input['nulls'] ?? '');
        $this->nulls = in_array($nulls, ['FIRST', 'LAST']) ? $nulls : null;

        $this->caseInsensitive = $input['caseInsensitive'] ?? false;
        $this->accentInsensitive = $input['accentInsensitive'] ?? false;
    }
}

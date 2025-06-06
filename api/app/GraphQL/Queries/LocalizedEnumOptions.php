<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Traits\QueriesLocalizedEnums;

final class LocalizedEnumOptions
{
    use QueriesLocalizedEnums;

    public function __invoke($root, array $args)
    {
        return $this->buildEnumList($args['enumName'], fn ($case) => $case);
    }
}

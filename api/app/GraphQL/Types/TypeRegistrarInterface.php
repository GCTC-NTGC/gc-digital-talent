<?php

namespace App\GraphQL\Types;

use Nuwave\Lighthouse\Schema\TypeRegistry;

interface TypeRegistrarInterface
{
    /**
     * Registers GraphQL types with the Lighthouse TypeRegistry.
     */
    public static function register(TypeRegistry $typeRegistry): void;
}

<?php

namespace App\GraphQL\Types;

use Nuwave\Lighthouse\Schema\TypeRegistry;

/**
 * Implement this interface to register custom types with the GraphQL TypeRegistry.
 *
 * Optionally, define a public static int $weight property on your registrar class.
 * Registrars are sorted by $weight before registration:
 *   - Lower weight means earlier registration.
 *   - If $weight is not set, the default is 100.
 *
 * Example:
 *   public static int $weight = 0; // Registers before registrars with higher weight
 */
interface TypeRegistrarInterface
{
    /**
     * Registers GraphQL types with the Lighthouse TypeRegistry.
     */
    public static function register(TypeRegistry $typeRegistry): void;
}

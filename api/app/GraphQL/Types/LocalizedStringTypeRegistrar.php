<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Nuwave\Lighthouse\Schema\TypeRegistry;

/**
 * @internal
 */
final class LocalizedStringTypeRegistrar implements TypeRegistrarInterface
{
    // Lowest weight since it should always be first since
    // it is used in the other registrars
    public static int $weight = 0;

    public static function register(TypeRegistry $typeRegistry): void
    {
        $typeRegistry->register(
            new ObjectType([
                'name' => 'LocalizedString',
                'fields' => [
                    'en' => Type::string(),
                    'fr' => Type::string(),
                    'localized' => Type::string(),
                ],
            ])
        );
    }
}

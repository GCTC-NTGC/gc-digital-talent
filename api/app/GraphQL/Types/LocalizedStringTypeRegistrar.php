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

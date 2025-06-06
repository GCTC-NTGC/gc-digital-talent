<?php

namespace App\Discoverers;

use App\GraphQL\Types\TypeRegistrarInterface;
use Spatie\StructureDiscoverer\Discover;

/**
 * @internal
 */
final class TypeRegistrarDiscoverer
{
    /**
     * Discover all classes in app/GraphQL/Types implementing TypeRegistrarInterface.
     *
     * @return array<class-string<TypeRegistrarInterface>>
     */
    public static function discover(): array
    {
        /** @var array<class-string<TypeRegistrarInterface>> $classes */
        $classes = Discover::in(app_path('GraphQL/Types'))
            ->implementing(TypeRegistrarInterface::class)
            ->get();

        return $classes;
    }
}

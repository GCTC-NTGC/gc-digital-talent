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

        // Registrars are sorted by their static $weight property (lowest first).
        // If a registrar does not define $weight, it defaults to 100.
        usort($classes, fn ($a, $b) => ($a::$weight ?? 100) <=> ($b::$weight ?? 100));

        return $classes;
    }
}

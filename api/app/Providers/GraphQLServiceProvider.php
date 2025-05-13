<?php

namespace App\Providers;

use App\Discoverers\EnumDiscoverer;
use App\GraphQL\Operators\PostgreSQLOperator;
use GraphQL\Type\Definition\EnumType;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Illuminate\Support\ServiceProvider;
use Nuwave\Lighthouse\Schema\TypeRegistry;
use Nuwave\Lighthouse\WhereConditions\Operator;

class GraphQLServiceProvider extends ServiceProvider
{
    public function boot(TypeRegistry $typeRegistry): void
    {

        // Discover all enums in the App\Enum namespace to register them with GraphQL
        $enums = EnumDiscoverer::discoverEnums();

        /** @var \UnitEnum $enum */
        foreach ($enums as $enum) {
            $name = class_basename($enum);

            /** @var callable(): \GraphQL\Type\Definition\Type&\GraphQL\Type\Definition\NamedType $callback */
            $callback = static function () use ($name, $enum) {
                $values = array_column($enum::cases(), 'name');

                return new EnumType([
                    'name' => $name,
                    'values' => $values,
                ]);
            };

            $typeRegistry->registerLazy(
                $name,
                $callback
            );
        }

        /** Discover all enums in the App\Enum namespace that implement the HasLocalization trait
         * and register them as a LocalizedEnum type in GraphQL
         */
        $localizedEnums = EnumDiscoverer::discoverLocalizedEnums();

        foreach ($localizedEnums as $enum) {
            $name = class_basename($enum);

            /** @disregard P1003 We don't need to use args or context vars in our resolver */
            $resolver = function ($value, $args, $context, ResolveInfo $info) use ($enum) {
                switch ($info->fieldName) {
                    case 'value': return $value;
                        /** @disregard P1013 Can't type hint traits */
                    case 'label': return $enum::localizedString($value);
                    default: return null;
                }
            };

            $typeRegistry->register(
                new ObjectType([
                    'name' => 'Localized'.$name,
                    'fields' => function () use ($typeRegistry, $name): array {
                        return [
                            'value' => Type::nonNull($typeRegistry->get($name)),
                            'label' => Type::nonNull($typeRegistry->get('LocalizedString')),
                        ];
                    },
                    'resolveField' => $resolver,
                ])
            );
        }
    }

    public function register(): void
    {
        $this->app->bind(Operator::class, PostgreSQLOperator::class);
    }
}

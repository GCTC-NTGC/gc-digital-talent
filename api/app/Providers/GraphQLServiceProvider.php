<?php

namespace App\Providers;

use App\Enums\Language;
use App\GraphQL\Operators\PostgreSQLOperator;
use App\Traits\HasLocalization;
use GraphQL\Type\Definition\EnumType;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Illuminate\Support\ServiceProvider;
use Nuwave\Lighthouse\Schema\TypeRegistry;
use Nuwave\Lighthouse\WhereConditions\Operator;
use Spatie\StructureDiscoverer\Data\DiscoveredStructure;
use Spatie\StructureDiscoverer\Discover;
use Spatie\StructureDiscoverer\Enums\Sort;

class GraphQLServiceProvider extends ServiceProvider
{
    public function boot(TypeRegistry $typeRegistry): void
    {

        $typeRegistry->registerLazy(
            'Language',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'Language',
                    'values' => [
                        Language::EN->name => ['value' => Language::EN->value],
                        Language::FR->name => ['value' => Language::FR->value],
                    ],
                ]);
            }
        );

        // Discover all enums in the App\Enum namepsace to register them with GraphQL
        $enums = Discover::in(app_path('Enums'))
            ->enums()
                // TODO: Language has a custom implementation remove in #10964
            ->custom(fn (DiscoveredStructure $structure) => $structure->name !== 'Language')
            ->sortBy(Sort::Name)
            ->get();

        /** @var \UnitEnum $enum */
        foreach ($enums as $enum) {
            $name = class_basename($enum);
            $typeRegistry->registerLazy(
                $name,
                static function () use ($name, $enum): EnumType {
                    $values = array_column($enum::cases(), 'name');

                    return new EnumType([
                        'name' => $name,
                        'values' => $values,
                    ]);
                }
            );
        }

        // Discover all enums in the App\Enum namespace that implement the HasLocalization trait
        // and register them as a LocalizedEnum type in GraphQL
        $localizedEnums = Discover::in(app_path('Enums'))
            ->enums()
            ->custom(function (DiscoveredStructure $structure) {
                return in_array(HasLocalization::class, class_uses($structure->getFcqn()));
            })
            ->sortBy(Sort::Name)
            ->get();

        /** @var HasLocalization $enum */
        foreach ($localizedEnums as $enum) {
            $name = class_basename($enum);

            /** @disregard P1003 We don't need to use args or context vars in our resolver */
            $resolver = function ($value, $args, $context, ResolveInfo $info) use ($enum) {
                switch ($info->fieldName) {
                    case 'value': return $value;
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

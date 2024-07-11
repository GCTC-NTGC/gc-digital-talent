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

        foreach ($enums as $enum) {
            $name = class_basename($enum);
            $typeRegistry->registerLazy(
                $name,
                static function () use ($name, $enum): EnumType {
                    /** @disregard P1013, discovered enum types are no inferred but it does have cases method */
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

        foreach ($localizedEnums as $enum) {
            $name = class_basename($enum);

            $typeRegistry->register(
                new ObjectType([
                    'name' => 'Localized'.$name,
                    'fields' => function () use ($typeRegistry, $name): array {
                        return [
                            'value' => Type::nonNull($typeRegistry->get($name)),
                            'label' => Type::nonNull($typeRegistry->get('LocalizedString')),
                        ];
                    },
                    /** @disregard P1003, we don't use these args from function on purpose */
                    'resolveField' => function ($value, array $args, $context, ResolveInfo $info) use ($enum) {
                        switch ($info->fieldName) {
                            case 'value': return $value;
                                /** @disregard P1013, these enums do have the trait with this method */
                            case 'label': return $enum::localizedString($value);
                            default: return null;
                        }

                    },
                ])
            );
        }
    }

    public function register(): void
    {
        $this->app->bind(Operator::class, PostgreSQLOperator::class);
    }
}

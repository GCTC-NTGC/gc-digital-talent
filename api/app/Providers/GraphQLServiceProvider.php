<?php

namespace App\Providers;

use App\GraphQL\Operators\PostgreSQLOperator;
use Illuminate\Support\ServiceProvider;
use GraphQL\Type\Definition\EnumType;
use Nuwave\Lighthouse\WhereConditions\Operator;
use Nuwave\Lighthouse\Schema\TypeRegistry;

enum Language: string
{
    case EN = 'en';
    case FR = 'fr';
}

enum ProvinceOrTerritory
{
    case BRITISH_COLUMBIA;
    case ALBERTA;
    case SASKATCHEWAN;
    case MANITOBA;
    case ONTARIO;
    case QUEBEC;
    case NEW_BRUNSWICK;
    case NOVA_SCOTIA;
    case PRINCE_EDWARD_ISLAND;
    case NEWFOUNDLAND_AND_LABRADOR;
    case YUKON;
    case NORTHWEST_TERRITORIES;
    case NUNAVUT;
}

enum GovEmployeeType
{
    case STUDENT;
    case CASUAL;
    case TERM;
    case INDETERMINATE;
}

class GraphQLServiceProvider extends ServiceProvider
{
    public function boot(TypeRegistry $typeRegistry): void
    {
        function formatDataWithValue($enum)
        {
            $values = array();
            foreach ($enum::cases() as $data) {
                $values[$data->name] = ['value' => $data->value];
            }

            return $values;
        }

        $typeRegistry->registerLazy(
            'Language',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'Language',
                    'values' => formatDataWithValue(Language::class),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'ProvinceOrTerritory',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'ProvinceOrTerritory',
                    'values' => array_column(ProvinceOrTerritory::cases(), 'name'),
                ]);
            }
        );
        $typeRegistry->registerLazy(
            'GovEmployeeType',
            static function (): EnumType {
                return new EnumType([
                    'name' => 'GovEmployeeType',
                    'values' => array_column(GovEmployeeType::cases(), 'name'),
                ]);
            }
        );
    }

    public function register(): void
    {
        $this->app->bind(Operator::class, PostgreSQLOperator::class);
    }
}

<?php

namespace App\Providers;

use App\Discoverers\TypeRegistrarDiscoverer;
use App\GraphQL\Operators\PostgreSQLOperator;
use Illuminate\Support\ServiceProvider;
use Nuwave\Lighthouse\Schema\TypeRegistry;
use Nuwave\Lighthouse\WhereConditions\Operator;

class GraphQLServiceProvider extends ServiceProvider
{
    public function boot(TypeRegistry $typeRegistry): void
    {
        /** @phpstan-var class-string<\App\GraphQL\Types\TypeRegistrarInterface> $registrar */
        foreach (TypeRegistrarDiscoverer::discover() as $registrar) {
            $registrar::register($typeRegistry);
        }
    }

    public function register(): void
    {
        $this->app->bind(Operator::class, PostgreSQLOperator::class);
    }
}

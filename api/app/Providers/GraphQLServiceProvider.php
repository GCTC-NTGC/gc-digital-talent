<?php

namespace App\Providers;

use \App\GraphQL\Operators\PostgreSQLOperator;
use Illuminate\Support\ServiceProvider;
use Nuwave\Lighthouse\WhereConditions\Operator;

class GraphQLServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(Operator::class, PostgreSQLOperator::class);
    }
}


<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * BaseFactory
 *
 * Abstract base for Laravel model factories providing common utility helpers:
 */
abstract class BaseFactory extends Factory
{
    /**
     * Return a random model instance or create one if none exist.
     *
     * @template TModel of \Illuminate\Database\Eloquent\Model
     *
     * @param  class-string<TModel>  $model  Eloquent model class name
     *
     * @phpstan-template TModel of \Illuminate\Database\Eloquent\Model
     *
     * @phpstan-param class-string<TModel> $model
     *
     * @return TModel
     *
     * @phpstan-return TModel
     */
    protected function firstOrCreate(string $model)
    {
        return $model::inRandomOrder()->firstOr(fn () => $model::factory()->create());
    }
}

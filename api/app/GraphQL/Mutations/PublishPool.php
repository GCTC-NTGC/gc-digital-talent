<?php

namespace App\GraphQL\Mutations;

use App\GraphQL\Validators\Mutation\PublishPoolValidator;
use App\Models\Pool;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Nuwave\Lighthouse\Exceptions\ValidationException;

final class PublishPool
{
    /**
     * Publishes the pool.
     *
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $pool = Pool::find($args['id'])
            ->load([
                'classifications',
                'essentialSkills' => function ($query) {
                    $query->withTrashed(); // eager load soft deleted skills too
                },
                'nonessentialSkills' => function ($query) {
                    $query->withTrashed();
                },
            ]);
        $poolValidation = new PublishPoolValidator;
        $validator = Validator::make($pool->toArray(), $poolValidation->rules(), $poolValidation->messages()); // First validate pool before updating.
        if ($validator->fails()) {
            throw new ValidationException($validator->errors()->first(), $validator);
        }
        $dateNow = Carbon::now();
        $pool->update(['published_at' => $dateNow]);

        return $pool;
    }
}

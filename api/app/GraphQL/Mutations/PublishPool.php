<?php

namespace App\GraphQL\Mutations;

use App\GraphQL\Validators\Mutation\PublishPoolValidator;
use App\Models\JobPosterArchive;
use App\Models\Pool;
use Illuminate\Support\Facades\Validator;
use Nuwave\Lighthouse\Exceptions\ValidationException;

final class PublishPool
{
    /**
     * Publishes the pool.
     */
    public function __invoke($_, array $args)
    {
        $pool = Pool::with(JobPosterArchive::$generationEagerLoads)
            ->find($args['id'])
            ->load([
                'classification',
                'essentialSkills' => function ($query) {
                    $query->withTrashed(); // eager load soft deleted skills too
                },
                'nonessentialSkills' => function ($query) {
                    $query->withTrashed();
                },
                'assessmentSteps',
            ]);
        $poolValidation = new PublishPoolValidator();
        $validator = Validator::make($pool->toArray(), $poolValidation->rules(), $poolValidation->messages()); // First validate pool before updating.
        if ($validator->fails()) {
            throw new ValidationException($validator->errors()->first(), $validator);
        }

        $pool->publish();

        return $pool;
    }
}

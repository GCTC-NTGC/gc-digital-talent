<?php

namespace App\GraphQL\Mutations;

use App\GraphQL\Validators\Mutation\ChangePoolClosingDateValidator;
use App\Models\Pool;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Nuwave\Lighthouse\Exceptions\ValidationException;

final class ChangePoolClosingDate
{
    /**
     * Extends the pools closing date.
     *
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $pool = Pool::find($args['id'])->load([
            'essentialSkills' => function ($query) {
                $query->withTrashed(); // eager load soft deleted skills too
            },
            'nonessentialSkills' => function ($query) {
                $query->withTrashed();
            },
        ]);
        $newClosingDate = $args['new_closing_date'];
        $now = Carbon::now();

        // execute if attempting to reopen a pool
        if ($pool->closing_date <= $now) {
            $changePoolClosingDateValidator = new ChangePoolClosingDateValidator;
            $validator = Validator::make($pool->toArray(), $changePoolClosingDateValidator->rules(), $changePoolClosingDateValidator->messages());
            if ($validator->fails()) {
                throw new ValidationException($validator->errors()->first(), $validator);
            }
        }

        $pool->update(['closing_date' => $newClosingDate]);

        return $pool;
    }
}

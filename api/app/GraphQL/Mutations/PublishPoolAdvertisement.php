<?php

namespace App\GraphQL\Mutations;

use App\GraphQL\Validators\Mutation\PublishPoolAdvertisementValidator;
use App\Models\Pool;
use Illuminate\Support\Facades\Validator;
use Nuwave\Lighthouse\Exceptions\ValidationException;

final class PublishPoolAdvertisement
{
    /**
     * Publishes the pool advertisement.
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $poolAdvertisement = Pool::find($args['id'])
            ->load(['classifications', 'essentialSkills', 'nonessentialSkills']);
        $poolValidation = new PublishPoolAdvertisementValidator;
        $validator = Validator::make($poolAdvertisement->toArray(), $poolValidation->rules(), $poolValidation->messages()); // First validate pool advertisement before updating.
        if ($validator->fails()) {
            throw new ValidationException($validator->errors()->first(), $validator);
        }
        $poolAdvertisement->update(['is_published' => true]);
        return $poolAdvertisement;
    }
}

<?php

namespace App\GraphQL\Validators\Mutation;

use App\Enums\ErrorCode;
use App\Models\Pool;
use App\Models\WorkStream;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdatePoolValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $pool = Pool::find($this->arg('id'));
        $hasCommunity = ! is_null($pool->community_id);
        $communityWorkStreams = $hasCommunity ?
               WorkStream::query()->where('community_id', $pool->community_id)->pluck('id')
               : [];

        return [
            'pool.workStream.connect' => [
                Rule::when($hasCommunity,
                    [
                        Rule::in($communityWorkStreams),
                    ],
                ),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'pool.workStream.connect.in' => ErrorCode::WORK_STREAM_NOT_IN_COMMUNITY->name,
        ];
    }
}

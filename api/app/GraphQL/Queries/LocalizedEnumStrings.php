<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

final readonly class LocalizedEnumStrings
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {

        $enum = 'App\\Enums\\'.$args['enumName'];

        return array_map(function ($case) use ($enum) {
            return [
                'value' => $case,
                'label' => $enum::localizedString($case),
            ];
        }, array_column($enum::cases(), 'name'));

    }
}

<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

final class LocalizedEnumOptions
{
    public function __invoke($_, array $args)
    {
        $enumClass = 'App\\Enums\\'.$args['enumName'];
        $typename = 'Localized'.$args['enumName'];

        if (! class_exists($enumClass) || ! method_exists($enumClass, 'cases')) {
            throw new \InvalidArgumentException("No enum found for {$args['enumName']}");
        }

        return array_map(function ($case) use ($enumClass, $typename) {
            // Supports both pure and backed enums
            $name = is_object($case) ? $case->name : $case; // Defensive for string name

            return [
                '__typename' => $typename,
                'value' => $name,
                'label' => $enumClass::localizedString($name),
            ];
        }, $enumClass::cases());
    }
}

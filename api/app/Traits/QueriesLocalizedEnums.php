<?php

declare(strict_types=1);

namespace App\Traits;

trait QueriesLocalizedEnums
{
    protected function getEnumClass(string $enumName): string
    {
        $fqcn = "App\\Enums\\{$enumName}";
        if (! class_exists($fqcn)) {
            throw new \InvalidArgumentException("No enum found for $enumName");
        }

        return $fqcn;
    }

    /**
     * Build an array of enum entries for GraphQL.
     *
     * @param  callable  $valueMapper  function($case): mixed
     */
    protected function buildEnumList(string $enumName, callable $valueMapper): array
    {
        $enumClass = $this->getEnumClass($enumName);

        return array_map(function ($case) use ($enumName, $enumClass, $valueMapper) {
            return [
                '__typename' => 'Localized'.$enumName,
                'enum_name' => $enumName,
                'value' => $valueMapper($case),
                'label' => $enumClass::localizedString($case->name),
            ];
        }, $enumClass::cases());
    }
}

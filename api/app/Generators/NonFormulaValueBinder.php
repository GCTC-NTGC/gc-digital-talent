<?php

namespace App\Generators;

use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Cell\DefaultValueBinder;

// Treat "="-leading user text as a string, not a formula. PhpSpreadsheet adds a
// quote-prefix so the literal text shows in Excel without being executed.
class NonFormulaValueBinder extends DefaultValueBinder
{
    public static function dataTypeForValue(mixed $value): string
    {
        $type = parent::dataTypeForValue($value);

        return $type === DataType::TYPE_FORMULA ? DataType::TYPE_STRING : $type;
    }
}

<?php

namespace App\Generators;

use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Cell\DefaultValueBinder;

// Stops auto-detection from typing user text that starts with "=" as a formula.
// Explicit formulas via setCellValueExplicit(..., TYPE_FORMULA) are unaffected.
class NonFormulaValueBinder extends DefaultValueBinder
{
    public static function dataTypeForValue(mixed $value): string
    {
        $type = parent::dataTypeForValue($value);

        return $type === DataType::TYPE_FORMULA ? DataType::TYPE_STRING : $type;
    }
}

<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule as RuleContract;
use Illuminate\Support\Facades\DB;

class CaseInsensitiveUnique implements RuleContract
{
    protected string $table;

    protected string $column;

    protected mixed $ignoreId = null;

    protected $ignoreColumn = 'id';

    public function __construct(string $table, string $column)
    {
        $this->table = $table;
        $this->column = $column;
    }

    public function ignore(mixed $id, $column = 'id')
    {
        $this->ignoreId = $id;
        $this->ignoreColumn = $column;

        return $this;
    }

    public function passes($attribute, $value): bool
    {
        $query = DB::table($this->table)
            ->whereRaw('LOWER('.$this->column.') = ?', [mb_strtolower($value)]);

        if ($this->ignoreId !== null) {
            $query->where($this->ignoreColumn, '!=', $this->ignoreId);
        }

        return ! $query->exists();
    }

    public function message(): string
    {
        return __('validation.unique');
    }
}

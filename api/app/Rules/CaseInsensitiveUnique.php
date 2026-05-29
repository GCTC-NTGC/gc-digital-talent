<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\DB;

class CaseInsensitiveUnique implements ValidationRule
{
    protected string $table;

    protected string $column;

    protected mixed $ignoreId = null;

    protected string $ignoreColumn = 'id';

    public function __construct(string $table, string $column)
    {
        $this->table = $table;
        $this->column = $column;
    }

    public function ignore(mixed $id, string $column = 'id'): self
    {
        $this->ignoreId = $id;
        $this->ignoreColumn = $column;

        return $this;
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value)) {
            return;
        }

        $column = DB::getQueryGrammar()->wrap($this->column);
        $query = DB::table($this->table)
            ->whereRaw("LOWER($column) = ?", [mb_strtolower($value)]);

        if ($this->ignoreId !== null) {
            $query->where($this->ignoreColumn, '!=', $this->ignoreId);
        }

        if ($query->exists()) {
            $fail('validation.unique');
        }
    }
}

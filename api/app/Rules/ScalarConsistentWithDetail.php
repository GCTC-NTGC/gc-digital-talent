<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\DataAwareRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

/**
 * This rule is for values that might be "OTHER" or "SPECIFIC" that requires (or prohibits) a
 * free-form detail field being filled in.
 */
class ScalarConsistentWithDetail implements DataAwareRule, ValidationRule
{
    /**
     * Indicates whether the rule should be implicit.
     *
     * @var bool
     */
    public $implicit = true;

    /**
     * All of the data under validation.
     *
     * @var array<string, mixed>
     */
    protected $data = [];

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct(private string $element, private string $detailFieldName) {}

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // assume the attribute is a sibling of the field being validated
        if (Str::contains($attribute, '.')) {
            $fullyQualifiedDetailFieldName = Str::beforeLast($attribute, '.').'.'.$this->detailFieldName;
        } else {
            $fullyQualifiedDetailFieldName = $this->detailFieldName;
        }

        // if the primary field is missing make sure the detail field is also missing
        if (empty($value) && Arr::has($this->data, $fullyQualifiedDetailFieldName)) {
            $fail('The '.$attribute.' value is missing and requires that '.$this->detailFieldName.' also be missing.');
        }

        // make sure the detail field is present
        if (! empty($value) && ! Arr::has($this->data, $fullyQualifiedDetailFieldName)) {
            $fail('The '.$attribute.' value is present and requires that '.$this->detailFieldName.' also be present.');
        }

        // the scalar matches the element that needs a detail field
        if ($value == $this->element) {
            // check that detail field is not empty
            if (empty(Arr::get($this->data, $fullyQualifiedDetailFieldName))) {
                $fail('The '.$attribute.' value is '.$this->element.' so '.$this->detailFieldName.' must not be empty.');
            }
        }

        // the scalar is present but does not match the element that needs a detail field
        if (! empty($value) && $value != $this->element) {
            // check that the detail field is empty
            if (! empty(Arr::get($this->data, $fullyQualifiedDetailFieldName))) {
                $fail('The '.$attribute.' value is '.$this->element.' so '.$this->detailFieldName.' must be empty.');
            }
        }
    }

    /**
     * Set the data under validation.
     *
     * @param  array<string, mixed>  $data
     */
    public function setData(array $data): static
    {
        $this->data = $data;

        return $this;
    }
}

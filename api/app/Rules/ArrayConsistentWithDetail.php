<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\DataAwareRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

/**
 * This rule is for arrays that might contain an "OTHER" or "SPECIFIC" element that requires (or prohibits) a
 * free-form detail field being filled in.
 */
class ArrayConsistentWithDetail implements DataAwareRule, ValidationRule
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
        if (! is_array($value) && ! empty(Arr::get($this->data, $fullyQualifiedDetailFieldName))) {
            $fail('The '.$attribute.' array is missing and requires that '.$this->detailFieldName.' also be empty.');
        }

        // make sure the detail field is present
        if (is_array($value) && ! Arr::has($this->data, $fullyQualifiedDetailFieldName)) {
            $fail('The '.$attribute.' array is present and requires that '.$this->detailFieldName.' also be present.');
        }

        // the array is present and contains the element that needs a detail field
        if (is_array($value) && in_array($this->element, $value)) {
            // check that detail field is not empty
            if (empty(Arr::get($this->data, $fullyQualifiedDetailFieldName))) {
                $fail('The '.$attribute.' array contains '.$this->element.' so '.$this->detailFieldName.' must not be empty.');
            }
        }

        // the array is present but does not contain the element that needs a detail field
        if (is_array($value) && ! in_array($this->element, $value)) {
            // check that the detail field is empty
            if (! empty(Arr::get($this->data, $fullyQualifiedDetailFieldName))) {
                $fail('The '.$attribute.' array does not contain '.$this->element.' so '.$this->detailFieldName.' must be empty.');
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

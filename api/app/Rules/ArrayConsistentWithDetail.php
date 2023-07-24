<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\DataAwareRule;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * This rule is for arrays that might contain an "OTHER" or "SPECIFIC" element that requires (or prohibits) a
 * free-form detail field being filled in.
 */
class ArrayConsistentWithDetail implements DataAwareRule, ValidationRule
{
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
    public function __construct(private string $element, private string $detailFieldName)
    {
    }

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $dataFields = reset($this->data);

        // make sure the detail field is present
        if (is_array($value) && !array_key_exists($this->detailFieldName, $dataFields)) {
            $fail('The ' . $attribute . ' array is present and requires that the ' . $this->detailFieldName . ' field must also be present.');
        }

        // the array is present and contains the element that needs a detail field
        if (is_array($value) && in_array($this->element, $value)) {
            // check that detail field is not empty
            if (empty($dataFields[$this->detailFieldName])) {
                $fail('The ' . $attribute . ' array contains the ' . $this->element . ' element so that the ' . $this->detailFieldName . ' field must not be empty.');
            }
        }

        // the array is present but does not contain the element that needs a detail field
        if (is_array($value) && !in_array($this->element, $value)) {
            // check that the detail field is empty
            if (!empty($dataFields[$this->detailFieldName])) {
                $fail('The ' . $attribute . ' array does not contain the ' . $this->element . ' element so the ' . $this->detailFieldName . ' field must be empty.');
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

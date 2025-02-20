<?php

namespace App\GraphQL\Validators;

use App\Rules\IsStatusOrNonStatus;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class UpdateUserAsUserInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'email' => [
                'sometimes',
                'nullable',
                /**
                 * Note: Ignore the email for the user passed
                 * in when executing the mutation so it is not
                 * included in the unique check. This is required
                 * for allowing a user to be updated while the email
                 * remains the same.
                 *
                 * REF: https://laravel.com/docs/9.x/validation#rule-unique
                 */
                Rule::unique('users', 'email')->ignore($this->arg('id'), 'id'),
                Rule::unique('users', 'work_email')->ignore($this->arg('id'), 'id'),
            ],
            'workEmail' => [
                'sometimes',
                'nullable',
                /**
                 * Note: Ignore the email for the user passed
                 * in when executing the mutation so it is not
                 * included in the unique check. This is required
                 * for allowing a user to be updated while the email
                 * remains the same.
                 *
                 * REF: https://laravel.com/docs/9.x/validation#rule-unique
                 */
                Rule::unique('users', 'email')->ignore($this->arg('id'), 'id'),
                Rule::unique('users', 'work_email')->ignore($this->arg('id'), 'id'),
                // Note: Should be kept in sync with the workEmailDomainRegex
                'regex:/@([A-Za-z0-9-]+\.)*(gc\.ca|canada\.ca|elections\.ca|ccc\.ca|canadapost-postescanada\.ca|gg\.ca|scics\.ca|scc-csc\.ca|ccohs\.ca|cchst\.ca|edc\.ca|invcanada\.ca|parl\.ca|telefilm\.ca|bankofcanada\.ca|banqueducanada\.ca|ncc-ccn\.ca|bank-banque-canada\.ca|cef-cce\.ca|cgc\.ca|nfb\.ca|onf\.ca|canadacouncil\.ca|conseildesarts\.ca|humanrights\.ca|droitsdelapersonne\.ca|ingeniumcanada\.org|cjc-ccm\.ca|bdc\.ca|idrc\.ca|museedelhistoire\.ca|historymuseum\.ca|cdic\.ca|sadc\.ca|scc\.ca|clc\.ca|clc-sic\.ca|cntower\.ca|latourcn\.ca)$/i',
            ],
            'sub' => [
                'sometimes',
                'nullable',
                Rule::unique('users', 'sub')->ignore($this->arg('id'), 'id'),
            ],
            'indigenousCommunities' => [new IsStatusOrNonStatus],
        ];
    }

    /**
     * Return the validation messages
     */
    public function messages(): array
    {
        return [
            'email.unique' => 'EmailAddressInUse',
            'workEmail.unique' => 'EmailAddressInUse',
            'sub.unique' => 'SubInUse',
        ];
    }
}

<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

// based on Illuminate\Foundation\Auth\EmailVerificationRequest
class EmailVerificationRequest extends FormRequest
{
    // We're not gating this behind auth so we'll just record the request user and go with that.
    protected User $requestedUser;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $this->requestedUser = User::find((string) $this->route('id'));

        if (is_null($this->requestedUser)) {
            return false;
        }

        if (! hash_equals(sha1($this->requestedUser->getEmailForVerification()), (string) $this->route('hash'))) {
            return false;
        }

        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
        ];
    }

    /**
     * Fulfill the email verification request.
     *
     * @return void
     */
    public function fulfill()
    {
        if (! $this->requestedUser->hasVerifiedEmail()) {
            $this->requestedUser->markEmailAsVerified();
            $this->requestedUser->save();

            event(new Verified($this->requestedUser));
        }
    }

    /**
     * Configure the validator instance.
     *
     * @return \Illuminate\Validation\Validator
     */
    public function withValidator(Validator $validator)
    {
        return $validator;
    }
}

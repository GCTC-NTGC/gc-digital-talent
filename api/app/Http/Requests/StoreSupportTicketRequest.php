<?php

namespace App\Http\Requests;

use App\Support\Sanitizer;
use Illuminate\Foundation\Http\FormRequest;

class StoreSupportTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        $sanitizePlain = fn ($key) => $this->has($key) ? Sanitizer::plain($this->input($key)) : null;

        $this->merge([
            'email' => Sanitizer::plain($this->input('email')),
            'name' => Sanitizer::plain($this->input('name')),
            'subject' => Sanitizer::plain($this->input('subject')),
            'description' => Sanitizer::html($this->input('description'), escape: true),
            // Optional fields:
            'previous_url' => $sanitizePlain('previous_url'),
            'user_agent' => $sanitizePlain('user_agent'),
            'user_id' => $sanitizePlain('user_id'),
        ]);
    }

    public function rules(): array
    {
        return [
            'email' => 'required|email',
            'name' => 'required|string',
            'subject' => 'required|string',
        ];
    }
}

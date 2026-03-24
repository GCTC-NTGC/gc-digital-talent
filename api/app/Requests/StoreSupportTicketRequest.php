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
        $this->merge([
            'email' => Sanitizer::plain($this->input('email')),
            'name' => Sanitizer::plain($this->input('name')),
            'subject' => Sanitizer::plain($this->input('subject')),
            'description' => Sanitizer::html($this->input('description'), escape: true),
            'previous_url' => Sanitizer::plain($this->input('previous_url')),
            'user_agent' => Sanitizer::plain($this->input('user_agent')),
            'user_id' => Sanitizer::plain($this->input('user_id')),
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

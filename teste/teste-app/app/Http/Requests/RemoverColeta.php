<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RemoverColeta extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'id_coleta' => 'required|exists:coleta,id'
        ];
    }

    public function messages()
    {
        return [
            'required'  => 'O campo :attribute é obrigatório.',
            'exists'    => 'A coleta :input não existe.'
        ];
    }
}

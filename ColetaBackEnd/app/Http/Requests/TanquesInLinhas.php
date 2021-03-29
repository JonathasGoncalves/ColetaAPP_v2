<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TanquesInLinhas extends FormRequest
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
            'linhas' => 'required|exists:linha,LINHA|array|min:1'
        ];
    }

    public function messages()
    {
        return [
            'required'  => 'O campo :attribute é obrigatório.',
            'exists'    => 'As linhas informadas não existem.',
            'array'     => 'O input de :attribute deve ser um array.',
            'min'       => 'Pelo menos uma linha deve ser informada.'
        ];
    }
}

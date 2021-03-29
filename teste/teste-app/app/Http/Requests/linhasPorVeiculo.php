<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class linhasPorVeiculo extends FormRequest
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
            'cod_transportadora' => 'required|exists:Motorista_Coleta,COD_TRANSPORTADORA'
        ];
    }

    public function messages()
    {
        return [
            'required'  => 'O campo :attribute é obrigatório.',
            'exists'    => 'A transportadora :input não existe.'
        ];
    }
}

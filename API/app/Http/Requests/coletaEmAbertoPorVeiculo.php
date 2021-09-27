<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class coletaEmAbertoPorVeiculo extends FormRequest
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
            'veiculo' => 'required|exists:coleta,veiculo'
        ];
    }

    public function messages()
    {
        return [
            'required'  => 'O campo :attribute é obrigatório',
            'exists'    => 'O veiculo :input não existe.'
        ];
    }
}

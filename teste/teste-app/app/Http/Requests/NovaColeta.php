<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NovaColeta extends FormRequest
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
            'data'                  => 'required',
            'cod_motorista'         => 'required|exists:Motorista_Coleta,COD_MOTORISTA',
            'odometroI'             => 'required',
            'odometroF'             => 'required',
        ];
    }


    public function messages()
    {
        return [
            'required'  => 'O campo :attribute é obrigatório.',
            'exists'    => 'O :attribute :input não existe.'
        ];
    }
}

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
            'transportador'         => 'required|exists:transportadora,COD_TRANSPORTADORA',
            'data'                  => 'required',
            'motorista'             => 'required|exists:transportadora,COD_MOTORISTA',
            'veiculo'               => 'required|exists:transportadora,VEICULO',
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

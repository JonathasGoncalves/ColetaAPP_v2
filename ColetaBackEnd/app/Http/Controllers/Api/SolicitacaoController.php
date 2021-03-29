<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Model\Solicitacao;

class SolicitacaoController extends Controller
{
    private $solicitacao;
    public function __construct(Solicitacao $solicitacao)
    {
        $this->solicitacao = $solicitacao;
    }
    
    //método que recebe solicitação de acesso. Recebe os dados do aparelho
    //instancia uma solicitacao na base e marca com inválido
    //retorna esse item, que será exibido na tela para aprovação da balança
    public function solicitar_acesso (Request $request) {

        //return $request;

        $solicitacao = [
            'MAC'                   => $request->mac,
            'nome_digitado'         => $request->nome_digitado,
            'password'              => $request->password, 
            'aprovado'              => 'falso'
        ];
        try {
            $nova_solicitacao = Solicitacao::create($solicitacao);
            return $nova_solicitacao;
            //return $coleta;
        } catch (QueryException $e) {
            return $e;
        }
    }


    
}

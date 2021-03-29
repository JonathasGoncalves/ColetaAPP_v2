<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Model\Aparelho; 
use App\Model\Solicitacao;
use Illuminate\Support\Facades\Hash; 
use QrCode;
use App\API\ApiError;


class AparelhoController extends Controller
{
    private $aparelho;
    public function __construct(Aparelho $aparelho)
    {
        $this->aparelho = $aparelho;
    }

    //Chamada após o funcionário da banlança selecionar o motorista e adicionar ao aparelho retornado
    //recebe o id do aparelho e o id do motorista
    public function adicionar_motorista(Request $request) {
        $aparelho = Aparelho::where('id', '=', $request->id_aparelho)
            ->update([
                'cod_motorista' => $request->cod_motorista
            ]);
        if (!$aparelho) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Aparelho não encontrado!']], 4040), 404);
        return response()->json($aparelho);
    }


    //chamado apos a conferencia do qrcode para converter o cadastro em  um aparelho
    //recebe o id da solicitação
    public function aprovar_solicitacao(Request $request) {
        //return QrCode::size(150)->backgroundColor(255,255,255)->generate('00:16:7F:2E:70:73');
        //recuperando a solicitacao
        $solicitacao = Solicitacao::where('id', '=', $request->id_solicitacao)->first();
        if (!$solicitacao) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Aparelho não encontrado!']], 4040), 404);
        //$motorista = Motorista::where('COD_TRANSPORTADORA', '=', $request->cod_motorista);
        //if (!$motorista) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Motorista não encontrado!']], 4040), 404);
        //atualizando a solicitacao como aprovada
        $solicitacao_update = Solicitacao::where('id', '=', $request->id_solicitacao)
            ->update([
                'aprovado' => 'true'
            ]);
        //gerar um aparelho com os dados da solicitacao e das informações inseridas no sistema web
        $aparelho = [
            'password'              => Hash::make($solicitacao->password),
            'MAC'                   => $solicitacao->MAC,
            'cod_motorista'         => $request->cod_motorista,
            'habilitado'            => 'false'
        ];
        try {
            $novo_aparelho = Aparelho::create($aparelho);
            return QrCode::size(250)->backgroundColor(255,255,255)->generate($solicitacao->MAC);
        } catch (QueryException $e) {
            return $e;
        }
    }


    public function habilitar_aparelho(Request $request) {
        $aparelho = Aparelho::where('mac', '=', $request->mac)
            ->update([
                'habilitado' => 'true'
            ]);
        if (!$aparelho) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Aparelho não encontrado!']], 4040), 404);
        return response()->json($aparelho);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\API\ApiError;
use App\Model\Motorista;
use App\Http\Requests\ValidarPlaca;

class MotoristaController extends Controller
{
    private $motorista;
    public function __construct(Motorista $motorista)
    {
        $this->motorista = $motorista;
    }

    public function verificarPlaca(ValidarPlaca $request)
    {
        $data = Motorista::where('PLACA', '=', $request->placa)->first();
        if (!$data) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Placa nÃ£o encontrada!']], 404), 404);
        $motorista = ['motorista' => $data];
        return response()->json($motorista);
    }

    public function reboqueList(ValidarPlaca $request)
    {
        $data = Motorista::where('placa', '=', $request->placa)->first();
        if (!$data) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'A placa nÃ£o foi encontrada!']], 4040), 404);
        return response()->json($data);
    }

    //recebe o cod_motorista e retorna os itens motorista
    public function atualizar_motorista(Request $request) {
        /*
        PRODUª®ªªO
        $motoristas = Motorista::where('COD_TRANSPORTADORA', '=', $request->cod_transportadora)->OrderBy('placa')->get();
        if (count($motoristas) == 0) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Nenhum registro encontrado!']], 4040), 404);
        return response()->json($motoristas);
        */
        $placas = $this->motorista->PlacasPorTransportadora($request->cod_transportadora);
        if (count($placas) == 0) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Nenhum registro encontrado!']], 4040), 404);
        return response()->json($placas);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\API\ApiError;
use App\Model\Motorista;
use App\Http\Requests\ValidarPlaca;
use Illuminate\Support\Facades\Response;

class MotoristaController extends Controller
{
    private $motorista;
    public function __construct(Motorista $motorista)
    {
        $this->motorista = $motorista;
    }

    public function verificarPlaca(Request $request)
    {
        $data = Motorista::where('PLACA', '=', $request->placa)->first();
        if (!$data) return Response::json(['titulo' => 'Placa inválida', 'msg' => 'Placa não encontrada'], 400);
        $motorista = ['motorista' => $data];
        return response()->json($motorista);
    }

    public function reboqueList(Request $request)
    {
        $data = Motorista::where('placa', '=', $request->placa)->first();
        if (!$data) return Response::json(['titulo' => 'Placa inválida', 'msg' => 'A placa informada para reboque não foi encontrada!'], 400);
        return response()->json($data);
    }
    
    //1=Nao;2=Sim
    public function verificarPlacaTransferencia(Request $request)
    {
        $data = Motorista::where('PLACA', '=', $request->placa)->where('TRANSF', '1')->first();
        if (!$data) return Response::json(['titulo' => 'Placa Inválida', 'msg' => 'Esta placa não pode transferir leite!'], 422);
        $motorista = ['motorista' => $data];
        return response()->json($motorista);
    }

    //recebe o cod_motorista e retorna os itens motorista
    public function atualizar_motorista(Request $request) {
        $placas = $this->motorista->PlacasPorTransportadora($request->cod_transportadora);
        if (count($placas) == 0) return Response::json(['titulo' => 'Motorista inválido', 'msg' => 'Motorista não encontrado!'], 400);
        return response()->json($placas);
    }
}

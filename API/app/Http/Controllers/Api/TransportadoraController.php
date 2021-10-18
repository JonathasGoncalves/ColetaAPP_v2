<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\transportadoraResource;
use App\Model\Transportadora;
use App\Model\Motorista;
use App\Model\Motorista_Transportadora;
use Illuminate\Database\QueryException;
use App\API\ApiError;
use App\Http\Requests\ValidarPlaca;

class TransportadoraController extends Controller
{

    private $transportadora;
    public function __construct(Transportadora $transportadora)
    {
        $this->transportadora = $transportadora;
    }

    public function verificarPlaca(ValidarPlaca $request)
    {
        $data = Motorista::where('PLACA', '=', $request->placa)->first();
        if (!$data) return Response::json(['titulo' => 'Placa inválida', 'msg' => 'Placa não encontrada!'], 400);
        $motorista = ['motorista' => $data];
        return response()->json($motorista);
    }
    

    public function transportadora_motorista(Request $request)
    {
        $motorista = Motorista::where('COD_MOTORISTA', '=', $request->cod_motorista)->first();
        if (!$motorista) return Response::json(['titulo' => 'Motorista inválido', 'msg' => 'Motorista não encontrado!'], 400);
        return response()->json($motorista);
    }
    
}

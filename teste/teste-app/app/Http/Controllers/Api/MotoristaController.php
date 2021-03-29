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
        if (!$data) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Placa não encontrada!']], 404), 404);
        $motorista = ['motorista' => $data];
        return response()->json($motorista);
    }

    public function reboqueList(ValidarPlaca $request)
    {
        $data = Motorista::where('TPTANQ', '=', 'R')->where('placa', '=', $request->placa)->first();
        if (!$data) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'A placa não é um reboque!']], 4040), 404);
        return response()->json(['msg' => 'Placa correta!'], 201);
    }
}

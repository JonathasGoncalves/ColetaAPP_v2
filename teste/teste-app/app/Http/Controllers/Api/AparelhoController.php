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

    public function habilitar_aparelho(Request $request)
    {
        $aparelho = Aparelho::where('mac', '=', $request->mac)
            ->update([
                'habilitado' => 'true'
            ]);
        if (!$aparelho) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Aparelho não encontrado!']], 4040), 404);
        return response()->json($aparelho);
    }
}

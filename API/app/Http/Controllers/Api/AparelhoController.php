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
        Solicitacao::where('uuid', $request->uuid)
        ->where('aprovado', 'false')
        ->update(['aprovado' => 'true']);
        
        $aparelho = Aparelho::where('uuid', '=', $request->uuid)
            ->update([
                'habilitado' => 'true',
                'password' => Hash::make($request->password)
            ]);
        if (!$aparelho) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Aparelho não encontrado!']], 4040), 404);
        $aparelho = Aparelho::where('uuid', '=', $request->uuid)->first();
        return response()->json($aparelho);
    }

    
}

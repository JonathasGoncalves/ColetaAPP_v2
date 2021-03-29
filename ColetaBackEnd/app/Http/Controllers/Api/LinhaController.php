<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Model\Linha;
use App\API\ApiError;
use App\Model\Transportadora;
use App\Http\Resources\linhaResource;
use App\Http\Requests\linhasPorVeiculo;

class LinhaController extends Controller
{

    private $linha;
    public function __construct(linha $linha)
    {
        $this->linha = $linha;
    }

    public function linhasPorVeiculo(linhasPorVeiculo $request)
    {
        $transp = Transportadora::where("VEICULO", "=", $request->veiculo)->first();
        if ($transp->linha == NULL) {
            $data = ['linhas' => linhaResource::collection($this->linha->LinhasPorAll())];
        } else {
            $data = ['linhas' => linhaResource::collection($this->linha->LinhasPorIMEI($request->veiculo))];
        }
        return response()->json($data);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Model\Linha;
use App\API\ApiError;
use App\Model\Transportadora;
use App\Http\Resources\linhaResource;
use App\Http\Requests\linhasPorVeiculo;
use Illuminate\Database\QueryException;

class LinhaController extends Controller
{

    private $linha;
    public function __construct(linha $linha)
    {
        $this->linha = $linha;
    }

    //RECEBE O CODIGO DA TRANSPORTADORA
    public function linhasPorVeiculo(Request $request)
    {
        //return $request->cod_transportadora;
        $data = [];
        $temp =[];
        try {
            $temp = linhaResource::collection($this->linha->LinhasPorIMEI($request->cod_transportadora));
            
            if (count($temp) == 0) {
            $data = ['linhas' => linhaResource::collection($this->linha->LinhasPorAll())];
         } else {
            $data = ['linhas' => $temp];
        }
            
        } catch (QueryException $e) {
            return $e;
        }
        
        return response()->json($data);
    }
}

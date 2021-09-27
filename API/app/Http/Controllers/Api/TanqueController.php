<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Model\Tanque;
use App\Model\Linha;
use App\API\ApiError;
use App\Http\Resources\tanqueDescResource;
use App\Http\Resources\lataoPorTanqueDescResource;
use App\Http\Requests\TanquesInLinhas;

class TanqueController extends Controller
{
    private $tanque;
    public function __construct(tanque $tanque)
    {
        $this->tanque = $tanque;
    }

    public function TanquesInLinhas(Request $request)
    {
        $data = ['tanques' => tanqueDescResource::collection($this->tanque->TanquesInLinhas($request->linhas))];
        //return $this->tanque->TanquesInLinhas($request->linhas);
        return response()->json($data);
    }
}

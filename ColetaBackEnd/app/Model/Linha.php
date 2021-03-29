<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Linha extends Model
{
    protected $table = 'linha';

    public function LinhasPorTransportadora($cod_transportadora) {
        $linhas = DB::table('linha')
        ->join('transportadora', 'linha.linha', '=', 'transportadora.linha')
        ->select('linha.linha', 'linha.DESCRICAO')
        ->where('transportadora.cod_transportadora', '=', $cod_transportadora)
        ->get();
        return $linhas;
    }

    public function LinhasPorIMEI($veiculo) {
        $linhas = DB::table('motorista')
        ->join('linha', 'motorista.COD_TRANSPORTADORA', '=', 'linha.TRANSPORTADORA_COD')
        ->select('linha.linha', 'linha.DESCRICAO')
        ->where('motorista.VEICULO', '=', $veiculo)
        ->distinct()
        ->get();
        return $linhas;
    }

    public function LinhasPorAll() {
        $linhas = DB::table('linha')
        ->select('linha.linha', 'linha.DESCRICAO')
        ->distinct()
        ->get();
        return $linhas;
    }

}

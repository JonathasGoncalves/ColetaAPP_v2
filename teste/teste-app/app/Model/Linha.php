<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Linha extends Model
{
    protected $table = 'linha_coleta';

    public function LinhasPorTransportadora($cod_transportadora) {
        $linhas = DB::table('linha_coleta')
        ->join('transportadora', 'linha_coleta.linha', '=', 'transportadora.linha')
        ->select('linha_coleta.linha', 'linha_coleta.DESCRICAO')
        ->where('transportadora.cod_transportadora', '=', $cod_transportadora)
        ->get();
        return $linhas;
    }

    public function LinhasPorIMEI($TRANSPORTADORA_COD) {
        $linhas = DB::table('linha_coleta')
        ->select('linha_coleta.COD', 'linha_coleta.linha')
        ->where('linha_coleta.TRANSPORTADORA_COD', '=', $TRANSPORTADORA_COD)
        ->distinct()
        ->get();
        return $linhas;
    }

    public function LinhasPorAll() {
        $linhas = DB::table('linha_coleta')
        ->select('linha_coleta.COD', 'linha_coleta.linha')
        ->distinct()
        ->get();
        return $linhas;
    }

}

<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Superglobals;

$foo = "Example content";

class Tanque extends Model
{
    
    protected $table = 'tanques';


    public function TanquesPorLinha($cod_linha) {
        $cooperados = DB::table('cooperados')
            ->select('cooperados.codigo', 'cooperados.codigo_cacal', 'cooperados.nome', 'cooperados.MUNICIPIO');

        $todos = DB::table('associados')
        ->select('associados.CODIGO' , 'associados.CODIGO_CACAL', 'associados.NOME', 'associados.MUNICIPIO')
        ->union($cooperados);

        $tanques = DB::table('tanques')
        ->select('tanques.id', 'todos.MUNICIPIO', 'tanques.tanque')
        ->where('tanques.linha', '=', $cod_linha)
        ->where('tanques.DT_DESLIG', '=', null)
        ->where('tanques.TPFOR', '<>', '')
        ->joinSub($todos, 'todos', function ($join) {
            $join->on('tanques.codigo', '=', 'todos.codigo_cacal');
        })
        ->orderBy('tanques.tanque')
        ->distinct()
        ->get();

        return $tanques;
    }

    public function LataoPorTanque($cod_tanque) {
        $cooperados = DB::table('cooperados')
            ->select('cooperados.codigo', 'cooperados.codigo_cacal', 'cooperados.nome', 'cooperados.MUNICIPIO');

        $todos = DB::table('associados')
        ->select('associados.CODIGO' , 'associados.CODIGO_CACAL', 'associados.NOME', 'associados.MUNICIPIO')
        ->union($cooperados);

        $tanques = DB::table('tanques')
        ->select('todos.codigo', 'todos.codigo_cacal', 'todos.nome', 'todos.MUNICIPIO', 'tanques.tanque', 'tanques.linha', 'tanques.latao')
        ->where('tanques.tanque', '=', $cod_tanque)
        ->where('tanques.DT_DESLIG', '=', null)
        ->where('tanques.TPFOR', '<>', '')
        ->joinSub($todos, 'todos', function ($join) {
            $join->on('tanques.codigo', '=', 'todos.codigo_cacal');
        })
        ->distinct()
        ->get();

        return $tanques;
    }

    public function TanquesInLinhas($linhas) {
        //CADA COLETA DEVE TER $quantidade_leite(40) litros e ser feita a cada $dias_coleta
        $quantidade_leite = 40;

        $tanques = DB::table('tanques')
        ->join('linha_coleta', DB::raw('tanques.linha collate utf8_unicode_ci'), '=', 'linha_coleta.COD')
        ->select(
            'tanques.id', 
            'tanques.tanque', 
            'tanques.linha', 
            'tanques.latao', 
            'tanques.codigo', 
            'tanques.codigo_cacal', 
            'tanques.ATUALIZAR_COORDENADA',
            'tanques.TPFOR',
            'linha_coleta.linha as descricao'
            )
        ->whereIn('tanques.linha', $linhas)
        ->where('tanques.DT_DESLIG', '=', null)
        ->where('tanques.TPFOR', '<>', '')
        ->distinct();

        $coleta_data = DB::table('coleta_item')
        ->select(
            DB::raw(
                    'datediff(now(), max(coleta_item.data)) as dias_diff'
            ),
            DB::raw(
                    'max(coleta_item.data) as ultima_coleta'
            ),
            'coleta_item.latao'
        )
        ->join('coleta', 'coleta_item.id_coleta', '=', 'coleta.id')
        ->where('coleta.finalizada', '=', 1)
        ->groupBy(
            'coleta_item.latao'
        );

        $LataoQuant = DB::table('tanques')
        ->select(
                DB::raw(
                    'count(*) as lataoQuant'
                ), 
                //habilitado: 1 se os dias sem coleta forem válidos
                //habilitado: 0 se os dias sem coleta forem inválidos
                DB::raw(
                    'CASE 
                        WHEN (MAX(coleta_data.dias_diff) < 0 OR MAX(coleta_data.dias_diff) IS NULL) THEN 1
                        WHEN MAX(coleta_data.dias_diff) > 2  THEN 0 
                        ELSE 1 END AS habilitado'
                ),
                DB::raw(
                    'CASE 
                        WHEN (MAX(coleta_data.dias_diff) < 0 OR MAX(coleta_data.dias_diff) IS NULL) THEN 0
                        ELSE MAX(coleta_data.dias_diff) END AS dias_diff'
                ),
                DB::raw(
                    'MAX(coleta_data.ultima_coleta) as ultima_coleta'
                ),
                'tanquesList.id', 
                'tanquesList.tanque', 
                'tanquesList.linha', 
                'tanquesList.latao', 
                'tanquesList.codigo', 
                'tanquesList.codigo_cacal', 
                'tanquesList.ATUALIZAR_COORDENADA',
                'tanquesList.TPFOR',
                'tanquesList.descricao'
        )
        ->joinSub($tanques, 'tanquesList', function ($join) {
            $join->on('tanques.tanque', '=', 'tanquesList.tanque');
        })
        ->leftJoinSub($coleta_data, 'coleta_data', function ($join) {
            $join->on('tanques.latao', '=', 'coleta_data.latao');
        })
        ->join('linha_coleta', DB::raw('tanques.linha collate utf8_unicode_ci'), '=', 'linha_coleta.COD')
        ->whereIn('tanques.linha', $linhas)
        ->where('tanques.DT_DESLIG', '=', null)
        ->where('tanques.TPFOR', '<>', '')
        ->groupBy(
            'tanquesList.id',
            'tanquesList.tanque',
            'tanquesList.linha',
            'tanquesList.latao',
            'tanquesList.codigo',
            'tanquesList.codigo_cacal',
            'tanquesList.ATUALIZAR_COORDENADA',
            'tanquesList.TPFOR',
            'tanquesList.descricao'
            )
        ->distinct()
        ->get();
        return $LataoQuant;
    }
}


/*
$tanques = DB::table('tanques')
        ->join('linha', DB::raw('tanques.linha collate utf8_unicode_ci'), '=', 'linha.linha')
        ->select(
            'tanques.id', 
            'tanques.tanque', 
            'tanques.linha', 
            'tanques.latao', 
            'tanques.codigo', 
            'tanques.codigo_cacal', 
            'tanques.ATUALIZAR_COORDENADA',
            'linha.descricao'
            )
        ->whereIn('tanques.linha', $linhas)
        ->where('tanques.DT_DESLIG', '=', null)
        ->distinct();


        ->joinSub($tanques, 'tanquesList', function ($join) {
            $join->on('tanques.tanque', '=', 'tanquesList.tanque');
        })

        */

<?php

namespace App\Model;

use Illuminate\Support\Facades\DB;

use Illuminate\Database\Eloquent\Model;

class Coleta extends Model
{

    protected $table = 'coleta';

    protected $fillable = [
        'finalizada',
        'data',
        'placa',
        'odometroI',
        'odometroF',
        'id_pesagem'
    ];

    /**
     * Coleta tem muitos item_coleta
     */
    public function ItemColeta()
    {
        return $this->hasMany(ItemColeta::class, 'coleta_id', 'id');
    }

    /**
     * Coleta tem muitas observações
     */
    public function Ocorrencia()
    {
        return $this->hasMany(Ocorrencia::class, 'coleta_id', 'id');
    }
    
    public function AtualizarVeiculo($veiculo, $transf) {
        DB::table('Motorista_Coleta')
            ->where('veiculo', $veiculo)
            ->update(['TRANSF' => $transf]);
    }
    
    public function ColetasPorPlacas($placas)
    {
       $coletas = DB::table('coleta')
            ->select('coleta.id')
            ->where('coleta.placa', $placas[0])
            ->where('coleta.finalizada', 0)
            ->orderBy('coleta.id')
            ->first();

            $coletas2 = DB::table('coleta')
            ->select('coleta.id')
            ->where('coleta.placa', $placas[1])
            ->where('coleta.finalizada', 0)
            ->orderBy('coleta.id')
            ->first();
            

        return [$coletas, $coletas2];
    }
    
    public function ItensChale($coletas)
    {
        //{itens[i]["tanque"], itens[i]["latao"], itens[i]["cooperado"], itens[i]["volume"]}
       $volume = DB::table('coleta')
            ->select('coleta_item.tanque', 'coleta_item.latao', 'cooperados.nome', 'coleta_item.volume')
            ->join('coleta_item', 'coleta.id', '=', 'coleta_item.id_coleta')
            ->join('cooperados', 'cooperados.codigo_cacal', '=', 'coleta_item.codigo_cacal')
            ->whereIn('coleta.id', $coletas)
            ->where('coleta_item.importado', 'true')
            ->where('coleta.finalizada', 0)
            ->get();

        return $volume;
    }
    
    public function ColetaEmAbertoChale($placas)
    {
       $coleta1 = DB::table('coleta')
            ->select('coleta.id')
            ->join('coleta_item', 'coleta.id', '=', 'coleta_item.id_coleta')
            ->where('coleta.placa', $placas[0])
            ->where('coleta_item.importado', 'false')
            ->where('coleta_item.tpfor', '<>', 'F')
            ->whereIn('coleta.placa', ['MTC7995', 'AAH2297'])
            ->distinct()
            ->first();
        
        
        $coleta2 = DB::table('coleta')
            ->select('coleta.id')
            ->join('coleta_item', 'coleta.id', '=', 'coleta_item.id_coleta')
            ->where('coleta.placa', $placas[1])
            ->where('coleta_item.importado', 'false')
            ->where('coleta_item.tpfor', '<>', 'F')
            ->whereIn('coleta.placa', ['MTC7995', 'AAH2297'])
            ->distinct()
            ->first();
            
       
        return [$coleta1, $coleta2];
    }
    
    public function TicketsItens($coletas)
    {
        //{itens[i]["tanque"], itens[i]["latao"], itens[i]["cooperado"], itens[i]["volume"]}
       $tickets = DB::table('coleta')
            ->select('coleta_item.ticket')
            ->join('coleta_item', 'coleta.id', '=', 'coleta_item.id_coleta')
            ->whereIn('coleta.id', $coletas)
            ->where('coleta_item.importado', 'true')
            ->where('coleta.finalizada', 0)
            ->distinct()
            ->get();

        return $tickets;
    }
    
    
    
    public function ItensPendentes($coleta)
    {
        //{itens[i]["tanque"], itens[i]["latao"], itens[i]["cooperado"], itens[i]["volume"]}
       $coletas = DB::table('coleta')
            ->select('coleta.id')
            ->join('coleta_item', 'coleta.id', '=', 'coleta_item.id_coleta')
            ->where('coleta.id', $coleta)
            ->where('coleta_item.importado', 'false')
            ->where('coleta.finalizada', 1)
            ->get();

        return $coletas;
    }
    
    

    public function ColetaPorPlaca()
    {
        $coletas = DB::table('coleta')
            ->join('transportadora', 'coleta.transportadora_id', '=', 'transportadora.id')
            ->select('transportadora.linha', 'transportadora.PLACA', 'transportadora.NOME_MOTORISTA', 'coleta.data')
            ->where('coleta.finalizada', '=', 0)
            ->get();

        return $coletas;
    }

    public function RetornaColetaPesagem()
    {
        $coletas = DB::table('coleta')
            ->join('transportadora', 'coleta.transportadora_id', '=', 'transportadora.id')
            ->select('transportadora.linha', 'transportadora.PLACA', 'transportadora.NOME_MOTORISTA', 'coleta.data')
            ->where('coleta.finalizada', '=', 0)
            ->get();

        return $coletas;
    }

    public function ColetaPorId($id_coleta)
    {
        $coleta = DB::table('coleta')
            ->join('transportadora', 'coleta.transportadora_id', '=', 'transportadora.id')
            ->select('coleta.data', 'coleta.transportadora_id', 'transportadora.motorista', 'transportadora.veiculo')
            ->where('coleta.id', '=', $id_coleta)
            ->get();

        return $coleta;
    }

    public function ColetoresAbertos()
    {
        //{itens[i]["tanque"], itens[i]["latao"], itens[i]["cooperado"], itens[i]["volume"]}
       $coletores = DB::table('coleta')
            ->select(
                DB::raw(
                    'sum(coleta_item.volume) as volume'
                ),
                'coleta.id', 'coleta.placa', 'coleta.data'
                )
            ->join('coleta_item', 'coleta.id', '=', 'coleta_item.id_coleta')
            ->where('coleta.finalizada', 0)
            ->groupBy('coleta.id', 'coleta.placa', 'coleta.data')
            ->get();

        return $coletores;
    }

    public function abrir_coletor($id_coletor)
    {
        //{itens[i]["tanque"], itens[i]["latao"], itens[i]["cooperado"], itens[i]["volume"]}
       $coletor = DB::table('coleta')
            ->select(
                'coleta_item.id',
                'coleta.placa',
                'coleta_item.linha',
                'coleta_item.tanque',
                'coleta_item.latao',
                'coleta_item.volume',
                'coleta_item.data',
                'coleta_item.importado'
                )
            ->join('coleta_item', 'coleta.id', '=', 'coleta_item.id_coleta')
            ->where('coleta.finalizada', 0)
            ->where('coleta.id', '=', $id_coletor)
            ->get();

        return $coletor;
    }
}

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
        'chave_motorista',
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
    
    public function ColetasPorPlacas($placas)
    {
       $coletas = DB::table('coleta')
            ->join('Motorista_Coleta', 'coleta.chave_motorista', '=', 'Motorista_Coleta.CHAVE')
            ->select('coleta.id')
            ->where('Motorista_Coleta.placa', $placas[0])
            ->where('coleta.finalizada', 0)
            ->orderBy('coleta.id')
            ->first();

            $coletas2 = DB::table('coleta')
            ->join('Motorista_Coleta', 'coleta.chave_motorista', '=', 'Motorista_Coleta.CHAVE')
            ->select('coleta.id')
            ->where('Motorista_Coleta.placa', $placas[1])
            ->where('coleta.finalizada', 0)
            ->first();
            

        return [$coletas, $coletas2];
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
}

<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Motorista extends Model
{
    protected $table = 'Motorista_Coleta';
    //protected $primaryKey = ['COD_MOTORISTA', 'stock_id'];
    //public $incrementing = false;
    
     public function PlacasPorTransportadora($transportadora)
    {
       $placas = DB::table('Motorista_Coleta')
            ->select('Motorista_Coleta.placa', 'Motorista_Coleta.COD_TRANSPORTADORA')
            ->where('Motorista_Coleta.COD_TRANSPORTADORA', $transportadora)
            ->orderBy('Motorista_Coleta.placa')
            ->distinct()
            ->get();

        return $placas;
    }
}

<?php

namespace App\Http\Livewire;

use Livewire\Component;
use App\Model\Solicitacao;
use App\Model\Aparelho;
use App\Model\Motorista;
use App\Model\Coleta;
use Illuminate\Support\Facades\Hash;
use QrCode;
use App\API\ApiError;
use Illuminate\Database\QueryException;

class Coletores extends Component
{
    public $coletores = [];
    public $coletor = [];
    public $coletaAbertoObj;

    //INICIA O ARRAY DE SOLICITAÇÕES COM AS SOLICITAÇÕES EM ABERTO
    public function mount(Coleta $coletaAbertoObj)
    {
        $this->coletaAbertoObj = $coletaAbertoObj;
        $this->coletores = $this->coletaAbertoObj->ColetoresAbertos();
    }

    public function render()
    {
      return view('livewire.main_coletor')
            ->layout('layouts.coletores');
    }

    public function abrir_coletor ($id_coletor) {
        //$teste = $this->coletaAbertoObj->abrir_coletor($id_coletor);
        //dd($teste);
        $this->coletor = $this->coletaAbertoObj->abrir_coletor($id_coletor);
    }
    
}

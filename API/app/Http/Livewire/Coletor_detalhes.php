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

class Coletor_detalhes extends Component
{
    public $coletor = [];
    public $coletaAbertoObj  = [];
    public $id_coletor = '';

     //INICIA O ARRAY DE SOLICITAÇÕES COM AS SOLICITAÇÕES EM ABERTO
    public function mount(Coleta $coletaAbertoObj, $id_coletor)
    {
        $this->id_coletor = $id_coletor;
        $this->coletaAbertoObj = $coletaAbertoObj;
        //$this->coletores = $this->coletaAbertoObj->ColetoresAbertos();
        $this->coletor = $this->coletaAbertoObj->abrir_coletor($id_coletor);
        //dd($this->coletor);
    }

    public function render()
    {
      return view('livewire.coletor_detalhes_live')
            ->layout('layouts.coletor_detalhes_layout', ['id_coletor' => $this->id_coletor]);
    }

}

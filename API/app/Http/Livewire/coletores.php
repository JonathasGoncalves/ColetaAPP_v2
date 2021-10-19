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
    public $coletaAbertoObj;

    //INICIA O ARRAY DE SOLICITAÇÕES COM AS SOLICITAÇÕES EM ABERTO
    public function mount(Coleta $coletaAbertoObj)
    {
        $this->coletaAbertoObj = $coletaAbertoObj;
        $this->coletores = $this->coletaAbertoObj->ColetoresAbertos();
    }

    public function render()
    {
      return view('livewire.coletores')
            ->extends('layouts.coletores');
    }

}

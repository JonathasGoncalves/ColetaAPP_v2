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

class Menu extends Component
{
    
    public $solicitacoes = [];
    public $coletores = [];
    public $coletor = [];
    public $modo = "";
    public $solicitacao = [];
    public $selecionado = 0;
    public $motoristas = [];
    public $placas = [];
    public $motorista_completo = null;
    public $aprovado = "false";
    public $qrcode;
    public $aparelho;
    public $aprovarBtn = false;
    public $erro = "";
    public $cont_pool = 0;
    public $coletaAbertoObj;
    public $menu = 0; //1 Coletor, 2 solicitações

    //INICIA O ARRAY DE SOLICITAÇÕES COM AS SOLICITAÇÕES EM ABERTO
    public function mount(Coleta $coletaAbertoObj)
    {
        //$this->coletaAbertoObj = $coletaAbertoObj;
        //$this->motoristas = [];
        //$this->solicitacoes = Solicitacao::where('aprovado', 'false')->get();
        //$this->coletores = $this->coletaAbertoObj->ColetoresAbertos();
        //dd($this->coletores[0]->placa);
        //$this->solicitacao = [];
        //$this->aprovado = false;
    }

    public function selecionar_menu($id_menu) {
        if ($id_menu == 1) {
            return redirect()->to('/coletores');
        } else {
            return redirect()->to('/solicitacoes');
        }
        //$this->menu = $id_menu;
    }

    public function render()
    {
         return view('livewire.menu')
            ->layout('layouts.menu');
    }

    public function abrir_coletor ($id_coletor) {
        
    }
}

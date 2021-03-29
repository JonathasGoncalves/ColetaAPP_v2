<?php

namespace App\Http\Livewire;

use Livewire\Component;
use App\Model\Solicitacao;
use App\Model\Aparelho;
use App\Model\Motorista;
use Illuminate\Support\Facades\Hash;
use QrCode;
use App\API\ApiError;
use Illuminate\Database\QueryException;

class Solicitacoes extends Component
{
    public $solicitacoes = [];
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

    //INICIA O ARRAY DE SOLICITAÇÕES COM AS SOLICITAÇÕES EM ABERTO
    public function mount()
    {
        $this->solicitacoes = Solicitacao::where('aprovado', 'false')->get();
        //$this->solicitacao = [];
        //$this->aprovado = false;
    }

    //VERIFICA SE O QRCODE FOI LIDO
    public function atualizar_aparelho()
    {
        //dd("atualizar_aparelho");
        $this->cont_pool++;
        $this->aparelho = Aparelho::find($this->aparelho['id']);
        if ($this->cont_pool >= 150) {
            $this->aparelho = [];
            $this->retornar_erro();
        }
    }

    //FINALIZA A LEITURA DO QRCODE RETORNANDO PARA A TELA DE SOLICITAÇÕES
    public function retornar()
    {
        //PROCESSO FOI CONCLUIDO, PODE SALVAR O MODELO NO BANCO
        //ISSO RETIRA ESSA SOLICITAÇÃO DA LISTA INICIAL
        $solicitacao = Solicitacao::find($this->solicitacao['id']);
        $solicitacao->aprovado = 'true';
        $solicitacao->save();

        $this->solicitacoes = Solicitacao::where('aprovado', 'false')->get();
        $this->solicitacao = [];
    }

    //FINALIZA A LEITURA DO QRCODE RETORNANDO PARA A TELA DE SOLICITAÇÕES
    public function retornar_erro()
    {

        $this->solicitacoes = Solicitacao::where('aprovado', 'false')->get();
        $this->solicitacao = [];
        $this->erro = "";
        $this->motorista_completo = [];
    }

    public function selecionar($id)
    {
        //recupera a solicitação pelo id
        $this->solicitacao = Solicitacao::find($id);
        //recuperar motoristas para o cadastro
        $this->motoristas = Motorista::all()->toArray();
    }

    //Excluir solicitação de acesso
    public function excluir($id)
    {
        //recupera a solicitação pelo id
        //$solicitacao = Solicitacao::find($id);
        //recuperar motoristas para o cadastro
        $solicitacao = Solicitacao::find($id);
        //dd($this->motoristas);
        $solicitacao->delete();
        $this->solicitacoes = Solicitacao::where('aprovado', 'falso')->get();
    }

    public function selecionar_mot($chave)
    {
        $motorista_cod = Motorista::where('CHAVE', '=', $chave)->get();
        //MONTAR UM OBJETO COM O ATRIBUTO PLACAS QUE CONTEM TODAS AS PLACAS DO MOTORISTA
        $placas = [];
        if (count($motorista_cod) == 0) {
            $this->motorista_completo = null;
        } else {
            foreach ($motorista_cod as $motorista) {
                array_push($placas, $motorista->PLACA);
            }
            $motorista_completo = [
                'COD_TRANSPORTADORA'    =>  $motorista_cod[0]->COD_TRANSPORTADORA,
                'COD_MOTORISTA'         =>  $motorista_cod[0]->COD_MOTORISTA,
                'TRANSPORTADORA'        =>  $motorista_cod[0]->TRANSPORTADORA,
                'NOME_MOTORISTA'        =>  $motorista_cod[0]->NOME_MOTORISTA,
                'CPF'                   =>  $motorista_cod[0]->CPF,
                'RG'                    =>  $motorista_cod[0]->RG,
                'CNH'                   =>  $motorista_cod[0]->CNH,
                'TELEFONE'              =>  $motorista_cod[0]->TELEFONE,
                'VEICULO'               =>  $motorista_cod[0]->VEICULO,
                'PLACAS'                =>  $placas,
                'TPTANQ'                =>  $motorista_cod[0]->TPTANQ,
                'CHAVE'                 =>  $motorista_cod[0]->CHAVE
            ];
            $this->motorista_completo = $motorista_completo;
            $this->aprovarBtn = true;
        }
    }

    //APROVAR SOLICITAÇÃO DE ACESSO
    public function aprovar_solicitacao()
    {
        //atualizando a solicitacao como aprovada
        /*$solicitacao = Solicitacao::find($this->solicitacao['id']);
        $solicitacao->aprovado = 'true';
        $solicitacao->save();*/

        $motorista = Motorista::where('COD_TRANSPORTADORA', $this->motorista_completo['COD_MOTORISTA'])->get();
        if (!$motorista) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Motorista não encontrado!']], 4040), 404);
        //gerar um aparelho com os dados da solicitacao e das informações inseridas no sistema web
        $aparelho = [
            'password'              => Hash::make($this->solicitacao['password']),
            'MAC'                   => $this->solicitacao['MAC'],
            'chave_motorista'         => $this->motorista_completo['CHAVE'],
            'habilitado'            => 'false'
        ];
        try {

            //DESABILITANDO POSSIVEIS CADASTROS ANTIGOS DO MESMO APARELHO
            /*Aparelho::where('MAC', $this->solicitacao['MAC'])
                ->update(['habilitado' => "false"]);*/
            Aparelho::where('MAC', $this->solicitacao['MAC'])->delete();
            //CRIANDO NOVO APARELLHO E HABILITADO
            $this->aparelho = Aparelho::create($aparelho);
            $this->aprovado = "true";
            $this->solicitacao['aprovado'] = "true";
        } catch (QueryException $e) {
            if ($e->getCode() == '23000') {
                $this->erro = "Esse aparelho já foi cadastrado! Solicitação: " . $this->solicitacao['id'];
            }
        }
    }

    public function render()
    {
        return view('livewire.main');
    }
}

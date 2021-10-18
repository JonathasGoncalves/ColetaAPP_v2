<?php

namespace App\Http\Controllers\Api;

use Illuminate\Database\QueryException;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\API\ApiError;
use App\Model\Coleta;
use App\Model\Motorista;
use App\Model\ItemColeta;
use App\Model\Ocorrencia;
use App\Http\Resources\itemColetaResource; 
use App\Http\Resources\itemColetaWorkflowResource;
use Illuminate\Console\Scheduling\Schedule;
use Artisan;
use App\Http\Requests\coletaEmAbertoPorVeiculo;
use App\Http\Requests\RemoverColeta;
use App\Http\Requests\NovaColetaItem;
use App\Http\Requests\NovaColeta;

class ColetaController extends Controller
{
    private $coleta;
    public function __construct(coleta $coleta)
    {
        $this->coleta = $coleta;
    }

    public function parametro_litros()
    {
        return response()->json(0);
    }
    
    public function AtualizarVeiculo($veiculo, $transf)
    {
        $veiculo = $this->coleta->AtualizarVeiculo($veiculo, $transf);
        return response()->json("Veiculo atualizado com sucesso!");
    }

    public function FinalizarColetaImport($coleta_veiculo, $coleta_carreta, $id_pesagem)
    {
        //FINALIZA COLETA
        if ($coleta_veiculo <> "0") {
            $coleta = Coleta::where('id', $coleta_veiculo)->get();
            Coleta::where('id', $coleta_veiculo)
                ->update([
                    'id_pesagem'        => $id_pesagem,
                    'finalizada'        => 1,
                ]);
                
                
            //VERIFICA SE FICOU ALGUM ITEM PENDENTE DE IMPORTAÇÃO, SE SIM, CRIA NOVA COLETA PARA ELE
            $coletas_pendentes_obj = $this->coleta->ItensPendentes($coleta_veiculo);
            
            if (count($coletas_pendentes_obj) > 0) {
                $coleta_new = [
                    'finalizada'            => '0',
                    'placa'                 => $coleta[0]->placa,
                    'data'                  => $coleta[0]->data,
                    'odometroI'             => $coleta[0]->odometroI,
                    'odometroF'             => $coleta[0]->odometroF,
                    'id_pesagem'            => '',
                ];
                
                $nova_coleta = Coleta::create($coleta_new);
                ItemColeta::where('id_coleta', $coletas_pendentes_obj[0]->id)->where('importado', 'false')
                ->update([
                    'id_coleta'        => $nova_coleta->id,
                ]);
            }
        }
        
        
        
        if ($coleta_carreta <> "0") {
            //FINALIZA COLETA
            $coleta = Coleta::where('id', $coleta_carreta)->get();
             Coleta::where('id', $coleta_carreta)
                ->update([
                    'id_pesagem'        => $id_pesagem,
                    'finalizada'        => 1,
                ]);
                
            //VERIFICA SE FICOU ALGUM ITEM PENDENTE DE IMPORTAÇÃO, SE SIM, CRIA NOVA COLETA PARA ELE
            $coletas_pendentes_obj = $this->coleta->ItensPendentes($coleta_carreta);
            if (count($coletas_pendentes_obj) > 0) {
                $coleta_new = [
                    'finalizada'            => '0',
                    'placa'                 => $coleta[0]->placa,
                    'data'                  => $coleta[0]->data,
                    'odometroI'             => $coleta[0]->odometroI,
                    'odometroF'             => $coleta[0]->odometroF,
                    'id_pesagem'            => '',
                ];
                $nova_coleta = Coleta::create($coleta_new);
                ItemColeta::where('id_coleta', $coletas_pendentes_obj[0]->id)->where('importado', 'false')
                ->update([
                    'id_coleta'        => $nova_coleta->id,
                ]);
            }
        }
        
        return response()->json("Coletas finalizadas com sucesso!");
    }
    
    public function RecuperarTickets($coleta_veiculo, $coleta_carreta) {
        $tickets = $this->coleta->TicketsItens([$coleta_veiculo, $coleta_carreta]);
        $tickets_array = [];
        foreach($tickets as $ticket) {
            array_push($tickets_array, $ticket->ticket);
        }
        
        $ticketsResp = ['tickets' => $tickets_array];
        return response()->json($ticketsResp);
        
    }
    
    public function RecuperarLinha($coleta_veiculo, $coleta_carreta) {
        $item = ItemColeta::whereIn('id_coleta', [$coleta_veiculo, $coleta_carreta])->first();
        $Resp = ['tickets' => $item->LINHA];
        return response()->json($Resp);
        
    }

    public function EstornoColeta($id_pesagem)
    {
        $coleta_estorno = Coleta::where('id_pesagem', $id_pesagem)->get();
        $coleta = Coleta::where('id_pesagem', '=', $id_pesagem)
            ->update([
                'id_pesagem' => '',
                'finalizada' => 0,
            ]);
        
        $coletas_id = [];
        
        foreach ($coleta_estorno as $coleta) {
            if ($coleta) {
                array_push($coletas_id, $coleta->id);
            }
             
        }
            
        $coleta_item = ItemColeta::whereIn('id_coleta', $coletas_id)
            ->update([
                'importado' => 'false',
                'ticket'    => 'ticket'
            ]);
            
            
        if (!$coleta) return Response::json(['titulo' => 'Coleta inválida', 'msg' => 'Coleta não encontrada!'], 404);
        return response()->json($coleta);
    }

    public function coletaEmAbertoPorMotorista(Request $request)
    {
        $data = Coleta::where('finalizada', '=', 0)->where('placa', '=', $request->placa)->orderBy('data')->first();
        $coletas = ['coleta' => $data];
        return response()->json($coletas);
    }
    
    public function volumeFornecedor($coleta_veiculo, $coleta_carreta)
    {
        $volume = 0;
        $itens = ItemColeta::whereIn('id_coleta', [$coleta_veiculo, $coleta_carreta])->get();
        foreach ($itens as $item_coleta) {
            if ($item_coleta->tpfor == 'F') {
                $volume += $item_coleta->volume;
            }
        }
        $volumeResp = ['volume' => $volume];
        return response()->json($volumeResp);
    }

     public function coletaEmAbertoPorPlaca($motorCod, $placa, $carreta)
    {
        //{motorCod}/{placa}/{carreta} parametros da url
        $data = $this->coleta->ColetasPorPlacas([$placa, $carreta]);
        $coletas_id = [];
        //return $data;
        foreach ($data as $coleta) {
            if ($coleta) {
                array_push($coletas_id, $coleta->id);
            }
             
        }
        $coleta = ['coleta' => $coletas_id];
        return response()->json($coleta);
    }
    
     public function itensChale($placa, $carreta)
    {
        //{motorCod}/{placa}/{carreta} parametros da url
        //(cAliasCab)->DATA, (cAliasCab)->HRENT, (cAliasCab)->VOLU, (cAliasCab)->PLACA, (cAliasCab)->MOTOR, (cAliasCab)->ROTA , (cAliasCab)->HRSAIDA}
        $itens = $this->coleta->ItensChale([$placa, $carreta]);
        if (count($itens) > 0 ) {
            $volume = itemColetaWorkflowResource::collection($this->coleta->ItensChale([$placa, $carreta]));
            $coleta = ['coleta' => $volume];
            return response()->json($coleta);
        } else {
           return Response::json(['titulo' => 'Itens coleta', 'msg' => 'Nenhum item de coleta pendente encontrado!'], 404); 
        }
        
    }
    
     public function coletaEmAbertoChale($placa, $carreta)
    {
        $coletas = $this->coleta->ColetaEmAbertoChale([$placa, $carreta]); 
        
        
        //no maximo 2 coletas em aberto, uma para a placa da julieta e uma para o veiculo
        $coletas_id = array();
        //$coleta_placa = Coleta::where('finalizada', '=', 0)->whereIn('placa', ['MTC7995', 'AAH2297'])->where('placa', $placa)->orderBy('data', 'asc')->first();
        //$coleta_carreta = Coleta::where('finalizada', '=', 0)->whereIn('placa', ['MTC7995', 'AAH2297'])->where('placa', $carreta)->orderBy('data', 'asc')->first();
        //return response()->json($coletas);
        foreach ($coletas as $coleta) {
            if ($coleta) {
                array_push($coletas_id, $coleta->id);
            }
             
        }
        $coleta = ['coleta' => $coletas_id];
        
        
        
        if (count($coletas_id) == 0 ) {
            return Response::json(['titulo' => 'Coletas', 'msg' => 'Nenhuma coleta em aberto encontrada!'], 422);
        } else {
            $coleta_resp = ['coleta' => $coletas_id];
            return response()->json($coleta_resp);
        }
       
    }
    

    public function NovaColeta(NovaColeta $request)
    {
        
        $coleta = [
            'finalizada'            => '0',
            'placa'                 => $request->placa,
            'data'                  => $request->data,
            'odometroI'             => $request->odometroI,
            'odometroF'             => $request->odometroF,
            'id_pesagem'            => '',
        ];

        try {
            $nova_coleta = Coleta::create($coleta);
            return $nova_coleta;
        } catch (QueryException $e) {
            return $e;
        }
    }

    public function RemoverColeta(RemoverColeta $request)
    {
        try {
            $this->coleta->destroy($request->id_coleta);
            return response()->json(['msg' => 'Submissao removida com sucesso!'], 201);
        } catch (QueryException $e) {
            return response()->json(['msg' => 'Atenção! Submissao em aberto sem itens. Contatar TI!'], 201);
        }
    }

    //lista de coleta_item, id_coleta
    public function NovaColetaItem(Request $request)
    {
        //return $request;
        //$testeFilter = [];
        try {
            foreach ($request->coletas as $coleta) {
                /*$novo_item = [
                    'id_coleta'             => $coleta['id_coleta'],
                    'codigo'                => $coleta['codigo'],
                    'codigo_cacal'          => $coleta['codigo_cacal'],
                    'tanque'                => $coleta['tanque'],
                    'latao'                 => $coleta['latao'],
                    'LINHA'                 => $coleta['LINHA'],
                    'lataoQuant'            => $coleta['lataoQuant'],
                    'ATUALIZAR_COORDENADA'  => $coleta['ATUALIZAR_COORDENADA'],
                    'temperatura'           => $coleta['temperatura'],
                    'odometro'              => $coleta['odometro'],
                    'volume'                => $coleta['volume'],
                    'latitude'              => $coleta['latitude'],
                    'longitude'             => $coleta['longitude'],
                    'cod_ocorrencia'        => $coleta['cod_ocorrencia'],
                    'observacao'            => $coleta['observacao'],
                    'data'                  => $coleta['data'],
                    'hora'                  => $coleta['hora'],
                    'boca'                  => $coleta['boca'],
                    'volume_fora_padrao'    => $coleta['volume_fora_padrao']
                ];*/
                $coletaCreate = ItemColeta::create($coleta);
                //array_push($testeFilter, $coleta['id_coleta']);
            }
            //return $request;
            return response()->json(['msg' => 'Submissao realizada com sucesso!'], 201);
        } catch (QueryException $e) {
            return response()->json($e);
        }
    }

    public function FecharColeta($itens_coleta, $ocorrencias)
    {

        try {
            foreach ($itens_coleta as $item_coleta) {
                $novo_item = [
                    'tanque_id'         => $item_coleta['tanque_id'],
                    'quantidade'        => $item_coleta['quantidade'],
                    'hora'              => $item_coleta['hora'],
                    'temperatura'       => $item_coleta['temperatura'],
                    'coleta_id'         => $item_coleta['coleta_id'],
                    'latitude'          => $item_coleta['latitude'],
                    'longitude'         => $item_coleta['longitude'],
                ];
                ItemColeta::create($novo_item);
            }

            foreach ($ocorrencias as $ocorrencia) {
                $novo_item = [
                    'tanque_id'         => $ocorrencia['tanque_id'],
                    'valor'             => $ocorrencia['valor'],
                    'observacao'        => $ocorrencia['observacao'],
                    'data'              => $ocorrencia['data'],
                    'hora'              => $ocorrencia['hora'],
                    'coleta_id'         => $ocorrencia['coleta_id'],
                ];

                Ocorrencia::create($novo_item);
            }
        } catch (QueryException $e) {
            return Response::json(['titulo' => 'Itens coleta', 'msg' => 'Erro ao gerar itens de coleta!'], 422);
        }
    }

    public function marcarItens($coleta_veiculo, $coleta_carreta, $ticket, $funcao)
    {
        $itens = [];
        if ($funcao == 'C') {
            $itens = ItemColeta::whereIn('id_coleta', [$coleta_veiculo, $coleta_carreta])->where('importado', 'false')->where('tpfor', '<>', 'F')->get();
        } else {
            $itens = ItemColeta::whereIn('id_coleta', [$coleta_veiculo, $coleta_carreta])->where('importado', 'false')->get();
        }
        foreach($itens as $item) {
           $coleta_item = ItemColeta::where('id', $item->id)
                ->update([
                    'importado' => 'true',
                    'ticket'    => $ticket
                ]); 
        }
        
        return response()->json(['msg' => 'Itens marcados com sucesso'], 201);
        
    }
    
  
    //recebe o id da coleta
    public function RetornaColetaPesagem($coleta_veiculo, $coleta_carreta, $funcao)
    {
        //{coleta_veiculo}/{coleta_carreta} parametros da url
        /*
        Arquivo coleta
        Linha  Produtor Tanque Latão  Quantidade  hora  Temp   boca 
        000054 000000   000017  001769 00000000229 1634  3,00   1
        */
        
        //se $funcao == C então é import do chalé, logo, não traz os itens de fornecedor
        //fornecedor é importado na pesagem de saida comum
        $coletaAberta = Coleta::whereIn('id', [$coleta_veiculo, $coleta_carreta])->where('finalizada', '<>', '1')->get();
        if (count($coletaAberta) == 0) return Response::json(['titulo' => 'Coleta inválida', 'msg' => 'Coleta não encontrada!'], 404);
        if ($funcao == 'C') {
            $itens = ItemColeta::whereIn('id_coleta', [$coleta_veiculo, $coleta_carreta])->where('importado', 'false')->where('tpfor', '<>', 'F')->get();
        } else {
            $itens = ItemColeta::whereIn('id_coleta', [$coleta_veiculo, $coleta_carreta])->where('importado', 'false')->get();
        }
        
        if (!$itens) return Response::json(['titulo' => 'Itens Coleta', 'msg' => 'Nenhum item para esta coleta'], 404);
        //return $itens;
        $motorista = Motorista::where('placa', '=', $coletaAberta[0]->placa)->first();
        $novaData = str_replace('-', '', $coletaAberta[0]->data);
        $stringArquivo = $novaData .
            str_pad(trim($motorista->COD_TRANSPORTADORA), 6, '0', STR_PAD_LEFT) .
            str_pad(trim($motorista->COD_MOTORISTA), 6, '0', STR_PAD_LEFT) .
            str_pad(trim($motorista->VEICULO), 6, '0', STR_PAD_LEFT);

        $stringArquivo2 = $stringArquivo;
        foreach ($itens as $item) {
            if ($item->volume > 0) {
                $novaHora = substr(str_replace(':', '', $item->hora), 0, 4);
                $tpforEdit = "";
                if (empty($item->tpfor)) {
                    $tpforEdit = "P";
                } else {
                    $tpforEdit = $item->tpfor;
                }
                $formattedTemp = number_format($item->temperatura, 1);
                $stringArquivo2 =  $stringArquivo2 .  "\n" .
                    $item->LINHA .
                    str_pad(trim($item->tanque), 6, '0', STR_PAD_LEFT) .
                    str_pad(trim($item->latao), 6, '0', STR_PAD_LEFT) .
                    str_pad(trim($item->volume), 11, '0', STR_PAD_LEFT) .
                    $novaHora .
                    str_pad(trim($formattedTemp), 4, '0', STR_PAD_LEFT) .
                    '1' .
                    $tpforEdit;
            }
            
        }

        $arquivo = fopen('coletaItem.txt', 'w');
        if ($arquivo == false) {
            return Response::json(['titulo' => 'Arquivo coleta', 'msg' => 'Erro ao gerar arquivo'], 400);
        } else {
            fwrite($arquivo, $stringArquivo2);
            fclose($arquivo);
            return response()->download(public_path('coletaItem.txt'));
        }
    }

    //recebe o id da coleta
    public function RetornaCoordenada($coleta_veiculo, $coleta_carreta)
    {
        /*
        Arquivo coordenadas
        tanque atualiza_coordenada latitude longitude
        */
        $itens = ItemColeta::whereIn('id_coleta', [$coleta_veiculo, $coleta_carreta])->where('importado', 'false')->where('latitude', '<>', '00000000000')->get();
        if (!$itens) return Response::json(['titulo' => 'Itens Coleta', 'msg' => 'Sem itens para esta coleta'], 422);
        $stringArquivo = '';
        foreach ($itens as $item) {
            $stringArquivo =
                $stringArquivo . str_pad(trim($item->tanque), 6, '0', STR_PAD_LEFT)  .
                $item->ATUALIZAR_COORDENADA .
                $item->latitude .
                $item->longitude .  "\n";
              
        }
        $arquivo = fopen('coordenadaItem.txt', 'w');
        if ($arquivo == false) {
            return Response::json(['titulo' => 'Arquivo coordenada', 'msg' => 'Erro ao gerar arquivo'], 400);
        } else {
            fwrite($arquivo, $stringArquivo);
            fclose($arquivo);
            return response()->download(public_path('coordenadaItem.txt'));
        }
    }

    //recebe o id da coleta
    public function RetornaOcorrencia($coleta_veiculo, $coleta_carreta)
    {
        /*
        Arquivo ocorrencias
        linha tanque horario codigo_ocorrencia complemento_obs observacoes 
        */
        $coletaAberta = Coleta::whereIn('id', [$coleta_veiculo, $coleta_carreta])->where('finalizada', '<>', '1')->get();
        if (!$coletaAberta) return Response::json(['Coletas' => 'Nenhuma coleta encontrada!', 'msg' => 'Erro ao gerar arquivo'], 400);
        $itens = ItemColeta::whereIn('id_coleta', [$coleta_veiculo, $coleta_carreta])->where('importado', 'false')->where('cod_ocorrencia', '<>', null)->get();
        if (!$itens) return Response::json(['titulo' => 'Itens coleta', 'msg' => 'Sem itens para esta coleta!'], 400);
        $stringArquivo = '';
        foreach ($itens as $item) {
            if ($item->cod_ocorrencia != '') {
                $novaData = str_replace('-', '', $item->data);
                $novaHora = substr(str_replace(':', '', $item->hora),0,4);
                $stringArquivo =
                    $stringArquivo . str_pad(trim($item->LINHA), 6, '0', STR_PAD_LEFT)  .
                    str_pad(trim($item->tanque), 6, '0', STR_PAD_LEFT)  .
                    $novaData .
                    $novaHora .
                    str_pad(trim($item->cod_ocorrencia), 3, '0', STR_PAD_LEFT) .
                    str_pad(trim($item->complemento_obs), 256, ' ', STR_PAD_RIGHT) .
                    "\n";
            }
        }
        $arquivo = fopen('ocorrenciaItem.txt', 'w');
        if ($arquivo == false) {
            return Response::json(['titulo' => 'Arquivo Ocorrencia', 'msg' => 'Erro ao gerar arquivo'], 400);
        } else {
            fwrite($arquivo, $stringArquivo);
            fclose($arquivo);
            return response()->download(public_path('ocorrenciaItem.txt'));
        }
    }
}

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
        return response()->json(40);
    }

    public function FinalizarColetaImport($coleta_veiculo, $coleta_carreta, $id_pesagem)
    {
        $coleta = Coleta::whereIn('id', [$coleta_veiculo, $coleta_carreta])
            ->update([
                'id_pesagem' => $id_pesagem,
                'finalizada' => 1,
            ]);
        if (!$coleta) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Coleta não encontrada!']], 4040), 404);
        return response()->json($coleta);
    }

    public function EstornoColeta($id_pesagem)
    {
        $coleta = Coleta::where('id_pesagem', '=', $id_pesagem)
            ->update([
                'id_pesagem' => '',
                'finalizada' => 0,
            ]);
        if (!$coleta) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Coleta não encontrada!']], 4040), 404);
        return response()->json($coleta);
    }

    public function coletaEmAberto()
    {
        $data = Coleta::where('finalizada', '=', 0)->get();
        if (sizeof($data) < 1) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Nenhuma coleta em aberto']], 4040), 404);
        $coletas = ['coletas' => $data];
        return response()->json($coletas);
    }

    public function coletaEmAbertoPorMotorista(Request $request)
    {
        $data = Coleta::where('finalizada', '=', 0)->where('placa', '=', $request->placa)->orderBy('data')->first();
        $coletas = ['coleta' => $data];
        return response()->json($coletas);
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

    public function NovaColeta(NovaColeta $request)
    {
        $coleta = [
            'finalizada'            => 0,
            'placa          '       => $request->placa,
            'data'                  => $request->data,
            'odometroI'             => $request->odometroI,
            'odometroF'             => $request->odometroF,
            'id_pesagem'            => '',
        ];

        try {
            $nova_coleta = Coleta::create($coleta);
            return $nova_coleta;
            //return $coleta;
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
            return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Erro ao gerar item para a coleta!']], 1010), 101);
        }
    }


    //recebe o id da coleta
    public function RetornaColetaPesagem($coleta_veiculo, $coleta_carreta)
    {
        //{coleta_veiculo}/{coleta_carreta} parametros da url
        /*
        Arquivo coleta
        Linha  Produtor Tanque Latão  Quantidade  hora  Temp   boca 
        000054 000000   000017  001769 00000000229 1634  3,00   1
        */
        
        $coletaAberta = Coleta::whereIn('id', [$coleta_veiculo, $coleta_carreta])->where('finalizada', '<>', '1')->get();
        if (!$coletaAberta) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Coleta não encontrada!']], 4040), 404);
        $itens = ItemColeta::whereIn('id_coleta', [$coleta_veiculo, $coleta_carreta])->get();
        if (!$itens) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Sem itens para essa coleta!']], 4040), 404);
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
            return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Erro ao gerar arquivo']], 1010), 101);
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
        $coletaAberta = Coleta::whereIn('id', [$coleta_veiculo, $coleta_carreta])->where('finalizada', '<>', '1')->get();
        if (!$coletaAberta) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Coleta não encontrada!']], 4040), 404);
        $itens = ItemColeta::whereIn('id_coleta', [$coleta_veiculo, $coleta_carreta])->get();
        if (!$itens) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Sem itens para essa coleta!']], 4040), 404);
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
            return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Erro ao gerar arquivo']], 1010), 101);
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
        linha tanque horario codigo_ocorrencia volume_fora_padrao observacoes 
        */
        $coletaAberta = Coleta::whereIn('id', [$coleta_veiculo, $coleta_carreta])->where('finalizada', '<>', '1')->get();
        if (!$coletaAberta) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Coleta fechada!']], 4040), 404);
        $itens = ItemColeta::whereIn('id_coleta', [$coleta_veiculo, $coleta_carreta])->get();
        if (!$itens) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Sem itens para essa coleta!']], 4040), 404);
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
                    str_pad(trim($item->volume_fora_padrao), 11, '0', STR_PAD_LEFT) .
                    str_pad(trim($item->observacao), 256, ' ', STR_PAD_RIGHT) .
                    "\n";
            }
        }
        $arquivo = fopen('ocorrenciaItem.txt', 'w');
        if ($arquivo == false) {
            return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Erro ao gerar arquivo']], 1010), 101);
        } else {
            fwrite($arquivo, $stringArquivo);
            fclose($arquivo);
            return response()->download(public_path('ocorrenciaItem.txt'));
        }
    }
}

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

    public function parametro_litros(){
        return response()->json(40);
    }

    public function FinalizarColetaImport($id_coleta, $id_pesagem)
    {
        $coleta = Coleta::where('id', '=', $id_coleta)
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
        $data = Coleta::where('finalizada', '=', 0)->where('motorista_id', '=', $request->motorista_id)->orderBy('data')->first();
        $coletas = ['coleta' => $data];
        return response()->json($coletas);
    }

    public function coletaEmAbertoPorPlaca($placa)
    {
        $motorista = Motorista::where('placa', '=', $placa)->first();
        if (!$transportadora) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Motorista não encontrado!']], 4040), 404);
        $data = Coleta::where('finalizada', '=', 0)->where('motorista_id', '=', $motorista->motorista_id)->orderBy('data')->first();
        if (!$data) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Coleta não encontrada!']], 4040), 404);
        $coleta = ['coleta' => $data];
        return response()->json($coleta);
    }

    public function NovaColeta(NovaColeta $request)
    {
        $coleta = [
            'finalizada'            => 0,
            'motorista_id'          => $request->transportador,
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
    public function RetornaColetaPesagem($id_coleta)
    {

        /*
        Arquivo coleta
        Linha  Produtor Tanque Latão  Quantidade  hora  Temp   boca 
        000054 000000   000017  001769 00000000229 1634  3,00   1
        */

        $coletaAberta = Coleta::where('id', '=', $id_coleta)->where('finalizada', '<>', '1')->first();
        if (!$coletaAberta) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Coleta fechada!']], 4040), 404);
        $itens = ItemColeta::where('id_coleta', '=', $id_coleta)->get();
        //return $itens;

        if (!$itens) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Sem itens para essa coleta!']], 4040), 404);
        //return $itens;
        $coleta = Coleta::where('id', '=', $id_coleta)->first();
        if (!$coleta) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Coleta não encontrada!']], 4040), 404);
        $motorista = Motorista::where('COD_MOTORISTA', '=', $coleta->id_motorista)->first();
        $novaData = str_replace('-', '', $coleta->data);
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
    public function RetornaCoordenada($id_coleta)
    {
        /*
        Arquivo coordenadas
        tanque atualiza_coordenada latitude longitude
        */
        $coletaAberta = Coleta::where('id', '=', $id_coleta)->where('finalizada', '<>', '1')->first();
        if (!$coletaAberta) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Coleta fechada!']], 4040), 404);
        $itens = ItemColeta::where('id_coleta', '=', $id_coleta)->get();
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
    public function RetornaOcorrencia($id_coleta)
    {
        /*
        Arquivo ocorrencias
        linha tanque horario codigo_ocorrencia volume_fora_padrao observacoes 
        */
        $coletaAberta = Coleta::where('id', '=', $id_coleta)->where('finalizada', '<>', '1')->first();
        if (!$coletaAberta) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Coleta fechada!']], 4040), 404);
        $itens = ItemColeta::where('id_coleta', '=', $id_coleta)->get();
        if (!$itens) return response()->json(ApiError::errorMassage(['data' => ['msg' => 'Sem itens para essa coleta!']], 4040), 404);
        $stringArquivo = '';
        foreach ($itens as $item) {
            if ($item->cod_ocorrencia != '') {
                $novaData = str_replace('-', '', $item->data);
                $novaHora = str_replace(':', '', $item->hora);
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

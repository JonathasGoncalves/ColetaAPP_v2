<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class itemColetaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
            return [
            'id'                    => $this->id,
            'id_coleta'             => $this->id_coleta,
            'codigo'                => ucwords(strtolower(trim($this->codigo))),
            'codigo_cacal'          => ucwords(strtolower(trim($this->codigo_cacal))),
            'tanque'                => ucwords(strtolower(trim($this->tanque))),
            'latao'                 => ucwords(strtolower(trim($this->latao))),
            'LINHA'                 => ucwords(strtolower(trim($this->LINHA))),
            'lataoQuant'            => $this->lataoQuant,    
            'ATUALIZAR_COORDENADA'  => $this->ATUALIZAR_COORDENADA,
            'temperatura'           => $this->temperatura,
            'odometro'              => $this->odometro,
            'volume'                => $this->volume,
            'latitude'              => $this->latitude,
            'longitude'             => $this->longitude,
            'cod_ocorrencia'        => $this->cod_ocorrencia,
            'descricao'             => $this->DESCRICAO,
            'observacao'            => $this->observacao,
            'data'                  => $this->data,
            'hora'                  => $this->hora,
            'boca'                  => $this->boca,
            'volume_fora_padrao'    => $this->volume_fora_padrao,
        ];
    }
}

<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class itemColetaWorkflowResource extends JsonResource
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
            'tanque'                => str_pad(trim($this->tanque),6,'0',STR_PAD_LEFT),
            'latao'                 => str_pad(trim($this->latao),6,'0',STR_PAD_LEFT),
            'nome'                  => trim($this->nome),    
            'volume'                => $this->volume,
        ];
    }
}

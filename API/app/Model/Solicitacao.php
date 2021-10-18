<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Solicitacao extends Model
{

    use HasFactory;
    protected $fillable = [
        'uuid',
        'nome_digitado',
        'aprovado',
        'data'
    ];

    protected $table = 'solicitacao';

}

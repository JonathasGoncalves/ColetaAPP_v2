<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Solicitacao extends Model
{

    use HasFactory;
    protected $fillable = [
        'MAC',
        'nome_digitado',
        'aprovado',
        'password'
    ];

    protected $table = 'solicitacao';

}

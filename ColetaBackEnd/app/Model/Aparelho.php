<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
//Client ID: 2
//Client secret: haLIpiUlYstnZtGZgq7tWCMYvZVqBrxZI6P0U46a
//cliente usando aparelhos
class Aparelho extends Authenticatable
{
    use HasFactory;
    protected $fillable = [
        'password',
        'MAC',
        'cod_motorista',
        'habilitado'
    ];

    protected $table = 'aparelho';

    public function findForPassport($username)
    {
        return $this->where('MAC', $username)->where('status', 'true')->first();
    }
}


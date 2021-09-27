<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
//Client ID: 2
//Client secret: haLIpiUlYstnZtGZgq7tWCMYvZVqBrxZI6P0U46a
//cliente usando aparelhos
class Aparelho extends Authenticatable
{
    use HasApiTokens, Notifiable, HasFactory;
    protected $fillable = [
        'id',
        'password',
        'uuid',
        'cod_motorista',
        'habilitado'
    ];

    protected $table = 'aparelho';

    public function findForPassport($username)
    {
        return $this->where('uuid', $username)->where('habilitado', 'true')->first();
    }
}

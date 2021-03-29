<?php

use App\Http\Controllers\Api\AparelhoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Providers\RouteServiceProvider;
use App\Http\Controllers\Auth\RegisterController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
//middleware(['web'])->
//ROTAS PROTEGIDAS PELO CLIENT PASSPORT GRANT (SÓ ID E CLIENT_SECRET)

Route::middleware(['client'])->namespace('Api')->name('api.')->group(function () {
    Route::prefix('habilitar')->group(function () {
        Route::post('/solicitar_acesso', 'SolicitacaoController@solicitar_acesso')->name('solicitar_acesso');
        Route::post('/aprovar_solicitacao', 'AparelhoController@aprovar_solicitacao')->name('aprovar_solicitacao');
        Route::post('/habilitar_aparelho', 'AparelhoController@habilitar_aparelho')->name('habilitar_aparelho');
    });
});

//ROTAS PROTEGIDAS PELO CLIENT PASSWORD (ID, CLIENT_SECRET, USERNAME(MAC) E PASSWORD)
Route::middleware(['auth:api'])->namespace('Api')->name('api.')->group(function () {

    Route::prefix('transportadora')->group(function () {
        Route::post('/verificarPlaca', 'MotoristaController@verificarPlaca')->name('verificarPlaca');
        Route::post('/reboqueList', 'MotoristaController@reboqueList')->name('reboqueList');
    });

    Route::prefix('linha')->group(function () {
        Route::post('/linhasPorVeiculo', 'LinhaController@linhasPorVeiculo')->name('linhasPorVeiculo');
    });

    Route::prefix('tanque')->group(function () {
        Route::post('/TanquesInLinhas', 'TanqueController@TanquesInLinhas')->name('TanquesInLinhas');
    });

    Route::prefix('coleta')->group(function () {
        Route::post('/NovaColeta', 'ColetaController@NovaColeta')->name('NovaColeta');
        Route::post('/NovaColetaItem', 'ColetaController@NovaColetaItem')->name('NovaColetaItem');
        Route::post('/coletaEmAbertoPorMotorista', 'ColetaController@coletaEmAbertoPorMotorista')->name('coletaEmAbertoPorMotorista');
        Route::post('/RemoverColeta', 'ColetaController@RemoverColeta')->name('RemoverColeta');
        Route::get('/coletaEmAbertoPorPlaca/{placa}', 'ColetaController@coletaEmAbertoPorPlaca')->name('coletaEmAbertoPorPlaca');
        Route::get('/finalizarColetaImport/{id_coleta}/{id_pesagem}', 'ColetaController@finalizarColetaImport')->name('finalizarColetaImport');
        Route::get('/estornoColeta/{id_pesagem}', 'ColetaController@EstornoColeta')->name('EstornoColeta');
        Route::get('/parametro_litros', 'ColetaController@parametro_litros')->name('parametro_litros');
        Route::get('/RetornaColetaPesagem/{id_coleta}', 'ColetaController@RetornaColetaPesagem')->name('RetornaColetaPesagem'); //recebe id coleta
        Route::post('/RetornaCoordenada/{id_coleta}', 'ColetaController@RetornaCoordenada')->name('RetornaCoordenada'); //recebe id coleta
        Route::get('/coletaEmAberto', 'ColetaController@coletaEmAberto')->name('coletaEmAberto');
        Route::get('/RetornaOcorrencia/{id_coleta}', 'ColetaController@RetornaOcorrencia')->name('RetornaOcorrencia');
    });
});

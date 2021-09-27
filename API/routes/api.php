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
//middleware(['client'])->
Route::namespace('Api')->name('api.')->group(function () {
    Route::prefix('habilitar')->group(function () {
        Route::post('/solicitar_acesso', 'SolicitacaoController@solicitar_acesso')->name('solicitar_acesso');
        Route::post('/aprovar_solicitacao', 'AparelhoController@aprovar_solicitacao')->name('aprovar_solicitacao');
        Route::post('/habilitar_aparelho', 'AparelhoController@habilitar_aparelho')->name('habilitar_aparelho');
    });
    Route::prefix('coleta')->group(function () {
        Route::get('/coletaEmAbertoPorPlaca/{motorCod}/{placa}/{carreta}', 'ColetaController@coletaEmAbertoPorPlaca')->name('coletaEmAbertoPorPlaca');
        Route::get('/finalizarColetaImport/{coleta_veiculo}/{coleta_carreta}/{id_pesagem}', 'ColetaController@finalizarColetaImport')->name('finalizarColetaImport');
        Route::get('/estornoColeta/{id_pesagem}', 'ColetaController@EstornoColeta')->name('EstornoColeta');
        Route::get('/parametro_litros', 'ColetaController@parametro_litros')->name('parametro_litros');
        Route::get('/RetornaColetaPesagem/{coleta_veiculo}/{coleta_carreta}', 'ColetaController@RetornaColetaPesagem')->name('RetornaColetaPesagem'); //recebe id coleta
        Route::get('/RetornaCoordenada/{coleta_veiculo}/{coleta_carreta}', 'ColetaController@RetornaCoordenada')->name('RetornaCoordenada');
        Route::get('/RetornaOcorrencia/{coleta_veiculo}/{coleta_carreta}', 'ColetaController@RetornaOcorrencia')->name('RetornaOcorrencia');
    });
});

//ROTAS PROTEGIDAS PELO CLIENT PASSWORD (ID, CLIENT_SECRET, USERNAME(MAC) E PASSWORD)
//middleware(['auth:api'])->
Route::namespace('Api')->name('api.')->group(function () {

    Route::prefix('transportadora')->group(function () {
        Route::post('/verificarPlaca', 'MotoristaController@verificarPlaca')->name('verificarPlaca');
        Route::post('/reboqueList', 'MotoristaController@reboqueList')->name('reboqueList');
                Route::post('/atualizar_motorista', 'MotoristaController@atualizar_motorista')->name('atualizar_motorista');
                Route::post('/transportadora_motorista', 'TransportadoraController@transportadora_motorista')->name('transportadora_motorista');
                
                
                
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
        Route::get('/parametro_litros', 'ColetaController@parametro_litros')->name('parametro_litros');
         //recebe id coleta
        Route::get('/coletaEmAberto', 'ColetaController@coletaEmAberto')->name('coletaEmAberto');

    });
});

<?php

use Illuminate\Support\Facades\Route;
use App\Http\Livewire\Menu;
use App\Http\Livewire\Solicitacoes;
use App\Http\Livewire\Coletores;
use App\Http\Livewire\Coletor_detalhes;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|


*/
//middleware(['auth:web'])->
Route::middleware(['auth'])->group(function () {
   Route::get('/menu', Menu::class)->name('controlador.menu');
   Route::get('/solicitacoes', Solicitacoes::class)->name('controlador.solicitacoes');
   Route::get('/coletores', Coletores::class)->name('controlador.coletores');
   Route::get('/coletor_detalhes/{id_coletor}', Coletor_detalhes::class)->name('controlador.detalhes');
   /*
   //TELA DE MENU ENTRE OPÇÕES DE VISUALIZAÇÃO
   Route::get('/menu', function () {
      return View::make('layouts.menu');
   })->name('controlador.menu');

   //LISTAGEM DAS SOLICITAÇÕES
   Route::get('/solicitacoes', function () {
      return View::make('layouts.solicitacoes');
   })->name('controlador.solicitacoes');

   //LISTAGEM DOS COLETORES
   Route::get('/coletores', function () {
      return View::make('layouts.coletores');
   })->name('controlador.coletores');

   //DETALHES COLETOR
   Route::get('/coletor_detalhe/{id_coletor}', function ($id_coletor) {
      return View::make('layouts.coletor_detalhe');
   })->name('controlador.coletor_detalhe');
*/
});



Route::namespace('Web')->group(function () {
   //ROTA PARA TELA INICIAL (DEPOIS DO LOGIN A PRIMEIRA TELA JÁ É A LISTA DE SOLICITAÇÕES EM ABERTO)
   Route::get('/termos', function () {
      return View::make('termo.termos');
   })->name('termos');
});

require __DIR__ . '/auth.php';

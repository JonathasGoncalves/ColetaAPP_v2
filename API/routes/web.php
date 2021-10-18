<?php

use Illuminate\Support\Facades\Route;

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
Route::middleware(['auth'])->namespace('Web')->group(function () {

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
});

Route::namespace('Web')->group(function () {
   //ROTA PARA TELA INICIAL (DEPOIS DO LOGIN A PRIMEIRA TELA JÁ É A LISTA DE SOLICITAÇÕES EM ABERTO)
   Route::get('/termos', function () {
      return View::make('termo.termos');
   })->name('termos');
});

require __DIR__ . '/auth.php';

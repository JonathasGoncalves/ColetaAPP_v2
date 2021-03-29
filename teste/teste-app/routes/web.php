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
   //ROTA PARA TELA INICIAL (DEPOIS DO LOGIN A PRIMEIRA TELA JÁ É A LISTA DE SOLICITAÇÕES EM ABERTO)
   Route::get('/solicitacoes', function () {
      return View::make('layouts.list');
   })->name('habilitar.solicitacoes');
});

require __DIR__ . '/auth.php';

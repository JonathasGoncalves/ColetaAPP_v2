<div class="w-full flex justify-center">
  @if ($erro == "")
  @if ($aprovado == "false")
  <form class="w-1/4" wire:submit.prevent="aprovar_solicitacao()">
    <div class="flex flex-col w-full mb-8 mt-2">
      <label class="p-4 font-semibold w-full" for="motorista_identificacao">Identifique o motorista</label>

      <select class="rounded w-full" wire:change="selecionar_mot($event.target.value)">
        <option class="rounded w-full" value="000000"></option>
        @foreach ($motoristas as $motorista)
        <option class="rounded w-full" value="{{$motorista['COD_MOTORISTA']}}">
          {{$motorista['NOME_MOTORISTA']}}
        </option>
        @endforeach
      </select>
    </div>

    @if ($motorista_completo <> null)
      <label class="p-4 font-semibold w-full" for="motorista" for="transportadora">Transportadora:</label><br>
      <input class="w-full mb-4 mt-2 rounded" type="text" id="transportadora" value="{{$motorista_completo['TRANSPORTADORA']}}" disabled><br><br>

      <label class="p-4 font-semibold w-full" for="motorista" for="cpf">CPF:</label><br>
      <input class="w-full mb-4 mt-2 rounded" type="text" id="cpf" value="{{$motorista_completo['CPF']}}" disabled><br><br>

      <label class="p-4 font-semibold w-full" for="motorista" for="rg">RG:</label><br>
      <input class="w-full mb-4 mt-2 rounded" type="text" id="rg" value="{{$motorista_completo['RG']}}" disabled><br><br>

      <label class="p-4 font-semibold w-full" for="motorista" for="cnh">CNH:</label><br>
      <input class="w-full mb-4 mt-2 rounded" type="text" id="cnh" value="{{$motorista_completo['CNH']}}" disabled><br><br>

      <label class="p-4 font-semibold w-full" for="motorista" for="telefone">Telefone:</label><br>
      <input class="w-full mb-4 mt-2 rounded" type="text" id="telefone" value="{{$motorista_completo['TELEFONE']}}" disabled><br><br>

      <label class="font-semibold w-full">Placas</label><br>
      <div class="border border-gray-600 w-full rounded mb-4 mt-2 grid justify-items-start ">
        <ul class="mb-4 list-disc list-inside">
          @foreach ($motorista_completo['PLACAS'] as $placa)
          <li class="ml-4 mt-2 rounded">{{$placa}}</li>
          @endforeach
        </ul>
      </div>
      @endif
      <div class="flex flex-col self-center items-center">

        <div wire:loading>
          <h1 class="text-yellow-500 font-semibold text-2xl animate-pulse mb-8">Carregando...</h1>
        </div>
        @if ($aprovarBtn)
        <input class="rounded bg-yellow-500 w-40 h-14 text-white" type="submit" value="Aprovar">
        @else
        <input disabled class="rounded bg-yellow-500 w-40 h-14 text-white" type="submit" value="Aprovar">
        @endif
      </div>
  </form>
  @else
  @if ($cont_pool < 150) <div wire:poll.750ms="atualizar_aparelho">
</div>
@endif
@if ($aparelho['habilitado'] == 'false')
<div class=" flex items-center flex-col mt-40">
  <h1 class="font-semibold text-2xl mb-8">Leia o QrCode para acessar o aplicativo</h1>
  <div class="h-auto">
    {!! QrCode::size(250)->backgroundColor(255, 255, 255)->generate($solicitacao['uuid']); !!}
  </div>
</div>
@else
<div class="flex items-center flex-col mt-40">
  <h1 class=" font-semibold text-2xl mb-8">Acesso liberado!</h1>
  <button id="btn-aprovar" class="rounded bg-yellow-500 w-40 h-14 text-white" wire:click="retornar()">
    Continuar
  </button>
</div>
@endif
@endif
@else
<div class=" flex items-center flex-col mt-40">
  <h1 class="font-semibold text-2xl mb-8">{{$erro}}</h1>
  <button id="btn-aprovar" class="rounded bg-yellow-500 w-40 h-14 text-white" wire:click="retornar_erro()">
    Continuar
  </button>
</div>
@endif
</div>
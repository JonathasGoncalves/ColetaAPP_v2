<div class="font-serif mt-14">
  <ul class="grid grid-cols-3 list-none p-10 text-3xl p-4">
    <li class="p-4 text-center font-semibold border-2 border-black border-r-0">Solicitante</li>
    <li class="p-4 text-center font-semibold border-2 border-black border-r-0">Data Solicitação</li>
    <li class="p-4 text-center font-semibold border-2 border-black">Ações</li>
    @foreach ($solicitacoes as $solicitacao)
    <li class="p-4 text-center  border-2 border-black border-r-0 border-t-0">{{$solicitacao->nome_digitado}}</li>
    <li class="p-4 text-center  border-2 border-black border-r-0 border-t-0">{{$solicitacao->created_at}}</li>
    <li class="p-4 text-center  border-2 border-black border-t-0">
      <div class="flex flex-row justify-evenly">
        <button wire:click="selecionar({{$solicitacao->id}})">
          <i class="fas fa-check-circle text-green-500"></i>
        </button>
        <button wire:click="excluir({{$solicitacao->id}})">
          <i class="fas fa-trash text-red-500"></i>
        </button>
      </div>
    </li>
    @endforeach
  </ul>
</div>
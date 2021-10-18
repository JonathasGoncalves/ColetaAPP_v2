<div class="font-serif mt-14">
  <ul class="grid grid-cols-7 list-none p-10 text-3xl p-4">
    <li class="p-4 text-center font-semibold border-2 border-black border-r-0">Placa</li>
    <li class="p-4 text-center font-semibold border-2 border-black border-r-0">Linha</li>
    <li class="p-4 text-center font-semibold border-2 border-black border-r-0">Tanque</li>
    <li class="p-4 text-center font-semibold border-2 border-black border-r-0">Latão</li>
    <li class="p-4 text-center font-semibold border-2 border-black border-r-0">Volume</li>
    <li class="p-4 text-center font-semibold border-2 border-black border-r-0">Data Coleta</li>
    <li class="p-4 text-center font-semibold border-2 border-black">Importado</li>
    @foreach ($coletor as $item_coletor)
    <li class="p-4 text-center  border-2 border-black border-r-0 border-t-0">{{$item_coletor->placa}}</li>
    <li class="p-4 text-center  border-2 border-black border-r-0 border-t-0">{{$item_coletor->linha}}</li>
    <li class="p-4 text-center  border-2 border-black border-r-0 border-t-0">{{$item_coletor->tanque}}</li>
    <li class="p-4 text-center  border-2 border-black border-r-0 border-t-0">{{$item_coletor->latao}}</li>
    <li class="p-4 text-center  border-2 border-black border-r-0 border-t-0">{{$item_coletor->volume}}</li>
    <li class="p-4 text-center  border-2 border-black border-r-0 border-t-0">{{$item_coletor->data}}</li>
    <li class="p-4 text-center  border-2 border-black border-r-2 border-t-0">{{$item_coletor->importado}}</li>
    @endforeach
  </ul>
</div>
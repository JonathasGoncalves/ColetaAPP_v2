<div class="font-serif mt-14">
  <ul class="grid grid-cols-4 list-none p-10 text-4xl p-4">
    <li class="p-4 text-center font-semibold border-2 border-black border-r-0">PLaca</li>
    <li class="p-4 text-center font-semibold border-2 border-black border-r-0">Data</li>
    <li class="p-4 text-center font-semibold border-2 border-black border-r-0">Volume</li>
    <li class="p-4 text-center font-semibold border-2 border-black">Verificar</li>
    @foreach ($coletores as $coletor)
    <li class="p-4 text-center  border-2 border-black border-r-0 border-t-0">{{$coletor->placa}}</li>
    <li class="p-4 text-center  border-2 border-black border-r-0 border-t-0">{{$coletor->data}}</li>
    <li class="p-4 text-center  border-2 border-black border-r-0 border-t-0">{{$coletor->volume}}</li>
    <li class="p-4 text-center  border-2 border-black border-t-0">
      <div class="flex flex-row justify-evenly">
        <a href="/coletor_detalhes/{{$coletor->id}}" class="icon-block">
          <i class="fas fa-search text-green-500"></i>
      </a>
       
      </div> 
    </li>  
    @endforeach
  </ul>
</div>

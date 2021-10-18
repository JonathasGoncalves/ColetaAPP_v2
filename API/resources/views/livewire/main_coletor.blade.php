<div class="min-h-screen min-w-full flex justify-center">
  @if($coletor == [])
  @include("livewire.coletores")
  @else
  @include("livewire.coletor_detalhes")
  @endif
</div>
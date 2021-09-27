<div class="min-h-screen min-w-full flex justify-center">
  @if($solicitacao == [])
  @include("livewire.solicitacoes")
  @else
  @include("livewire.edit-solicitacoes")
  @endif
</div>
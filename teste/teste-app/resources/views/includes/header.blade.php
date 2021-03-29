<div class="font-sans relative h-38">
    <h1 class="text-4xl font-semibold text-center p-10 bg-yellow-500 text-white">Controle de Acesso</h1>
    <div class="absolute top-5 right-10 h-16 w-16 text-2xl">
        <form class="absolute mt-0" method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit">
                <i class="fas fa-sign-out-alt text-white w-20 h-20 fa-3x"></i>
            </button>
        </form>
    </div>
</div>
<!doctype html>
<html>

<head>
    @include('includes.head')
    @livewireStyles
</head>

<body>
    <div class="h-full">
        <header>
            @include('includes.header')
        </header>
        <div class="min-h-screen min-w-full flex justify-center align-middle text-center">
            <livewire:coletores />
        </div>
        <footer class="font-serif text-lg font-extralight align-middle text-center">
            @include('includes.footer')
        </footer>
    </div>
    @livewireScripts
</body>

</html>
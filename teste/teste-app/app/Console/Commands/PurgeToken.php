<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Artisan;
use Illuminate\Support\Facades\DB;

class PurgeToken extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'purge:token';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Apagar tokens revoke e expires';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        //Artisan::call('passport:purge');
        $hoje = date('Y-m-d H:i:s');
        DB::table('oauth_access_tokens')->where('expires_at', '<', $hoje)->delete();
    }
}

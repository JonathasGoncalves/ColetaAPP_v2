<?php

namespace Database\Seeders;

use App\Models\Canhoto;
use App\Models\Carga;
use App\Models\Transportadora;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        
        $user = User::find(14);
        $user->password = Hash::make('12345678');
        $user->save();

        $user2 = User::find(15);
        $user2->password = Hash::make('12345678');
        $user2->save();
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NavMenu extends Model
{
    use HasFactory;

    protected $table = 'nav_menus';

    protected $fillable = [
        'name',
        'slug',
        'location',
        'items_json',
    ];
}

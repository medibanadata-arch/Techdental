<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LegacyPage extends Model
{
    protected $guarded = [];

    protected $casts = [
        'is_active' => 'boolean',
        'status_code' => 'integer',
    ];
}

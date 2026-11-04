<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PriceSetting extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'faqs' => 'array',
        'robots_index' => 'boolean',
        'robots_follow' => 'boolean',
    ];
}

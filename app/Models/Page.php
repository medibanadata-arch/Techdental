<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'blocks' => 'array',
        'faqs' => 'array',
        'robots_index' => 'boolean',
        'robots_follow' => 'boolean',
    ];
}

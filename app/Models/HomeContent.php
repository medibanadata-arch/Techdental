<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomeContent extends Model
{
    use HasFactory;

    protected $table = 'home_content';

    protected $guarded = [];

    protected $casts = [
        'faqs' => 'array',
        'header_settings' => 'array',
        'footer_settings' => 'array',
        'sections_config' => 'array',
        'homepage_texts' => 'array',
    ];
}

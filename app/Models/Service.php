<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $table = 'services';
    protected $guarded = [];

    protected $casts = [
        'hero_thumbs' => 'array',
        'features' => 'array',
        'pricing_cards' => 'array',
        'results' => 'array',
        'seo_images' => 'array',
        'faqs' => 'array',
        'reviews' => 'array',
    ];
}

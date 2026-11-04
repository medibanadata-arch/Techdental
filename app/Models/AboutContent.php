<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AboutContent extends Model
{
    use HasFactory;

    protected $table = 'about_content';

    protected $guarded = [];

    protected $casts = [
        'services_cards' => 'array',
        'tech_cards' => 'array',
        'why_cards' => 'array',
    ];
}

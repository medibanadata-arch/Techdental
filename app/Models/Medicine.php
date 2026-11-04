<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medicine extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'uses_items' => 'array',
        'side_effects_items' => 'array',
        'warnings' => 'array',
        'gallery' => 'array',
        'faqs' => 'array',
        'author' => 'array',
        'related' => 'array',
        'section_titles' => 'array',
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}

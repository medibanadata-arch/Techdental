<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    use HasFactory;
    
    protected $guarded = [];

    protected $casts = [
        'milestones' => 'array',
        'verified' => 'boolean',
        'faqs' => 'array',
        'robots_index' => 'boolean',
        'robots_follow' => 'boolean',
    ];
}

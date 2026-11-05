<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PatientResponsibility extends Model
{
    use HasFactory;

    protected $fillable = [
        'title_en',
        'title_bn',
        'text_en',
        'text_bn',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];
}


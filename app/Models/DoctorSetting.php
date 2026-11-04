<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DoctorSetting extends Model
{
    use HasFactory;

    protected $table = 'doctor_settings';

    protected $guarded = [];

    protected $casts = [
        'robots_index' => 'boolean',
        'robots_follow' => 'boolean',
        'faqs' => 'array',
    ];
}

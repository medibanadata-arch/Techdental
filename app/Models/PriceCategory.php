<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PriceCategory extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function rows()
    {
        return $this->hasMany(PriceRow::class, 'category_id')->orderBy('sort_order');
    }
}

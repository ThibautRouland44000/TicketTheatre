<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Spectacle extends Model
{
    protected $fillable = [
        'title',
        'description',
        'duration',
        'price',
        'image_url',
        'date_seance',
        'language',
        'age_restriction',
        'hall_id'
    ];

    public function hall()
    {
        return $this->belongsTo(Hall::class);
    }
    
}

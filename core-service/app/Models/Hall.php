<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hall extends Model
{
    protected $fillable = [
        'name',
        'location',
        'capacity',
        'description',
    ];

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function spectacles()
    {
        return $this->hasMany(Spectacle::class);
    }
    
}

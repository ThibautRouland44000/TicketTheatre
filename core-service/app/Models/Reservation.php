<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        'user_id',
        'spectacle_id',
        'seat_number',
        'nbr_places',
        'date',
        'date_seance',
        'status',
        'total_price',
        'hall_id',

    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function spectacle()
    {
        return $this->belongsTo(Spectacle::class);
    }

    public function hall()
    {
        return $this->belongsTo(Hall::class);
    }

}

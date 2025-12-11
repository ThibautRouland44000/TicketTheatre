<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'id', // Important pour répliquer l'ID du core
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Désactiver l'auto-increment car on utilise les IDs du core
    public $incrementing = true;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
        ];
    }
}

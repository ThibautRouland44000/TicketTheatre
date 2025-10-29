<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1. Validation des données
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2. Appel du Core Service pour validation et récupération du profil (communication inter-services)
        // Utilisation du nom du SERVICE COURT (plus fiable en interne)
        $response = Http::post('http://core-service-app:80/api/validate-credentials', [
            'email' => $request->email,
            'password' => $request->password,
        ]);

        // 3. Vérification de la réponse du Core Service
        if ($response->failed() || $response->status() !== 200) {
            // Log de l'erreur pour le débogage
            // dd($response->body());

            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis ne correspondent pas à nos enregistrements, ou le service de vérification est indisponible.'],
            ]);
        }

        // ... (Le reste du code reste inchangé)
        $userData = $response->json();

        $user = User::where('id', $userData['id'])->first();

        if (!$user) {
             $user = User::create([
                 'id' => $userData['id'],
                 'email' => $userData['email'],
                 'password' => 'NOPASS',
             ]);
        }

        $user->tokens()->delete();
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $userData,
        ], 200);
    }
}

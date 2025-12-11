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

        // 2. Appel du Core Service pour validation et récupération du profil complet
        try {
            $response = Http::timeout(10)->post('http://core-service-app:80/api/validate-credentials', [
                'email' => $request->email,
                'password' => $request->password,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Service de validation indisponible',
                'error' => $e->getMessage()
            ], 503);
        }

        // 3. Vérification de la réponse du Core Service
        if ($response->failed() || $response->status() !== 200) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis ne correspondent pas à nos enregistrements.'],
            ]);
        }

        $userData = $response->json();

        // 4. Créer ou mettre à jour l'utilisateur dans auth-service (réplique légère)
        $user = User::updateOrCreate(
            ['id' => $userData['id']], // Utiliser l'ID du core
            [
                'email' => $userData['email'],
                'password' => 'NOPASS', // Pas de vrai mot de passe stocké ici
            ]
        );

        // 5. Supprimer les anciens tokens et en créer un nouveau
        $user->tokens()->delete();
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'token' => $token,
            'user' => $userData, // Retourner les données complètes du core
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie'
        ]);
    }

    public function me(Request $request)
    {
        // Récupérer les infos à jour depuis le core-service
        try {
            $response = Http::timeout(10)
                ->withHeaders(['Accept' => 'application/json'])
                ->get('http://core-service-app:80/api/users/' . $request->user()->id);

            if ($response->successful()) {
                return response()->json([
                    'success' => true,
                    'user' => $response->json()
                ]);
            }
        } catch (\Exception $e) {
            // En cas d'erreur, retourner au moins les infos de base
        }

        return response()->json([
            'success' => true,
            'user' => $request->user()
        ]);
    }
}

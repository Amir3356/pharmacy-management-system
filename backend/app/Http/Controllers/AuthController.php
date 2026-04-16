<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        if (Auth::once($credentials)) {
            $user = Auth::user();

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                ],
                'message' => 'Logged in successfully',
            ]);
        }

        return response()->json([
            'message' => 'Incorrect username or password.',
        ], 401);
    }

    public function logout(Request $request): JsonResponse
    {
        return response()->json(['message' => 'Logged out successfully']);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $username = trim($validated['username']);
        $password = $validated['password'];

        $user = DB::table('users')
            ->select(['id', 'username', 'email', 'password'])
            ->whereRaw('LOWER(username) = LOWER(?)', [$username])
            ->first();

        if ($user && Hash::check($password, $user->password)) {

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

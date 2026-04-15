<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Throwable;

class AuthRecoveryController extends Controller
{
    private const ALLOWED_RECOVERY_USERNAME = 'amirsiraj1995';
    private const ALLOWED_RECOVERY_EMAIL = 'amirsiraj1995@gmail.com';

    public function sendVerificationEmail(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'new_username' => ['required', 'string', 'max:100'],
            'new_password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        $username = strtolower(trim($validated['new_username']));
        $email = self::ALLOWED_RECOVERY_EMAIL;

        if ($username !== self::ALLOWED_RECOVERY_USERNAME) {
            return response()->json([
                'message' => 'Verification email is blocked for this username.',
            ], 403);
        }

        $code = (string) random_int(100000, 999999);

        Cache::put(
            sprintf('recovery_code:%s', $email),
            Hash::make($code),
            now()->addMinutes(10)
        );

        $messageBody = "Your Pharmacy Management System verification code is: {$code}\n\n"
            . "This code will expire in 10 minutes.\n\n"
            . "If you did not request this email, you can ignore it.";

        try {
            Mail::raw($messageBody, function ($message) use ($email): void {
                $message->to($email)
                    ->subject('Pharmacy System Account Recovery Verification');
            });
        } catch (Throwable $exception) {
            return response()->json([
                'message' => 'Unable to send verification email. Please verify SMTP settings.',
                'error' => $exception->getMessage(),
            ], 500);
        }

        return response()->json([
            'message' => 'Verification email sent successfully.',
        ]);
    }

    public function verifyRecoveryCode(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'new_username' => ['required', 'string', 'max:100'],
            'code' => ['required', 'digits:6'],
        ]);

        $username = strtolower(trim($validated['new_username']));
        $email = self::ALLOWED_RECOVERY_EMAIL;

        if ($username !== self::ALLOWED_RECOVERY_USERNAME) {
            return response()->json([
                'message' => 'Verification is blocked for this username.',
            ], 403);
        }

        $cacheKey = sprintf('recovery_code:%s', $email);
        $hashedCode = Cache::get($cacheKey);

        if (! is_string($hashedCode)) {
            return response()->json([
                'message' => 'Verification code has expired. Please request a new code.',
            ], 422);
        }

        if (! Hash::check($validated['code'], $hashedCode)) {
            return response()->json([
                'message' => 'Invalid verification code.',
            ], 422);
        }

        Cache::forget($cacheKey);

        return response()->json([
            'message' => 'Verification code confirmed.',
        ]);
    }
}

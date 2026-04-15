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
    public function sendVerificationEmail(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email:rfc,dns'],
        ]);

        $email = strtolower(trim($validated['email']));
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
}

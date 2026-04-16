<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Throwable;

class AuthRecoveryController extends Controller
{
    private const ALLOWED_RECOVERY_EMAIL = 'amirsiraj1995@gmail.com';

    public function sendVerificationEmail(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'new_username' => ['required', 'string', 'max:100'],
            'new_password' => ['required', 'string', 'min:6', 'confirmed'],
            'recovery_email' => ['required', 'email:rfc,dns'],
        ]);

        $email = strtolower(trim($validated['recovery_email']));

        if ($email !== self::ALLOWED_RECOVERY_EMAIL) {
            return response()->json([
                'message' => 'Verification email is blocked for this email.',
            ], 403);
        }

        $code = (string) random_int(100000, 999999);
        $tokenHash = Hash::make($code);

        Cache::put(
            sprintf('recovery_code:%s', $email),
            $tokenHash,
            now()->addMinutes(10)
        );

        $user = DB::table('users')
            ->select(['id', 'email'])
            ->where('email', $email)
            ->first();

        if (! $user) {
            $fallbackUser = DB::table('users')
                ->select(['id'])
                ->orderBy('id')
                ->first();

            if ($fallbackUser) {
                DB::table('users')
                    ->where('id', $fallbackUser->id)
                    ->update(['email' => $email]);

                $user = DB::table('users')
                    ->select(['id', 'email'])
                    ->where('id', $fallbackUser->id)
                    ->first();
            } else {
                $userId = DB::table('users')->insertGetId([
                    'email' => $email,
                    'username' => 'user_' . Str::lower(Str::random(8)),
                    'password' => Hash::make(Str::random(32)),
                    'created_at' => now(),
                ]);

                $user = (object) [
                    'id' => $userId,
                    'email' => $email,
                ];
            }
        }

        $existingVerification = DB::table('email_verifications')
            ->select(['id'])
            ->where('user_id', $user->id)
            ->first();

        if ($existingVerification) {
            DB::table('email_verifications')
                ->where('id', $existingVerification->id)
                ->update([
                    'password_reset_token' => $tokenHash,
                    'password_reset_token_created_at' => now(),
                    'email_verified_at' => null,
                    'updated_at' => now(),
                ]);
        } else {
            DB::table('email_verifications')->insert([
                'user_id' => $user->id,
                'password_reset_token' => $tokenHash,
                'password_reset_token_created_at' => now(),
                'email_verified_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

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
            'recovery_email' => ['required', 'email:rfc,dns'],
            'code' => ['required', 'digits:6'],
            'new_username' => ['required', 'string', 'max:100'],
            'new_password' => ['required', 'string', 'min:6'],
        ]);

        $email = strtolower(trim($validated['recovery_email']));

        if ($email !== self::ALLOWED_RECOVERY_EMAIL) {
            return response()->json([
                'message' => 'Verification is blocked for this email.',
            ], 403);
        }

        $user = DB::table('users')
            ->select(['id'])
            ->where('email', $email)
            ->first();

        if (! $user) {
            return response()->json([
                'message' => 'No account found for this recovery email.',
            ], 404);
        }

        $verification = DB::table('email_verifications')
            ->select(['id', 'password_reset_token', 'password_reset_token_created_at'])
            ->where('user_id', $user->id)
            ->orderByDesc('id')
            ->first();

        if (! $verification || ! is_string($verification->password_reset_token)) {
            return response()->json([
                'message' => 'Verification code has expired. Please request a new code.',
            ], 422);
        }

        $createdAt = $verification->password_reset_token_created_at
            ? Carbon::parse($verification->password_reset_token_created_at)
            : null;
        $isExpired = ! $createdAt || $createdAt->lt(now()->subMinutes(10));

        if ($isExpired) {
            return response()->json([
                'message' => 'Verification code has expired. Please request a new code.',
            ], 422);
        }

        if (! Hash::check($validated['code'], $verification->password_reset_token)) {
            return response()->json([
                'message' => 'Invalid verification code.',
            ], 422);
        }

        DB::table('users')
            ->where('id', $user->id)
            ->update([
                'username' => trim($validated['new_username']),
                'password' => Hash::make($validated['new_password']),
            ]);

        DB::table('email_verifications')
            ->where('id', $verification->id)
            ->update([
                'email_verified_at' => now(),
                'password_reset_token' => null,
                'password_reset_token_created_at' => null,
                'remember_token' => Str::random(60),
                'updated_at' => now(),
            ]);

        Cache::forget(sprintf('recovery_code:%s', $email));

        return response()->json([
            'message' => 'Verification code confirmed. Login credentials updated successfully.',
        ]);
    }
}

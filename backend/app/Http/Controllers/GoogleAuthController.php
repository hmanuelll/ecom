<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class GoogleAuthController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $user = User::where('email', $googleUser->email)->first();
            $isNew = false;

            if ($user) {
                // Link account
                $user->update(['google_id' => $googleUser->id]);
            } else {
                // Create new user
                $isNew = true;
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'password' => bcrypt(Str::random(24)),
                    'role' => 'customer',
                    'phone' => '' // Handle validation constraint if necessary
                ]);
            }

            // Issue token
            $token = $user->createToken('auth_token')->plainTextToken;

            // Redirect back to frontend
            return redirect(env('FRONTEND_URL', 'http://localhost:3000') . '/auth/callback?token=' . $token . '&is_new=' . ($isNew ? '1' : '0'));

        } catch (\Exception $e) {
            Log::error('Google OAuth Error: ' . $e->getMessage());
            return redirect(env('FRONTEND_URL', 'http://localhost:3000') . '/login?error=oauth_failed');
        }
    }
}

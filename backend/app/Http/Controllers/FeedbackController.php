<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FeedbackController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string',
            'is_anonymous' => 'boolean'
        ]);

        $feedback = Feedback::create([
            'user_id' => $request->is_anonymous ? null : auth('sanctum')->id(),
            'content' => $request->content,
            'is_anonymous' => $request->is_anonymous ?? false,
        ]);

        return response()->json(['message' => 'Feedback submitted successfully', 'feedback' => $feedback], 201);
    }

    public function index()
    {
        $feedbacks = Feedback::with('user')->orderBy('created_at', 'desc')->get();
        return response()->json($feedbacks);
    }
}

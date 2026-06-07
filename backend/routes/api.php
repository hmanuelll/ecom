<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ChatbotController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback']);

// Public Catalog routes
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// Public Feedback Route
Route::post('/feedback', [FeedbackController::class, 'store']);

// Public Chatbot API
Route::post('/chat', [ChatbotController::class, 'sendMessage']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user()->load('addresses');
    });
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::put('/user/address', [AuthController::class, 'updateAddress']);
    Route::put('/user/setup-password', [AuthController::class, 'setupPassword']);
    Route::delete('/user/account', [AuthController::class, 'deleteAccount']);

    // Customer Order routes
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::post('/orders/{id}/payment', [OrderController::class, 'submitPayment']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::put('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    
    // Admin Custom Routes
    Route::get('/admin/users', [UserController::class, 'index']);
    Route::delete('/admin/users/{user}', [UserController::class, 'destroy']);
    Route::get('/admin/feedback', [FeedbackController::class, 'index']);

    // Admin routes
    Route::prefix('admin')->middleware(\App\Http\Middleware\EnsureUserIsAdmin::class)->group(function () {
        Route::apiResource('users', UserController::class);
        Route::apiResource('categories', CategoryController::class)->except(['index', 'show']);
        Route::apiResource('products', ProductController::class)->except(['index', 'show']);
        Route::get('orders', [OrderController::class, 'adminIndex']);
        Route::put('orders/{order}/status', [OrderController::class, 'updateStatus']);
        Route::post('orders/{id}/confirm', [OrderController::class, 'confirmOrder']);
    });
});

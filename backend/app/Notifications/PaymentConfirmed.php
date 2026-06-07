<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentConfirmed extends Notification
{
    use Queueable;

    public $orderId;

    public function __construct($orderId)
    {
        $this->orderId = $orderId;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->subject('Payment Received - Order #' . $this->orderId)
                    ->greeting('Hello ' . $notifiable->name . ',')
                    ->line('We have successfully received your payment for Order #' . $this->orderId . '.')
                    ->line('Your order is now being processed and will be shipped to you soon.')
                    ->action('View Order Status', url('/account/orders'))
                    ->line('Thank you for shopping with TechStore!');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    protected NotificationService $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Display user notifications
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();
        $filter = $request->get('filter', 'all'); // all, unread
        
        $query = Notification::where('user_id', $user->id);

        if ($filter === 'unread') {
            $query->where('is_read', false);
        }

        $notifications = $query->orderBy('created_at', 'desc')
            ->paginate(15);

        $unreadCount = $this->notificationService->getUnreadCount($user);

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
            'filter' => $filter,
            'unreadCount' => $unreadCount,
        ]);
    }

    /**
     * Get notifications for dropdown/header
     */
    public function recent(Request $request)
    {
        $user = Auth::user();
        $limit = $request->get('limit', 5);

        $notifications = Notification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take($limit)
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'type' => $notification->type,
                    'icon' => $notification->icon,
                    'color' => $notification->color,
                    'is_read' => $notification->is_read,
                    'created_at' => $notification->created_at->diffForHumans(),
                ];
            });

        $unreadCount = $this->notificationService->getUnreadCount($user);

        return response()->json([
            'data' => $notifications,
            'unreadCount' => $unreadCount,
        ]);
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(Notification $notification)
    {
        if ($notification->user_id !== Auth::id()) {
            abort(403);
        }

        $this->notificationService->markAsRead($notification);

        return back()->with('success', 'Notification marked as read');
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead()
    {
        $user = Auth::user();
        $this->notificationService->markAllAsRead($user);

        return back()->with('success', 'All notifications marked as read');
    }

    /**
     * Delete notification
     */
    public function delete(Notification $notification)
    {
        if ($notification->user_id !== Auth::id()) {
            abort(403);
        }

        $notification->delete();

        return back()->with('success', 'Notification deleted');
    }

    /**
     * Get unread count
     */
    public function unreadCount()
    {
        $user = Auth::user();
        $count = $this->notificationService->getUnreadCount($user);

        return response()->json(['count' => $count]);
    }
}
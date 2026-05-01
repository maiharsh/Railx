import { Router, Response } from 'express';
import Notification from '../models/Notification';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = Router();


router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const passengerId = (req.user as any).passengerId;
    const unreadOnly = req.query.unread === 'true';

    const filter: any = { passenger_id: passengerId };
    if (unreadOnly) {
      filter.is_read = false;
    }

    const notifications = await Notification.find(filter)
      .sort({ created_at: -1 })
      .limit(50);

    return res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    return res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});


router.put('/:id/read', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { is_read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    return res.json(notification);
  } catch (error) {
    console.error('Mark notification as read error:', error);
    return res.status(500).json({ message: 'Failed to update notification' });
  }
});


router.put('/read-all', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const passengerId = (req.user as any).passengerId;

    await Notification.updateMany(
      { passenger_id: passengerId, is_read: false },
      { is_read: true }
    );

    return res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    return res.status(500).json({ message: 'Failed to update notifications' });
  }
});


router.get('/unread-count', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const passengerId = (req.user as any).passengerId;

    const unreadCount = await Notification.countDocuments({
      passenger_id: passengerId,
      is_read: false
    });

    return res.json({ unread_count: unreadCount });
  } catch (error) {
    console.error('Get unread count error:', error);
    return res.status(500).json({ message: 'Failed to fetch unread count' });
  }
});


router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    return res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    return res.status(500).json({ message: 'Failed to delete notification' });
  }
});

export default router;

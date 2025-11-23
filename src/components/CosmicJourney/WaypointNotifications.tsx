import React, { useState, useEffect } from 'react';

interface Notification {
  id: number;
  waypoint: number;
  total: number;
  title: string;
  isCheat?: boolean;
}

export const WaypointNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const handleWaypointCollected = (e: CustomEvent) => {
      const { waypoint, total, title } = e.detail;
      const newNotification: Notification = {
        id: Date.now(),
        waypoint,
        total,
        title,
      };

      setNotifications(prev => [...prev, newNotification]);

      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, 3000);
    };

    const handleCheatActivated = (e: CustomEvent) => {
      const { message } = e.detail;
      const cheatNotification: Notification = {
        id: Date.now(),
        waypoint: 0,
        total: 0,
        title: message,
        isCheat: true,
      };

      setNotifications(prev => [...prev, cheatNotification]);

      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== cheatNotification.id));
      }, 3000);
    };

    window.addEventListener('waypointCollected', handleWaypointCollected as EventListener);
    window.addEventListener('cheatActivated', handleCheatActivated as EventListener);
    return () => {
      window.removeEventListener('waypointCollected', handleWaypointCollected as EventListener);
      window.removeEventListener('cheatActivated', handleCheatActivated as EventListener);
    };
  }, []);

  return (
    <div className="absolute top-8 right-8 z-[55] flex flex-col gap-2 max-w-xs">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="px-4 py-3 rounded-lg bg-black/30 backdrop-blur-md border border-white/10 animate-slideInRight"
        >
          {notif.isCheat ? (
            <div className="text-sm text-white/90">{notif.title}</div>
          ) : (
            <>
              <div className="text-xs text-gold-primary/80 mb-1">
                Waypoint {notif.waypoint}/{notif.total}
              </div>
              <div className="text-sm text-white/90">{notif.title}</div>
              {notif.waypoint === notif.total && (
                <div className="text-xs text-gold-bright mt-2 pt-2 border-t border-white/10">
                  X-Wing Unlocked
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

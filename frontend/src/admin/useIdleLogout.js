import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as settingsService from '../services/settingsService';
import { useAuth } from '../context/AuthContext';

const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

// Logs the admin out after N minutes with no mouse/keyboard/touch activity in the admin portal.
// The timeout length is pulled from Admin > Settings (adminIdleLogoutMinutes) so it doesn't
// need a code change to adjust.
export default function useIdleLogout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const minutesRef = useRef(30);

  useEffect(() => {
    let cancelled = false;

    settingsService
      .getSettings()
      .then((res) => {
        if (cancelled) return;
        const minutes = Number(res.settings?.adminIdleLogoutMinutes);
        minutesRef.current = Number.isFinite(minutes) && minutes > 0 ? minutes : 30;
        resetTimer();
      })
      .catch(() => resetTimer());

    function resetTimer() {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(onIdle, minutesRef.current * 60 * 1000);
    }

    async function onIdle() {
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, resetTimer));
      await logout();
      toast.error("You've been logged out due to inactivity");
      navigate('/admin/login');
    }

    ACTIVITY_EVENTS.forEach((evt) => window.addEventListener(evt, resetTimer, { passive: true }));

    return () => {
      cancelled = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, resetTimer));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

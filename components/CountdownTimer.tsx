import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

interface CountdownTimerProps {
  deadline: Date;
  onExpire?: () => void;
  style?: object;
}

export function CountdownTimer({ deadline, onExpire, style }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const tick = () => {
      const now = new Date().getTime();
      const target = deadline.getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft('Closed');
        setExpired(true);
        onExpire?.();
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setIsUrgent(diff < 30 * 60 * 1000); // less than 30 min
      setTimeLeft(h > 0 ? `${h}h ${m}m` : `${m}m ${s}s`);
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  return (
    <Text
      style={[
        styles.timer,
        isUrgent && !expired && styles.urgent,
        expired && styles.expired,
        style,
      ]}
    >
      {expired ? '🔒 Closed' : `⏱ ${timeLeft}`}
    </Text>
  );
}

const styles = StyleSheet.create({
  timer: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.info,
    letterSpacing: 0.3,
  },
  urgent: {
    color: Colors.secondary,
  },
  expired: {
    color: '#A0ADB8',
  },
});

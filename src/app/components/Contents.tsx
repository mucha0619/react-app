import React, { useState, useEffect } from 'react';
import styles from '../styles/Contents.module.css';

interface Event {
  ContentsName: string;
  ContentsIcon: string;
  CategoryName: string;
  StartTimes: string[];
}

export default function Contents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/lostark?endpoint=calendar');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getNextEventTime = (times: string[]) => {
    const now = new Date();
    const todayTimes = times.map(time => {
      const [hours, minutes] = time.split(':');
      const eventTime = new Date();
      eventTime.setHours(parseInt(hours, 10));
      eventTime.setMinutes(parseInt(minutes, 10));
      eventTime.setSeconds(0);
      return eventTime;
    });

    const upcomingTimes = todayTimes.filter(time => time > now);
    return upcomingTimes.length > 0 ? upcomingTimes[0] : todayTimes[0];
  };

  const sortedEvents = [...events].sort((a, b) => {
    const timeA = getNextEventTime(a.StartTimes.map(time => time.split('T')[1]));
    const timeB = getNextEventTime(b.StartTimes.map(time => time.split('T')[1]));
    return timeA.getTime() - timeB.getTime();
  });

  if (loading) {
    return <div className={styles.loading}>일정을 불러오는 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.eventGrid}>
        {sortedEvents.map((event, index) => (
          <div key={index} className={styles.eventCard}>
            <div className={styles.eventHeader}>
              <img
                src={event.ContentsIcon || '/fallback-icon.png'}
                alt={event.ContentsName}
                className={styles.eventIcon}
                onError={(e) => {
                  e.currentTarget.src = '/fallback-icon.png';
                }}
              />
              <h3 className={styles.eventTitle}>{event.ContentsName}</h3>
            </div>
            <div className={styles.eventTimes}>
              {event.StartTimes.map((time, timeIndex) => (
                <span key={timeIndex} className={styles.time}>
                  {formatTime(time)}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

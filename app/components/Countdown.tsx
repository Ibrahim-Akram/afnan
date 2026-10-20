import {useEffect, useState} from 'react';
import {useLocale} from '~/lib/i18n';

function parts(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    done: total === 0,
  };
}

/** Counts down to `target`; starts from the server time to avoid a flash. */
export function Countdown({target, serverNow}: {target: string; serverNow: number}) {
  const {t} = useLocale();
  const end = new Date(target).getTime();
  const [now, setNow] = useState(serverNow);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const left = parts(end - now);
  if (left.done) return <p className="countdown__done">{t('gifting.eidMubarak')}</p>;

  const units = [
    ['days', left.days],
    ['hours', left.hours],
    ['minutes', left.minutes],
    ['seconds', left.seconds],
  ] as const;

  return (
    <div className="countdown" role="timer" aria-live="off">
      {units.map(([unit, value]) => (
        <div className="countdown__unit" key={unit}>
          <span className="countdown__value" suppressHydrationWarning>
            {String(value).padStart(2, '0')}
          </span>
          <span className="countdown__label">{t(`gifting.${unit}`)}</span>
        </div>
      ))}
    </div>
  );
}

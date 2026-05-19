import { severityStyles } from '../utils/formatters';

const warningIcons = {
  Elevation: '⛰',
  Weather:   '⛈',
  Wildlife:  '🐻',
  Water:     '💧',
  Permit:    '📋',
  Terrain:   '⚠',
  General:   'ℹ',
};

export default function ElevationWarning({ warning }) {
  const styles = severityStyles[warning.severity] || severityStyles.Info;

  return (
    <div className={`${styles.container} rounded-sm p-4 mb-3`}>
      <div className="flex items-start gap-3">
        <span className="text-lg flex-shrink-0 mt-0.5">
          {warningIcons[warning.type] || '⚠'}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-xs font-body font-semibold uppercase tracking-widest ${styles.text}`}>
              {warning.type}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-body ${styles.badge}`}>
              {warning.severity}
            </span>
          </div>
          <p className={`text-sm font-body leading-relaxed ${styles.text}`}>
            {warning.message}
          </p>
        </div>
      </div>
    </div>
  );
}

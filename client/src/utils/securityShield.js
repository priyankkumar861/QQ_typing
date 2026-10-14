/**
 * QuizLauncher Security Shield
 * Anti-Inspection, F12 Blocker, Right-Click Blocker & Code Protection
 */

export function initSecurityShield() {
  if (typeof window === 'undefined') return;

  // 1. Block Right-Click Context Menu (Inspect, View Source, Save As)
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  }, { capture: true });

  // 2. Block DevTools Keyboard Shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Ctrl+S)
  document.addEventListener('keydown', (e) => {
    const isCtrlOrMeta = e.ctrlKey || e.metaKey;
    const isShift = e.shiftKey;
    const key = e.key ? e.key.toUpperCase() : '';
    const keyCode = e.keyCode || e.which;

    // F12 key
    if (key === 'F12' || keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl + Shift + I (Inspect Element)
    if (isCtrlOrMeta && isShift && (key === 'I' || keyCode === 73)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl + Shift + J (Console)
    if (isCtrlOrMeta && isShift && (key === 'J' || keyCode === 74)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl + Shift + C (Element Inspector)
    if (isCtrlOrMeta && isShift && (key === 'C' || keyCode === 67)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl + U (View Source)
    if (isCtrlOrMeta && (key === 'U' || keyCode === 85)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl + S (Save Page Source)
    if (isCtrlOrMeta && (key === 'S' || keyCode === 83)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, { capture: true });

  // 3. Anti-DevTools Debugger Trap (Freezes debugger if inspected)
  const antiDebug = () => {
    try {
      const start = Date.now();
      // debugger statement triggers break if DevTools is open
      (function() { return false; })['constructor']('debugger')();
      if (Date.now() - start > 100) {
        // DevTools detected: clear sensitive views or redirect
      }
    } catch (e) {}
  };

  // Run antiDebug periodically in production
  if (process.env.NODE_ENV === 'production') {
    setInterval(antiDebug, 1500);
  }

  // 4. Console Security Warning
  try {
    console.log(
      '%cSTOP! %cQuizLauncher Security Shield Active',
      'color: #ef4444; font-size: 32px; font-weight: 900;',
      'color: #3b82f6; font-size: 16px; font-weight: bold;'
    );
    console.log(
      '%cUnauthorized inspection, scraping, or code theft is strictly prohibited.',
      'color: #64748b; font-size: 13px;'
    );
  } catch (e) {}
}

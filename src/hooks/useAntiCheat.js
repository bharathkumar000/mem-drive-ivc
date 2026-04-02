"use client";

import { useEffect, useState } from "react";

export function useAntiCheat(quizId, isEnabled = true) {
  const [warnings, setWarnings] = useState(0);
  const maxWarnings = 3;

  useEffect(() => {
    if (!isEnabled) return;

    // 1 & 2. Visibility and Blur Detection
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        incrementWarning("tab_switch");
      }
    };

    const handleBlur = () => {
      incrementWarning("window_blur");
    };

    // 3. Keyboard Blocking
    const handleKeyDown = (e) => {
      // Prevent copy, paste, cut
      if ((e.ctrlKey || e.metaKey) && ["c", "v", "x"].includes(e.key.toLowerCase())) {
        e.preventDefault();
        showToast("Action restricted during quiz.");
      }
      
      // Prevent dev tools (F12, Ctrl+Shift+I)
      if (e.key === "F12" || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "i")) {
        e.preventDefault();
        showToast("Action restricted during quiz.");
      }

      // Alt+Tab is handled OS-level but usually causes window blur
    };

    // 4. Right Click
    const handleContextMenu = (e) => {
      e.preventDefault();
      showToast("Action restricted during quiz.");
    };

    // 5. Navigation Lock (simplified back button handling)
    const handlePopState = (e) => {
      window.history.pushState(null, "", window.location.href);
      showToast("You cannot go back during the quiz.");
    };
    window.history.pushState(null, "", window.location.href);

    // Event Listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isEnabled, warnings]);

  const [lastViolation, setLastViolation] = useState(null);

  const incrementWarning = (reason) => {
    setWarnings((prev) => {
      const nextWarnings = prev + 1;
      
      const message = nextWarnings >= maxWarnings 
        ? "YOU ARE A CHEATER\nYOU ARE DISQUALIFIED"
        : `Security Advisory: Unauthorized node activity detected (${nextWarnings}/${maxWarnings}).`;
      
      setLastViolation(message);
      
      // Auto-clear violation message after 3 seconds
      setTimeout(() => setLastViolation(null), 3000);

      return nextWarnings;
    });
  };

  const showToast = (message) => {
    setLastViolation(message);
    setTimeout(() => setLastViolation(null), 3000);
  };

  // 6. Copy-paste handlers for inputs
  const inputHandlers = {
    onCopy: (e) => { e.preventDefault(); showToast("Unauthorized operation: Fragment duplication restricted."); },
    onPaste: (e) => { e.preventDefault(); showToast("Unauthorized operation: External data import restricted."); },
    onCut: (e) => { e.preventDefault(); showToast("Unauthorized operation: Fragment extraction restricted."); }
  };

  return { warnings, maxWarnings, inputHandlers, lastViolation };
}

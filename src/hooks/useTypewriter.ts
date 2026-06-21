// src/hooks/useTypewriter.ts
import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to simulate a typewriter animation for strings.
 * Supports skip behavior by exposing a forceComplete function.
 */
export function useTypewriter(
  text: string,
  speed = 25,
  onComplete?: () => void
) {
  const [prevText, setPrevText] = useState(text);
  const [displayedText, setDisplayedText] = useState('');

  // Reset state during render if target text changes (React standard pattern)
  if (text !== prevText) {
    setPrevText(text);
    setDisplayedText('');
  }

  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!text) return;

    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index >= text.length) {
        clearInterval(interval);
        setDisplayedText(text);
        onCompleteRef.current?.();
      } else {
        setDisplayedText(text.slice(0, index));
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  const forceComplete = () => {
    setDisplayedText(text);
    onCompleteRef.current?.();
  };

  return { displayedText, forceComplete };
}

'use client';

import { useState, useEffect, useCallback } from 'react';

export function useClipboardWatcher(onSentenceCopied?: (text: string) => void) {
  const [lastCopiedText, setLastCopiedText] = useState<string>('');
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'unsupported'>('prompt');

  // Detect in-app copy events immediately (safe, zero prompt required)
  useEffect(() => {
    const handleCopy = () => {
      const selection = window.getSelection()?.toString().trim();
      if (selection && selection.length > 5 && selection.split(/\s+/).length >= 2) {
        setLastCopiedText(selection);
        if (onSentenceCopied) {
          onSentenceCopied(selection);
        }
      }
    };

    document.addEventListener('copy', handleCopy);
    return () => document.removeEventListener('copy', handleCopy);
  }, [onSentenceCopied]);

  // Check clipboard read permissions for background system clipboard
  const enableSystemClipboardMonitoring = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      setPermissionState('unsupported');
      return false;
    }

    try {
      if (navigator.permissions && navigator.permissions.query) {
        // @ts-ignore
        const status = await navigator.permissions.query({ name: 'clipboard-read' });
        setPermissionState(status.state as any);
        if (status.state === 'denied') {
          return false;
        }
      }

      const text = await navigator.clipboard.readText();
      if (text && text.trim().length > 5) {
        setLastCopiedText(text.trim());
        if (onSentenceCopied) {
          onSentenceCopied(text.trim());
        }
      }
      setIsMonitoring(true);
      return true;
    } catch (err) {
      console.warn('Clipboard permission error:', err);
      setPermissionState('denied');
      return false;
    }
  }, [onSentenceCopied]);

  const readManualClipboard = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return null;
    try {
      const text = await navigator.clipboard.readText();
      return text ? text.trim() : null;
    } catch {
      return null;
    }
  }, []);

  return {
    lastCopiedText,
    isMonitoring,
    permissionState,
    enableSystemClipboardMonitoring,
    readManualClipboard,
  };
}

import { useState, useCallback } from "react";
import useToast from "../../ui/hooks/useToast";

export const useClipboard = (timeout = 2000) => {
  const [copiedText, setCopiedText] = useState(null);
  const toast = useToast();

  const copy = useCallback(
    async (text, label = "Link") => {
      if (!text) return false;
      try {
        await navigator.clipboard.writeText(text);
        setCopiedText(text);
        toast.success(`${label} copied to clipboard!`);
        setTimeout(() => {
          setCopiedText(null);
        }, timeout);
        return true;
      } catch {
        // Fallback for older browsers / insecure origins
        try {
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
          setCopiedText(text);
          toast.success(`${label} copied to clipboard!`);
          setTimeout(() => setCopiedText(null), timeout);
          return true;
        } catch {
          toast.error("Failed to copy to clipboard");
          return false;
        }
      }
    },
    [timeout, toast]
  );

  return { copy, copiedText, isCopied: (text) => copiedText === text };
};

export default useClipboard;

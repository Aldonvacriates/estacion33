'use client';

import { useState } from 'react';

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Older browsers — fall back to selection
      const ta = document.createElement('textarea');
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      style={{
        background: copied
          ? 'var(--color-brand-primary)'
          : 'var(--color-brand-ink)',
        color: copied
          ? 'var(--color-brand-ink)'
          : 'var(--color-brand-primary)',
        border: 'none',
        padding: '6px 10px',
        borderRadius: 999,
        fontFamily: 'var(--font-heading)',
        fontSize: 11,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontWeight: 400,
        cursor: 'pointer',
        transition: 'background 120ms ease',
      }}
    >
      {copied ? '✓ Copiado' : 'Copiar URL'}
    </button>
  );
}

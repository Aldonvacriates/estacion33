'use client';

/**
 * Full-screen overlay shown while a checkout is in flight.
 * Pure CSS animation — burger layers stack one by one, then loop.
 * Brand colors only, no external deps.
 */
export function BurgerLoader({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,15,15,0.6)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        zIndex: 100,
      }}
    >
      <style>{burgerStyles}</style>
      <div className="e33-burger" aria-hidden="true">
        <span className="e33-layer e33-bun-top" />
        <span className="e33-layer e33-lettuce" />
        <span className="e33-layer e33-cheese" />
        <span className="e33-layer e33-patty" />
        <span className="e33-layer e33-tomato" />
        <span className="e33-layer e33-bun-bottom" />
      </div>
      <p
        style={{
          color: 'var(--color-neutral-0)',
          fontWeight: 600,
          fontSize: 16,
          margin: 0,
          letterSpacing: '0.02em',
          textAlign: 'center',
          maxWidth: 280,
        }}
      >
        {message}
      </p>
    </div>
  );
}

const burgerStyles = `
.e33-burger {
  position: relative;
  width: 140px;
  height: 140px;
}
.e33-layer {
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateY(-200%);
  border-radius: 60px / 24px;
  opacity: 0;
  animation: e33-drop 10s cubic-bezier(.34,1.56,.64,1) infinite;
  filter: drop-shadow(0 2px 0 rgba(0,0,0,0.18));
}
/* Top bun — taller dome */
.e33-bun-top {
  width: 120px;
  height: 36px;
  background: linear-gradient(180deg, #E0A45A 0%, #C28842 60%, #A26C2E 100%);
  border-radius: 60px 60px 12px 12px;
  top: 18px;
  z-index: 6;
  animation-delay: 0s; /* Layer drop order: top bun is reference (0s) */
}
.e33-bun-top::before, /* sesame seeds */
.e33-bun-top::after {
  content: '';
  position: absolute;
  width: 6px;
  height: 6px;
  background: #FFF1D6;
  border-radius: 50%;
}
.e33-bun-top::before { top: 6px; left: 30px; }
.e33-bun-top::after  { top: 12px; right: 38px; box-shadow: 18px -4px 0 #FFF1D6; }
.e33-lettuce {
  width: 128px;
  height: 14px;
  background: #7DA640;
  top: 56px;
  z-index: 5;
  border-radius: 8px;
  animation-delay: 1.4s;
}
.e33-lettuce::after {
  content: '';
  position: absolute;
  inset: -3px -2px auto -2px;
  height: 8px;
  background:
    radial-gradient(circle 5px at 10px 4px, #99BF5A 60%, transparent 61%),
    radial-gradient(circle 5px at 30px 4px, #99BF5A 60%, transparent 61%),
    radial-gradient(circle 5px at 50px 4px, #99BF5A 60%, transparent 61%),
    radial-gradient(circle 5px at 70px 4px, #99BF5A 60%, transparent 61%),
    radial-gradient(circle 5px at 90px 4px, #99BF5A 60%, transparent 61%),
    radial-gradient(circle 5px at 110px 4px, #99BF5A 60%, transparent 61%);
}
.e33-cheese {
  width: 124px;
  height: 12px;
  background: #FE9F10;
  top: 70px;
  z-index: 4;
  border-radius: 4px;
  animation-delay: 2.8s;
  clip-path: polygon(
    0% 30%, 6% 0%, 18% 30%, 30% 0%, 42% 30%, 54% 0%,
    66% 30%, 78% 0%, 90% 30%, 100% 30%, 100% 100%, 0% 100%
  );
}
.e33-patty {
  width: 124px;
  height: 22px;
  background: linear-gradient(180deg, #5C3A1F 0%, #3F2614 100%);
  top: 80px;
  z-index: 3;
  border-radius: 12px;
  animation-delay: 4.2s;
}
.e33-tomato {
  width: 122px;
  height: 8px;
  background: #DC2626;
  top: 100px;
  z-index: 2;
  border-radius: 6px;
  animation-delay: 5.6s;
}
/* Bottom bun — flatter */
.e33-bun-bottom {
  width: 124px;
  height: 26px;
  background: linear-gradient(180deg, #C28842 0%, #A26C2E 100%);
  top: 106px;
  z-index: 1;
  border-radius: 12px 12px 60px 60px;
  animation-delay: 7s;
}

/* Layers staggered every 1.4s across the 10s loop:
     bun-top    @ 0.0s
     lechuga    @ 1.4s
     queso      @ 2.8s
     carne      @ 4.2s
     tomate     @ 5.6s
     bun-bottom @ 7.0s
   Last layer drops at ~8s (delay 7s + 10s * 0.10 reveal). Burger sits
   complete from ~8s to ~9.5s, then fades + restarts. */
@keyframes e33-drop {
  0%   { transform: translateX(-50%) translateY(-220%); opacity: 0; }
  6%   { transform: translateX(-50%) translateY(-220%); opacity: 0; }
  10%  { transform: translateX(-50%) translateY(0%);    opacity: 1; }
  92%  { transform: translateX(-50%) translateY(0%);    opacity: 1; }
  100% { transform: translateX(-50%) translateY(0%);    opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .e33-layer {
    animation: none;
    opacity: 1;
    transform: translateX(-50%) translateY(0%);
  }
}
`;

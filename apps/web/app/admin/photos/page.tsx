import fs from 'node:fs/promises';
import path from 'node:path';
import { CopyButton } from './CopyButton';

// Static helper page for admins. Lists every generated food image in
// public/figma-make/ so you can preview and copy a URL into a product's
// image_url field over in /admin/menu.
//
// We read the directory at build/request time instead of hard-coding the
// list — adding a new file in public/figma-make/ shows up here automatically.

export const dynamic = 'force-dynamic';

async function listFoodImages(): Promise<string[]> {
  const dir = path.join(process.cwd(), 'public', 'figma-make');
  try {
    const entries = await fs.readdir(dir);
    return entries
      .filter((f) => f.startsWith('food-') && /\.(png|jpe?g|webp)$/i.test(f))
      .sort();
  } catch {
    return [];
  }
}

export default async function PhotoLibraryPage() {
  const images = await listFoodImages();

  return (
    <main
      style={{
        padding: 'var(--space-5)',
        maxWidth: 1100,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
      }}
    >
      <header style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span
          style={{
            fontFamily: 'var(--font-script)',
            fontSize: 'clamp(28px, 5vw, 40px)',
            color: 'var(--color-brand-chili)',
            lineHeight: 1,
          }}
        >
          Galería
        </span>
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(22px, 3vw, 28px)',
            fontWeight: 400,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--color-brand-ink)',
          }}
        >
          Fotos generadas
        </h1>
        <p
          style={{
            margin: '4px 0 0',
            color: 'var(--color-neutral-700)',
            fontSize: 14,
            lineHeight: 1.5,
          }}
        >
          Banco de fotos de Figma Make. Haz clic en una para copiar su URL,
          luego pégala en el campo "Foto" del producto en{' '}
          <a
            href="/admin/menu"
            style={{
              color: 'var(--color-brand-ink)',
              fontWeight: 600,
              textDecoration: 'underline',
            }}
          >
            /admin/menu
          </a>
          .
        </p>
      </header>

      {images.length === 0 ? (
        <div
          style={{
            padding: 'var(--space-5)',
            background: 'var(--color-brand-cream)',
            border: '2px solid var(--color-brand-ink)',
            borderRadius: 12,
            color: 'var(--color-brand-ink)',
          }}
        >
          No hay imágenes en <code>public/figma-make/</code>. Agrégalas
          siguiendo el patrón <code>food-*.png</code>.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 'var(--space-3)',
          }}
        >
          {images.map((file) => {
            const url = `/figma-make/${file}`;
            return (
              <figure
                key={file}
                style={{
                  margin: 0,
                  background: 'var(--color-neutral-0)',
                  border: '2px solid var(--color-neutral-200)',
                  borderRadius: 12,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    aspectRatio: '1 / 1',
                    background: `center/cover no-repeat url(${url}), var(--color-neutral-100)`,
                  }}
                  aria-label={file}
                />
                <figcaption
                  style={{
                    padding: '8px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <code
                    style={{
                      fontSize: 11,
                      color: 'var(--color-neutral-700)',
                      wordBreak: 'break-all',
                    }}
                  >
                    {url}
                  </code>
                  <CopyButton value={url} />
                </figcaption>
              </figure>
            );
          })}
        </div>
      )}
    </main>
  );
}

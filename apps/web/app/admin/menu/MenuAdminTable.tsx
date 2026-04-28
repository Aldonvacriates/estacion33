'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { formatMxn } from '@estacion33/core';
import { updateProductAction, uploadProductImageAction } from '../actions';

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  base_price_cents: number;
  available: boolean;
  sort_order: number;
};

type Category = {
  id: string;
  name: string;
  products: Product[];
};

export function MenuAdminTable({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleAvailable = (productId: string, available: boolean) => {
    setError(null);
    startTransition(async () => {
      const result = await updateProductAction({ productId, available });
      if (!result.ok) setError(result.error);
      router.refresh();
    });
  };

  return (
    <>
      {error ? (
        <div
          style={{
            background: 'var(--color-semantic-dangerBg)',
            color: 'var(--color-semantic-dangerFg)',
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-md)',
            fontSize: 14,
          }}
        >
          {error}
        </div>
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {categories.map((cat) => (
          <section key={cat.id}>
            <h2
              style={{
                margin: '0 0 var(--space-3) 0',
                fontSize: 18,
                fontWeight: 700,
                color: 'var(--color-brand-primaryDark)',
              }}
            >
              {cat.name}{' '}
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-neutral-500)' }}>
                ({cat.products.length})
              </span>
            </h2>
            {cat.products.length === 0 ? (
              <p style={{ color: 'var(--color-neutral-500)', fontSize: 14 }}>Sin productos.</p>
            ) : (
              <ul
                style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-2)',
                }}
              >
                {cat.products.map((p) => (
                  <ProductRow
                    key={p.id}
                    product={p}
                    isOpen={openId === p.id}
                    isPending={isPending}
                    onToggleOpen={() => setOpenId(openId === p.id ? null : p.id)}
                    onAvailableChange={(v) => toggleAvailable(p.id, v)}
                    onChanged={() => {
                      setError(null);
                      router.refresh();
                    }}
                    onError={setError}
                  />
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </>
  );
}

function ProductRow({
  product,
  isOpen,
  isPending,
  onToggleOpen,
  onAvailableChange,
  onChanged,
  onError,
}: {
  product: Product;
  isOpen: boolean;
  isPending: boolean;
  onToggleOpen: () => void;
  onAvailableChange: (v: boolean) => void;
  onChanged: () => void;
  onError: (msg: string) => void;
}) {
  return (
    <li
      style={{
        background: 'var(--color-neutral-0)',
        border: `1px solid ${isOpen ? 'var(--color-brand-primary)' : 'var(--color-neutral-200)'}`,
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        transition: 'border-color 120ms ease',
      }}
    >
      <button
        type="button"
        onClick={onToggleOpen}
        style={{
          width: '100%',
          padding: 'var(--space-3) var(--space-4)',
          background: 'transparent',
          border: 'none',
          display: 'grid',
          gridTemplateColumns: '48px 1fr auto auto auto',
          gap: 'var(--space-3)',
          alignItems: 'center',
          cursor: 'pointer',
          fontFamily: 'inherit',
          textAlign: 'left',
        }}
      >
        <Thumb url={product.image_url} alt={product.name} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{product.name}</div>
          <div style={{ fontSize: 12, color: 'var(--color-neutral-500)' }}>{product.slug}</div>
        </div>
        <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-brand-primaryDark)' }}>
          {formatMxn(product.base_price_cents)}
        </span>
        <label
          onClick={(e) => e.stopPropagation()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            fontWeight: 600,
            color: product.available ? 'var(--color-brand-primary)' : 'var(--color-neutral-400)',
            cursor: isPending ? 'not-allowed' : 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={product.available}
            disabled={isPending}
            onChange={(e) => onAvailableChange(e.target.checked)}
            style={{ accentColor: 'var(--color-brand-primary)' }}
          />
          {product.available ? 'En menú' : 'Oculto'}
        </label>
        <span
          aria-hidden="true"
          style={{
            color: 'var(--color-neutral-400)',
            fontSize: 12,
            transition: 'transform 150ms ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            display: 'inline-block',
          }}
        >
          ▼
        </span>
      </button>

      {isOpen ? (
        <ProductEditPanel product={product} onChanged={onChanged} onError={onError} />
      ) : null}
    </li>
  );
}

function ProductEditPanel({
  product,
  onChanged,
  onError,
}: {
  product: Product;
  onChanged: () => void;
  onError: (msg: string) => void;
}) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description ?? '');
  const [priceMxn, setPriceMxn] = useState(String(Math.round(product.base_price_cents / 100)));
  const [sortOrder, setSortOrder] = useState(String(product.sort_order));
  const [imageUrl, setImageUrl] = useState(product.image_url ?? '');
  const [isSaving, startSave] = useTransition();
  const [isUploading, startUpload] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const dirty =
    name !== product.name ||
    description !== (product.description ?? '') ||
    Math.round(Number(priceMxn) * 100) !== product.base_price_cents ||
    Number(sortOrder) !== product.sort_order;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dirty) return;
    startSave(async () => {
      const result = await updateProductAction({
        productId: product.id,
        name: name.trim(),
        description: description.trim() === '' ? null : description.trim(),
        basePriceCents: Math.round(Number(priceMxn) * 100),
        sortOrder: Number(sortOrder),
      });
      if (!result.ok) {
        onError(result.error);
        return;
      }
      onChanged();
    });
  };

  const handleFile = (file: File) => {
    const fd = new FormData();
    fd.set('productId', product.id);
    fd.set('file', file);
    startUpload(async () => {
      const result = await uploadProductImageAction(fd);
      if (!result.ok) {
        onError(result.error);
        return;
      }
      setImageUrl(result.publicUrl);
      onChanged();
    });
  };

  return (
    <form
      onSubmit={handleSave}
      style={{
        padding: 'var(--space-4)',
        borderTop: '1px solid var(--color-neutral-200)',
        background: 'var(--color-neutral-50)',
        display: 'grid',
        gridTemplateColumns: '180px 1fr',
        gap: 'var(--space-4)',
        alignItems: 'flex-start',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <div
          style={{
            width: '100%',
            aspectRatio: '4 / 3',
            background: imageUrl
              ? `center/cover url(${imageUrl})`
              : 'var(--color-neutral-200)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-neutral-200)',
          }}
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = '';
          }}
          style={{ display: 'none' }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={isUploading}
          style={{
            height: 36,
            border: '1px solid var(--color-neutral-300)',
            background: 'var(--color-neutral-0)',
            borderRadius: 'var(--radius-md)',
            fontSize: 13,
            fontWeight: 600,
            cursor: isUploading ? 'wait' : 'pointer',
          }}
        >
          {isUploading ? 'Subiendo…' : imageUrl ? 'Cambiar foto' : 'Subir foto'}
        </button>
        {imageUrl ? (
          <a
            href={imageUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: 11,
              color: 'var(--color-neutral-500)',
              textAlign: 'center',
              wordBreak: 'break-all',
            }}
          >
            Ver tamaño completo →
          </a>
        ) : null}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <Field label="Nombre">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            minLength={2}
            maxLength={120}
            style={inputStyle}
          />
        </Field>
        <Field label="Descripción">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
            rows={4}
            style={{
              ...inputStyle,
              height: 'auto',
              paddingBlock: 12,
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
          />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          <Field label="Precio (MXN)">
            <input
              type="number"
              value={priceMxn}
              onChange={(e) => setPriceMxn(e.target.value)}
              min={0}
              step={1}
              style={inputStyle}
            />
          </Field>
          <Field label="Orden">
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              min={0}
              step={1}
              style={inputStyle}
            />
          </Field>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={!dirty || isSaving}
            style={{
              height: 40,
              padding: '0 16px',
              border: 'none',
              background: dirty ? 'var(--color-brand-primary)' : 'var(--color-neutral-200)',
              color: dirty ? 'var(--color-neutral-0)' : 'var(--color-neutral-500)',
              borderRadius: 'var(--radius-md)',
              fontSize: 14,
              fontWeight: 600,
              cursor: dirty && !isSaving ? 'pointer' : 'default',
            }}
          >
            {isSaving ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </form>
  );
}

function Thumb({ url, alt }: { url: string | null; alt: string }) {
  return (
    <div
      role="img"
      aria-label={alt}
      style={{
        width: 48,
        height: 48,
        background: url ? `center/cover url(${url})` : 'var(--color-neutral-100)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-neutral-200)',
        flexShrink: 0,
      }}
    />
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-neutral-700)' }}>
        {label}
      </span>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: 40,
  padding: '0 12px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-neutral-300)',
  fontSize: 14,
  fontFamily: 'inherit',
  background: 'var(--color-neutral-0)',
  color: 'var(--color-neutral-900)',
  boxSizing: 'border-box',
};

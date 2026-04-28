'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { formatMxn } from '@estacion33/core';
import {
  createProductAction,
  deleteProductAction,
  updateProductAction,
  uploadProductImageAction,
} from '../actions';

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

export function MenuAdminTable({
  categories,
  gallery,
}: {
  categories: Category[];
  gallery: string[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  // Categories whose product list is currently hidden. Defaulting to "all
  // expanded" so existing users don't lose access to anything in one click.
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const archiveProduct = (productId: string) => {
    setError(null);
    startTransition(async () => {
      const result = await updateProductAction({ productId, available: false });
      if (!result.ok) setError(result.error);
      router.refresh();
    });
  };

  const removeProduct = (productId: string, name: string) => {
    if (
      typeof window !== 'undefined' &&
      !window.confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)
    ) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await deleteProductAction({ productId });
      if (!result.ok) setError(result.error);
      router.refresh();
    });
  };

  const toggleAvailable = (productId: string, available: boolean) => {
    setError(null);
    startTransition(async () => {
      const result = await updateProductAction({ productId, available });
      if (!result.ok) setError(result.error);
      router.refresh();
    });
  };

  const toggleCollapsed = (categoryId: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  };

  const handleAdd = (categoryId: string) => {
    setError(null);
    startTransition(async () => {
      const result = await createProductAction({ categoryId });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      // Auto-expand the section + auto-open the new row's editor so the
      // admin can name + price it without hunting.
      setCollapsed((prev) => {
        const next = new Set(prev);
        next.delete(categoryId);
        return next;
      });
      setOpenId(result.productId);
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
            border: '1px solid var(--color-brand-chili)',
          }}
        >
          {error}
        </div>
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {categories.map((cat) => {
          const isCollapsed = collapsed.has(cat.id);
          return (
            <section key={cat.id}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  borderBottom: '2px solid var(--color-brand-primary)',
                  paddingBottom: 4,
                  marginBottom: 'var(--space-3)',
                  flexWrap: 'wrap',
                }}
              >
                <button
                  type="button"
                  aria-expanded={!isCollapsed}
                  onClick={() => toggleCollapsed(cat.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 18,
                    fontWeight: 400,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--color-brand-ink)',
                    display: 'inline-flex',
                    alignItems: 'baseline',
                    gap: 8,
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      display: 'inline-block',
                      transition: 'transform 150ms ease',
                      transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                      fontSize: 12,
                      color: 'var(--color-brand-primary)',
                    }}
                  >
                    ▼
                  </span>
                  {cat.name}
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 400,
                      letterSpacing: '0.04em',
                      color: 'var(--color-brand-chili)',
                    }}
                  >
                    ({cat.products.length})
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAdd(cat.id)}
                  disabled={isPending}
                  style={{
                    marginLeft: 'auto',
                    background: 'var(--color-brand-primary)',
                    color: 'var(--color-brand-ink)',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: 999,
                    fontFamily: 'var(--font-heading)',
                    fontSize: 12,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    fontWeight: 400,
                    cursor: isPending ? 'wait' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <span aria-hidden style={{ fontSize: 14, lineHeight: 1 }}>+</span>
                  Nuevo
                </button>
              </div>
              {isCollapsed ? null : cat.products.length === 0 ? (
                <p style={{ color: 'var(--color-neutral-500)', fontSize: 14 }}>
                  Sin productos. Toca <strong>+ Nuevo</strong> para crear uno.
                </p>
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
                      gallery={gallery}
                      isOpen={openId === p.id}
                      isPending={isPending}
                      onToggleOpen={() => setOpenId(openId === p.id ? null : p.id)}
                      onAvailableChange={(v) => toggleAvailable(p.id, v)}
                      onArchive={() => archiveProduct(p.id)}
                      onDelete={() => removeProduct(p.id, p.name)}
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
          );
        })}
      </div>
    </>
  );
}

function ProductRow({
  product,
  gallery,
  isOpen,
  isPending,
  onToggleOpen,
  onAvailableChange,
  onArchive,
  onDelete,
  onChanged,
  onError,
}: {
  product: Product;
  gallery: string[];
  isOpen: boolean;
  isPending: boolean;
  onToggleOpen: () => void;
  onAvailableChange: (v: boolean) => void;
  onArchive: () => void;
  onDelete: () => void;
  onChanged: () => void;
  onError: (msg: string) => void;
}) {
  // Swipe state. dx is the current foreground x-translation. While the user
  // is actively dragging we skip the CSS transition so the row tracks their
  // finger 1:1; on release we snap to a discrete state with a transition.
  const ACTION_W = 96;
  const REVEAL_THRESHOLD = 56;
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const lockedHorizontal = useRef<boolean | null>(null);

  const closeReveal = () => {
    setDx(0);
  };

  // Snap dx to {-ACTION_W, 0, ACTION_W} on release.
  const settle = (current: number) => {
    if (current > REVEAL_THRESHOLD) setDx(ACTION_W);
    else if (current < -REVEAL_THRESHOLD) setDx(-ACTION_W);
    else setDx(0);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (isOpen) return; // editing — disable swipe so it doesn't fight scroll
    const t = e.touches[0];
    if (!t) return;
    startX.current = t.clientX - dx;
    startY.current = t.clientY;
    lockedHorizontal.current = null;
    setDragging(true);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (isOpen || !dragging) return;
    const t = e.touches[0];
    if (!t) return;
    const moveX = t.clientX - startX.current;
    const moveY = t.clientY - startY.current;
    if (lockedHorizontal.current === null) {
      const ax = Math.abs(moveX - dx);
      const ay = Math.abs(moveY);
      if (ax > 10 || ay > 10) {
        lockedHorizontal.current = ax > ay;
      }
    }
    if (lockedHorizontal.current) {
      // Cap to slightly past ACTION_W so it feels rubbery, not stuck.
      const capped = Math.max(-ACTION_W * 1.4, Math.min(ACTION_W * 1.4, moveX));
      setDx(capped);
    }
  };
  const onTouchEnd = () => {
    if (!dragging) return;
    setDragging(false);
    if (lockedHorizontal.current) settle(dx);
    lockedHorizontal.current = null;
  };

  return (
    <li
      style={{
        background: 'var(--color-neutral-0)',
        border: `1px solid ${isOpen ? 'var(--color-brand-primary)' : 'var(--color-neutral-200)'}`,
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        position: 'relative',
        transition: 'border-color 120ms ease',
      }}
    >
      {/* Archive action — revealed when swiped right (dx > 0) */}
      <button
        type="button"
        aria-label={`Archivar ${product.name}`}
        onClick={() => {
          onArchive();
          closeReveal();
        }}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: ACTION_W,
          background: 'var(--color-brand-primary)',
          color: 'var(--color-brand-ink)',
          border: 'none',
          fontFamily: 'var(--font-heading)',
          fontSize: 12,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          display: dx > 0 ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        <span aria-hidden style={{ fontSize: 16 }}>📦</span>
        Archivar
      </button>

      {/* Delete action — revealed when swiped left (dx < 0) */}
      <button
        type="button"
        aria-label={`Eliminar ${product.name}`}
        onClick={() => {
          onDelete();
          closeReveal();
        }}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: ACTION_W,
          background: 'var(--color-brand-chili)',
          color: 'var(--color-neutral-0)',
          border: 'none',
          fontFamily: 'var(--font-heading)',
          fontSize: 12,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          display: dx < 0 ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        <span aria-hidden style={{ fontSize: 16 }}>🗑</span>
        Eliminar
      </button>

      {/* Foreground that slides */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          background: 'var(--color-neutral-0)',
          transform: `translateX(${dx}px)`,
          transition: dragging ? 'none' : 'transform 200ms ease',
          touchAction: 'pan-y',
          position: 'relative',
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
        <ProductEditPanel
          product={product}
          gallery={gallery}
          onChanged={onChanged}
          onError={onError}
        />
      ) : null}
      </div>
    </li>
  );
}

function ProductEditPanel({
  product,
  gallery,
  onChanged,
  onError,
}: {
  product: Product;
  gallery: string[];
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
  const [isPickingFromGallery, setPickingFromGallery] = useState(false);
  const [isApplyingFromGallery, startApplyGallery] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const applyGalleryImage = (url: string) => {
    startApplyGallery(async () => {
      const result = await updateProductAction({
        productId: product.id,
        imageUrl: url,
      });
      if (!result.ok) {
        onError(result.error);
        return;
      }
      setImageUrl(url);
      setPickingFromGallery(false);
      onChanged();
    });
  };

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
      className="product-edit-grid"
      style={{
        padding: 'var(--space-5)',
        borderTop: '2px solid var(--color-brand-primary)',
        background: 'var(--color-brand-cream)',
        display: 'grid',
        gridTemplateColumns: '240px minmax(0, 1fr)',
        gap: 'var(--space-5)',
        alignItems: 'start',
      }}
    >
      {/* Image side */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div
          style={{
            width: '100%',
            aspectRatio: '1 / 1',
            background: imageUrl
              ? `center/cover url(${imageUrl})`
              : 'var(--color-neutral-200)',
            borderRadius: 12,
            border: '2px solid var(--color-brand-ink)',
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
        <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={isUploading}
            style={{
              height: 42,
              background: 'var(--color-brand-ink)',
              color: 'var(--color-brand-primary)',
              border: 'none',
              borderRadius: 999,
              fontFamily: 'var(--font-heading)',
              fontSize: 12,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontWeight: 400,
              cursor: isUploading ? 'wait' : 'pointer',
            }}
          >
            {isUploading ? 'Subiendo…' : 'Subir foto'}
          </button>
          <button
            type="button"
            onClick={() => setPickingFromGallery(true)}
            disabled={gallery.length === 0 || isApplyingFromGallery}
            style={{
              height: 42,
              background: 'transparent',
              color: 'var(--color-brand-ink)',
              border: '2px solid var(--color-brand-ink)',
              borderRadius: 999,
              fontFamily: 'var(--font-heading)',
              fontSize: 12,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontWeight: 400,
              cursor: gallery.length === 0 ? 'not-allowed' : 'pointer',
              opacity: gallery.length === 0 ? 0.5 : 1,
            }}
          >
            {isApplyingFromGallery ? 'Aplicando…' : 'De la galería'}
          </button>
        </div>
        {imageUrl ? (
          <a
            href={imageUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: 11,
              color: 'var(--color-neutral-700)',
              textAlign: 'center',
              wordBreak: 'break-all',
              textDecoration: 'underline',
            }}
          >
            Ver tamaño completo →
          </a>
        ) : null}
      </div>

      {/* Fields side */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <Field label="Nombre">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            minLength={2}
            maxLength={120}
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-brand-ink)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-neutral-300)')}
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
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-brand-ink)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-neutral-300)')}
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
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-brand-ink)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-neutral-300)')}
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
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-brand-ink)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-neutral-300)')}
            />
          </Field>
        </div>
        <button
          type="submit"
          disabled={!dirty || isSaving}
          style={{
            width: '100%',
            height: 46,
            border: 'none',
            background: dirty && !isSaving
              ? 'var(--color-brand-primary)'
              : 'var(--color-neutral-300)',
            color: 'var(--color-brand-ink)',
            borderRadius: 999,
            fontFamily: 'var(--font-heading)',
            fontSize: 14,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontWeight: 400,
            cursor: dirty && !isSaving ? 'pointer' : 'default',
            marginTop: 4,
          }}
        >
          {isSaving ? 'Guardando…' : 'Guardar cambios'}
        </button>

        {/* Destructive actions — outline style so they don't compete with Save */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            marginTop: 4,
            paddingTop: 12,
            borderTop: '1px dashed var(--color-neutral-300)',
          }}
        >
          <ArchiveButton
            product={product}
            onChanged={onChanged}
            onError={onError}
          />
          <DeleteButton
            product={product}
            onChanged={onChanged}
            onError={onError}
          />
        </div>
      </div>

      {isPickingFromGallery ? (
        <GalleryPicker
          gallery={gallery}
          currentUrl={imageUrl || null}
          onPick={applyGalleryImage}
          onClose={() => setPickingFromGallery(false)}
          isApplying={isApplyingFromGallery}
        />
      ) : null}
    </form>
  );
}

function GalleryPicker({
  gallery,
  currentUrl,
  onPick,
  onClose,
  isApplying,
}: {
  gallery: string[];
  currentUrl: string | null;
  onPick: (url: string) => void;
  onClose: () => void;
  isApplying: boolean;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Galería de fotos"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(10,10,10,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-4)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-brand-cream)',
          border: '2px solid var(--color-brand-ink)',
          borderRadius: 16,
          maxWidth: 720,
          width: '100%',
          maxHeight: '85vh',
          overflow: 'auto',
          padding: 'var(--space-4)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
        }}
      >
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span
              style={{
                fontFamily: 'var(--font-script)',
                fontSize: 24,
                color: 'var(--color-brand-chili)',
                lineHeight: 1,
              }}
            >
              Galería
            </span>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 12,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-brand-ink)',
              }}
            >
              Elige una foto
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-brand-ink)',
              fontSize: 26,
              lineHeight: 1,
              cursor: 'pointer',
              padding: 4,
            }}
          >
            ×
          </button>
        </header>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
            gap: 8,
          }}
        >
          {gallery.map((url) => {
            const selected = url === currentUrl;
            return (
              <button
                key={url}
                type="button"
                disabled={isApplying}
                onClick={() => onPick(url)}
                aria-pressed={selected}
                title={url}
                style={{
                  aspectRatio: '1 / 1',
                  background: `center/cover no-repeat url(${url}), var(--color-neutral-100)`,
                  border: `3px solid ${
                    selected ? 'var(--color-brand-primary)' : 'transparent'
                  }`,
                  borderRadius: 8,
                  padding: 0,
                  cursor: isApplying ? 'wait' : 'pointer',
                  opacity: isApplying ? 0.6 : 1,
                  transition: 'border-color 120ms ease',
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ArchiveButton({
  product,
  onChanged,
  onError,
}: {
  product: Product;
  onChanged: () => void;
  onError: (msg: string) => void;
}) {
  const [isPending, start] = useTransition();
  const archived = !product.available;
  const click = () =>
    start(async () => {
      const result = await updateProductAction({
        productId: product.id,
        available: archived, // toggle: archived → unarchive, available → archive
      });
      if (!result.ok) {
        onError(result.error);
        return;
      }
      onChanged();
    });
  return (
    <button
      type="button"
      onClick={click}
      disabled={isPending}
      style={{
        flex: 1,
        height: 38,
        background: 'transparent',
        color: 'var(--color-brand-ink)',
        border: '2px solid var(--color-brand-ink)',
        borderRadius: 999,
        fontFamily: 'var(--font-heading)',
        fontSize: 12,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontWeight: 400,
        cursor: isPending ? 'wait' : 'pointer',
      }}
    >
      {isPending
        ? 'Procesando…'
        : archived
          ? 'Restaurar'
          : 'Archivar'}
    </button>
  );
}

function DeleteButton({
  product,
  onChanged,
  onError,
}: {
  product: Product;
  onChanged: () => void;
  onError: (msg: string) => void;
}) {
  const [isPending, start] = useTransition();
  const click = () => {
    if (!window.confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    start(async () => {
      const result = await deleteProductAction({ productId: product.id });
      if (!result.ok) {
        onError(result.error);
        return;
      }
      onChanged();
    });
  };
  return (
    <button
      type="button"
      onClick={click}
      disabled={isPending}
      style={{
        flex: 1,
        height: 38,
        background: 'transparent',
        color: 'var(--color-brand-chili)',
        border: '2px solid var(--color-brand-chili)',
        borderRadius: 999,
        fontFamily: 'var(--font-heading)',
        fontSize: 12,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontWeight: 400,
        cursor: isPending ? 'wait' : 'pointer',
      }}
    >
      {isPending ? 'Eliminando…' : 'Eliminar'}
    </button>
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
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 11,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--color-brand-ink)',
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: 44,
  padding: '0 14px',
  borderRadius: 8,
  border: '2px solid var(--color-neutral-300)',
  fontSize: 15,
  fontFamily: 'inherit',
  background: 'var(--color-neutral-0)',
  color: 'var(--color-brand-ink)',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color 120ms ease',
};

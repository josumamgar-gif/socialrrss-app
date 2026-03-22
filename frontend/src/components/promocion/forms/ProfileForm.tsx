'use client';

import { useState } from 'react';
import { SocialNetwork, ProfileData, Profile } from '@/types';
import { profilesAPI } from '@/lib/api';
import { compressImages, formatFileSize } from '@/lib/imageUtils';

interface ProfileFormProps {
  onSuccess: (profileId: string, profile?: Profile) => void;
  onCancel: () => void;
  defaultNetwork?: SocialNetwork;
  onNetworkChange?: (network: SocialNetwork) => void;
}

const CATEGORIES = [
  { value: '', label: 'Selecciona una categoría' },
  { value: 'moda', label: '👗 Moda & Estilo' },
  { value: 'viajes', label: '✈️ Viajes & Turismo' },
  { value: 'tecnologia', label: '💻 Tecnología' },
  { value: 'gaming', label: '🎮 Gaming' },
  { value: 'fitness', label: '💪 Fitness & Salud' },
  { value: 'cocina', label: '🍳 Cocina & Gastronomía' },
  { value: 'lifestyle', label: '🌟 Lifestyle' },
  { value: 'negocios', label: '💼 Negocios & Emprendimiento' },
  { value: 'educacion', label: '📚 Educación' },
  { value: 'musica', label: '🎵 Música' },
  { value: 'arte', label: '🎨 Arte & Diseño' },
  { value: 'deportes', label: '⚽ Deportes' },
  { value: 'entretenimiento', label: '🎬 Entretenimiento' },
  { value: 'belleza', label: '💄 Belleza & Cuidado Personal' },
  { value: 'finanzas', label: '📈 Finanzas & Inversión' },
  { value: 'mascotas', label: '🐾 Mascotas' },
  { value: 'otro', label: '🔖 Otro' },
];

const LANGUAGES = [
  { value: 'es', label: '🇪🇸 Español' },
  { value: 'en', label: '🇬🇧 Inglés' },
  { value: 'pt', label: '🇧🇷 Portugués' },
  { value: 'fr', label: '🇫🇷 Francés' },
  { value: 'de', label: '🇩🇪 Alemán' },
  { value: 'it', label: '🇮🇹 Italiano' },
  { value: 'bilingual', label: '🌐 Bilingüe' },
];

const inputCls = 'w-full rounded-xl border border-surface-300 bg-white px-4 py-3 text-[15px] text-ink placeholder:text-ink-muted focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 transition';
const labelCls = 'mb-1.5 block text-[13px] font-semibold text-ink-light uppercase tracking-wide';
const sectionCls = 'rounded-2xl bg-surface-50 p-4 space-y-4 border border-surface-200';

export default function ProfileForm({ onSuccess, onCancel, defaultNetwork, onNetworkChange }: ProfileFormProps) {
  const [socialNetwork, setSocialNetwork] = useState<SocialNetwork>(defaultNetwork || 'tiktok');
  const [link, setLink] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [profileData, setProfileData] = useState<Partial<ProfileData>>({});
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState('');

  // Extra fields (common to all networks)
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('es');
  const [contactEmail, setContactEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [acceptsSponsorships, setAcceptsSponsorships] = useState(false);
  const [targetAudience, setTargetAudience] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [country, setCountry] = useState('España');

  const set = (field: keyof ProfileData, val: any) =>
    setProfileData((prev) => ({ ...prev, [field]: val }));

  const handleSocialNetworkChange = (network: SocialNetwork) => {
    setSocialNetwork(network);
    setProfileData({});
    onNetworkChange?.(network);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const newFiles = Array.from(e.target.files);
    if (images.length + newFiles.length > 3) {
      setError(`Máximo 3 imágenes. Ya tienes ${images.length}.`);
      e.target.value = '';
      return;
    }
    const filesToAdd = newFiles.slice(0, 3 - images.length);
    setCompressing(true);
    setCompressionProgress({ current: 0, total: filesToAdd.length });
    setError('');
    try {
      const compressed = await compressImages(filesToAdd, { maxWidth: 1920, maxHeight: 1920, quality: 0.85, maxSizeMB: 2 }, (c, t) => setCompressionProgress({ current: c, total: t }));
      const previews = await Promise.all(compressed.map((f) => new Promise<string>((res) => { const r = new FileReader(); r.onload = (ev) => res(ev.target?.result as string); r.readAsDataURL(f); })));
      setImages((p) => [...p, ...compressed]);
      setImagePreviews((p) => [...p, ...previews]);
    } catch {
      setImages((p) => [...p, ...filesToAdd]);
      setError('Error al comprimir algunas imágenes.');
    } finally {
      setCompressing(false);
      setCompressionProgress({ current: 0, total: 0 });
      e.target.value = '';
    }
  };

  const handleRemoveImage = (i: number) => {
    setImages((p) => p.filter((_, j) => j !== i));
    setImagePreviews((p) => p.filter((_, j) => j !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!link.trim()) { setError('El enlace del perfil es requerido'); setLoading(false); return; }
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) { setError('No estás autenticado.'); setLoading(false); return; }

      // Build merged profileData
      const merged: Record<string, any> = {};
      Object.entries(profileData).forEach(([k, v]) => {
        if (v === undefined || v === null || v === '') return;
        if (typeof v === 'string' && v.trim() === '') return;
        if (typeof v === 'number' && (isNaN(v) || !isFinite(v) || v < 0)) return;
        merged[k] = v;
      });
      if (category) merged.category = category;
      if (language) merged.language = language;
      if (contactEmail.trim()) merged.contactEmail = contactEmail.trim();
      if (website.trim()) merged.website = website.trim();
      if (targetAudience.trim()) merged.targetAudience = targetAudience.trim();
      if (priceRange.trim()) merged.priceRange = priceRange.trim();
      if (country.trim()) merged.country = country.trim();
      merged.acceptsSponsorships = acceptsSponsorships;

      const fd = new FormData();
      fd.append('socialNetwork', socialNetwork);
      fd.append('link', link.trim());
      fd.append('profileData', JSON.stringify(merged));
      images.forEach((img) => fd.append('images', img));

      const response = await profilesAPI.create(fd);
      setLink(''); setImages([]); setImagePreviews([]); setProfileData({});
      setCategory(''); setContactEmail(''); setWebsite(''); setTargetAudience(''); setPriceRange(''); setAcceptsSponsorships(false);
      setLoading(false);
      if (response?.profile?._id) onSuccess(response.profile._id, response.profile);
      else throw new Error('El servidor no devolvió un perfil válido');
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || 'Error al crear el perfil.';
      setError(msg);
      setLoading(false);
    }
  };

  /* ─── Network-specific fields ─── */
  const renderNetworkFields = () => {
    switch (socialNetwork) {
      case 'tiktok':
        return <>
          <Field label="Usuario de TikTok *">
            <input type="text" value={profileData.username || ''} onChange={(e) => set('username', e.target.value)} className={inputCls} placeholder="@usuario" />
          </Field>
          <TwoCol>
            <Field label="Seguidores">
              <NumInput field="followers" data={profileData} set={set} placeholder="48 200" />
            </Field>
            <Field label="Vídeos publicados">
              <NumInput field="videos" data={profileData} set={set} placeholder="134" />
            </Field>
          </TwoCol>
          <TwoCol>
            <Field label="Likes totales">
              <NumInput field="totalLikes" data={profileData} set={set} placeholder="1 200 000" />
            </Field>
            <Field label="% Engagement">
              <NumInput field="engagementRate" data={profileData} set={set} placeholder="5.2" step="0.1" />
            </Field>
          </TwoCol>
        </>;

      case 'youtube':
        return <>
          <Field label="Nombre del canal *">
            <input type="text" value={profileData.channelName || ''} onChange={(e) => set('channelName', e.target.value)} className={inputCls} placeholder="Mi Canal" />
          </Field>
          <TwoCol>
            <Field label="Suscriptores">
              <NumInput field="subscribers" data={profileData} set={set} placeholder="95 000" />
            </Field>
            <Field label="Vídeos">
              <NumInput field="videoCount" data={profileData} set={set} placeholder="312" />
            </Field>
          </TwoCol>
          <TwoCol>
            <Field label="Visualizaciones totales">
              <NumInput field="totalViews" data={profileData} set={set} placeholder="5 000 000" />
            </Field>
            <Field label="Promedio vistas/vídeo">
              <NumInput field="avgViews" data={profileData} set={set} placeholder="15 000" />
            </Field>
          </TwoCol>
        </>;

      case 'instagram':
        return <>
          <Field label="Handle (@) *">
            <input type="text" value={profileData.handle || ''} onChange={(e) => set('handle', e.target.value)} className={inputCls} placeholder="@usuario" />
          </Field>
          <TwoCol>
            <Field label="Seguidores">
              <NumInput field="followers" data={profileData} set={set} placeholder="12 400" />
            </Field>
            <Field label="Publicaciones">
              <NumInput field="posts" data={profileData} set={set} placeholder="87" />
            </Field>
          </TwoCol>
          <TwoCol>
            <Field label="Siguiendo">
              <NumInput field="following" data={profileData} set={set} placeholder="450" />
            </Field>
            <Field label="% Engagement">
              <NumInput field="engagementRate" data={profileData} set={set} placeholder="3.8" step="0.1" />
            </Field>
          </TwoCol>
          <Field label="Tipo de cuenta">
            <select value={profileData.accountType || ''} onChange={(e) => set('accountType', e.target.value)} className={inputCls}>
              <option value="">Seleccionar…</option>
              <option value="personal">Personal</option>
              <option value="creator">Creador</option>
              <option value="business">Empresa / Negocio</option>
            </select>
          </Field>
        </>;

      case 'linkedin':
        return <>
          <Field label="Nombre / Empresa *">
            <input type="text" value={profileData.username || ''} onChange={(e) => set('username', e.target.value)} className={inputCls} placeholder="Tu nombre en LinkedIn" />
          </Field>
          <Field label="Sector profesional">
            <input type="text" value={profileData.industry || ''} onChange={(e) => set('industry', e.target.value)} className={inputCls} placeholder="Tecnología, Marketing, Finanzas…" />
          </Field>
          <TwoCol>
            <Field label="Conexiones / Seguidores">
              <NumInput field="followers" data={profileData} set={set} placeholder="10 000" />
            </Field>
            <Field label="Publicaciones">
              <NumInput field="posts" data={profileData} set={set} placeholder="200" />
            </Field>
          </TwoCol>
          <Field label="Tipo de perfil">
            <select value={profileData.accountType || ''} onChange={(e) => set('accountType', e.target.value)} className={inputCls}>
              <option value="">Seleccionar…</option>
              <option value="personal">Perfil personal</option>
              <option value="company">Empresa</option>
            </select>
          </Field>
        </>;

      case 'twitch':
        return <>
          <Field label="Nombre del streamer *">
            <input type="text" value={profileData.streamerName || ''} onChange={(e) => set('streamerName', e.target.value)} className={inputCls} placeholder="StreamerName" />
          </Field>
          <TwoCol>
            <Field label="Seguidores">
              <NumInput field="followers" data={profileData} set={set} placeholder="50 000" />
            </Field>
            <Field label="Suscriptores activos">
              <NumInput field="subscribers" data={profileData} set={set} placeholder="800" />
            </Field>
          </TwoCol>
          <TwoCol>
            <Field label="Espectadores promedio">
              <NumInput field="avgViewers" data={profileData} set={set} placeholder="1 200" />
            </Field>
            <Field label="Horas emitidas/mes">
              <NumInput field="hoursStreamed" data={profileData} set={set} placeholder="80" />
            </Field>
          </TwoCol>
          <Field label="Juego / categoría principal">
            <input type="text" value={profileData.game || ''} onChange={(e) => set('game', e.target.value)} className={inputCls} placeholder="Just Chatting, Fortnite…" />
          </Field>
        </>;

      case 'facebook':
        return <>
          <Field label="Nombre de la página *">
            <input type="text" value={profileData.pageName || ''} onChange={(e) => set('pageName', e.target.value)} className={inputCls} placeholder="Mi Página" />
          </Field>
          <TwoCol>
            <Field label="Me gusta (fans)">
              <NumInput field="likes" data={profileData} set={set} placeholder="10 000" />
            </Field>
            <Field label="Seguidores">
              <NumInput field="followers" data={profileData} set={set} placeholder="12 000" />
            </Field>
          </TwoCol>
          <Field label="Tipo de página">
            <select value={profileData.accountType || ''} onChange={(e) => set('accountType', e.target.value)} className={inputCls}>
              <option value="">Seleccionar…</option>
              <option value="personal">Personal</option>
              <option value="business">Negocio</option>
              <option value="community">Comunidad</option>
            </select>
          </Field>
        </>;

      case 'x':
        return <>
          <Field label="Handle (@) *">
            <input type="text" value={profileData.twitterHandle || ''} onChange={(e) => set('twitterHandle', e.target.value)} className={inputCls} placeholder="@usuario" />
          </Field>
          <TwoCol>
            <Field label="Seguidores">
              <NumInput field="followers" data={profileData} set={set} placeholder="50 000" />
            </Field>
            <Field label="Tweets">
              <NumInput field="tweets" data={profileData} set={set} placeholder="3 500" />
            </Field>
          </TwoCol>
          <TwoCol>
            <Field label="Siguiendo">
              <NumInput field="following" data={profileData} set={set} placeholder="1 200" />
            </Field>
            <Field label="Likes dados">
              <NumInput field="totalLikes" data={profileData} set={set} placeholder="25 000" />
            </Field>
          </TwoCol>
          <Field label="Verificado">
            <select value={profileData.verified ? 'si' : 'no'} onChange={(e) => set('verified', e.target.value === 'si')} className={inputCls}>
              <option value="no">No verificado</option>
              <option value="si">✓ Verificado</option>
            </select>
          </Field>
        </>;

      default:
        return <>
          <Field label="Título *">
            <input type="text" value={profileData.title || ''} onChange={(e) => set('title', e.target.value)} className={inputCls} placeholder="Nombre del perfil o proyecto" />
          </Field>
        </>;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pb-10">

      {/* Section 1: Basic info */}
      <div className={sectionCls}>
        <p className="text-[11px] font-bold uppercase tracking-widest text-ink-muted">Red social y enlace</p>

        <Field label="Red Social *">
          <select value={socialNetwork} onChange={(e) => handleSocialNetworkChange(e.target.value as SocialNetwork)} className={inputCls}>
            <option value="tiktok">TikTok</option>
            <option value="youtube">YouTube</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="twitch">Twitch</option>
            <option value="facebook">Facebook</option>
            <option value="x">X (Twitter)</option>
            <option value="otros">Otros</option>
          </select>
        </Field>

        <Field label="Enlace del perfil *">
          <input type="url" value={link} onChange={(e) => setLink(e.target.value)} required className={inputCls} placeholder="https://instagram.com/tu_usuario" />
        </Field>
      </div>

      {/* Section 2: Network-specific stats */}
      <div className={sectionCls}>
        <p className="text-[11px] font-bold uppercase tracking-widest text-ink-muted">Estadísticas del perfil</p>
        {renderNetworkFields()}
        <Field label="Descripción / Bio">
          <textarea
            value={profileData.description || ''}
            onChange={(e) => set('description', e.target.value)}
            className={`${inputCls} resize-none`}
            rows={3}
            placeholder="Describe tu perfil, tipo de contenido, propuesta de valor…"
          />
        </Field>
      </div>

      {/* Section 3: Audience & Business */}
      <div className={sectionCls}>
        <p className="text-[11px] font-bold uppercase tracking-widest text-ink-muted">Audiencia y negocio</p>

        <Field label="Categoría / Nicho">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </Field>

        <TwoCol>
          <Field label="Idioma principal">
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className={inputCls}>
              {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </Field>
          <Field label="País de origen">
            <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className={inputCls} placeholder="España" />
          </Field>
        </TwoCol>

        <Field label="Público objetivo">
          <input type="text" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} className={inputCls} placeholder="Ej: Jóvenes 18-30, interesados en fitness" />
        </Field>

        <div className="flex items-center gap-3 rounded-xl border border-surface-200 bg-white px-4 py-3">
          <button
            type="button"
            onClick={() => setAcceptsSponsorships(!acceptsSponsorships)}
            className={`relative h-6 w-10 flex-shrink-0 rounded-full transition-colors ${acceptsSponsorships ? 'bg-primary-500' : 'bg-surface-300'}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${acceptsSponsorships ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </button>
          <div>
            <p className="text-[14px] font-medium text-ink">Acepta colaboraciones / patrocinios</p>
            <p className="text-[12px] text-ink-muted">Las empresas podrán contactarte directamente</p>
          </div>
        </div>

        {acceptsSponsorships && (
          <Field label="Rango de precio (colaboración)">
            <input type="text" value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className={inputCls} placeholder="Ej: 200 € - 800 € por publicación" />
          </Field>
        )}
      </div>

      {/* Section 4: Contact */}
      <div className={sectionCls}>
        <p className="text-[11px] font-bold uppercase tracking-widest text-ink-muted">Contacto (opcional)</p>
        <TwoCol>
          <Field label="Email de contacto">
            <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className={inputCls} placeholder="hola@tudominio.com" />
          </Field>
          <Field label="Web / Portfolio">
            <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className={inputCls} placeholder="https://tuportfolio.com" />
          </Field>
        </TwoCol>
      </div>

      {/* Section 5: Images */}
      <div className={sectionCls}>
        <p className="text-[11px] font-bold uppercase tracking-widest text-ink-muted">Imágenes (máx. 3)</p>

        {images.length < 3 && (
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-surface-300 py-6 transition hover:border-primary-400 hover:bg-primary-50/30">
            <svg className="h-8 w-8 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <span className="text-[14px] font-medium text-ink-light">Seleccionar imágenes</span>
            <span className="text-[12px] text-ink-muted">{images.length}/3 seleccionada(s)</span>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} disabled={compressing || loading} className="hidden" />
          </label>
        )}

        {compressing && (
          <div className="space-y-2">
            <div className="flex justify-between text-[13px] text-ink-light">
              <span>Comprimiendo…</span>
              <span>{compressionProgress.current}/{compressionProgress.total}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-200">
              <div className="h-full rounded-full bg-primary-500 transition-all" style={{ width: `${(compressionProgress.current / compressionProgress.total) * 100}%` }} />
            </div>
          </div>
        )}

        {imagePreviews.length > 0 && !compressing && (
          <div className="grid grid-cols-3 gap-2">
            {imagePreviews.map((src, i) => (
              <div key={i} className="relative">
                <img src={src} alt="" className="h-28 w-full rounded-xl object-cover" />
                <button type="button" onClick={() => handleRemoveImage(i)} className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-red-500">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <span className="absolute bottom-1 left-1 rounded bg-black/50 px-1 py-0.5 text-[10px] text-white">{formatFileSize(images[i]?.size || 0)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onCancel} className="flex-1 rounded-xl border border-surface-300 bg-white py-3.5 text-[15px] font-semibold text-ink transition active:scale-[0.98] hover:bg-surface-50">
          Cancelar
        </button>
        <button type="submit" disabled={loading || !link || compressing} className="flex-1 rounded-xl bg-primary-600 py-3.5 text-[15px] font-semibold text-white shadow-soft transition hover:bg-primary-700 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed">
          {compressing ? 'Comprimiendo…' : loading ? 'Subiendo…' : 'Crear perfil'}
        </button>
      </div>
    </form>
  );
}

/* ─── Small helpers ─── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

function TwoCol({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}

interface NumInputProps {
  field: keyof ProfileData;
  data: Partial<ProfileData>;
  set: (field: keyof ProfileData, val: any) => void;
  placeholder?: string;
  step?: string;
}

function NumInput({ field, data, set, placeholder, step = '1' }: NumInputProps) {
  const inputCls = 'w-full rounded-xl border border-surface-300 bg-white px-4 py-3 text-[15px] text-ink placeholder:text-ink-muted focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 transition';
  const val = (data as any)[field] ?? '';
  return (
    <input
      type="number"
      value={val}
      onChange={(e) => {
        const v = e.target.value;
        set(field, v === '' ? undefined : parseFloat(v));
      }}
      className={inputCls}
      placeholder={placeholder}
      min="0"
      step={step}
    />
  );
}

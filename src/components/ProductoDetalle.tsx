import { useState, useEffect } from 'react'
import {
  X, ChevronLeft, ChevronRight, ShoppingCart, CheckCircle,
  Shield, Package, Truck, Star, ArrowLeft, ZoomIn
} from 'lucide-react'

// ── Tipo que respeta los campos reales de obras, servicios y encargos ─────────
// obras:    id, title, subtitle, description, image[], prices{}
// servicios: id, title, description, image[], prices{}   ← sin subtitle
// encargos:  title, description, image[], prices{}       ← sin id, sin subtitle
export interface ProductoItem {
  id?: number
  title: string
  subtitle?: string
  description: string
  image: string[]
  prices: { L: number; M: number; S: number; XS: number }
  categoria?: string   // Se inyecta desde App: 'Obras' | 'Fotografía' | 'Encargos'
}

interface ProductoDetalleProps {
  producto: ProductoItem
  onClose: () => void
  onAddToCart: (foto: { src: string; title: string; description?: string }) => void
  onSolicitarEncargo: () => void
}

// Metadatos de formatos — precios vienen del item, no están hardcodeados aquí
const FORMATOS_META = [
  { key: 'XS' as const, label: 'XS', dims: '50×30 cm' },
  { key: 'S'  as const, label: 'S',  dims: '60×40 cm' },
  { key: 'M'  as const, label: 'M',  dims: '80×60 cm' },
  { key: 'L'  as const, label: 'L',  dims: '100×70 cm' },
]

// Características técnicas distintas por categoría
const TECNICAS: Record<string, { label: string; value: string }[]> = {
  'Obras': [
    { label: 'Técnica',          value: 'Resina epoxy sobre base LED' },
    { label: 'Material',         value: 'Resina de alta densidad' },
    { label: 'Iluminación',      value: 'LED perimetral integrado' },
    { label: 'Energética',       value: 'A++' },
    { label: 'Transformador',    value: '12v incluido' },
    { label: 'Certificado',      value: 'Pieza única — numerada y firmada' },
  ],
  'Fotografía': [
    { label: 'Tipo',             value: 'Sesión fotográfica profesional' },
    { label: 'Entrega',          value: 'Digital RAW + JPEG editadas' },
    { label: 'Post-producción',  value: 'Incluida' },
    { label: 'Plazo',            value: '7–14 días tras la sesión' },
    { label: 'Derechos',         value: 'Uso personal y comercial' },
    { label: 'Formato físico',   value: 'Opcional: impresión en resina' },
  ],
  'Encargos': [
    { label: 'Tipo',             value: 'Encargo personalizado — pieza única' },
    { label: 'Material',         value: 'Resina epoxy + LED perimetral' },
    { label: 'Imagen de origen', value: 'Del cliente o sesión FOCUS JEB' },
    { label: 'Producción',       value: '3–5 semanas desde aprobación' },
    { label: 'Certificado',      value: 'Incluido — numerada y firmada' },
    { label: 'Envío',            value: 'Gratuito — embalaje premium' },
  ],
}

export default function ProductoDetalle({
  producto, onClose, onAddToCart, onSolicitarEncargo,
}: ProductoDetalleProps) {
  const [imgActiva, setImgActiva]   = useState(0)
  const [formatoSel, setFormatoSel] = useState<'XS' | 'S' | 'M' | 'L' | null>(null)
  const [agregado, setAgregado]     = useState(false)
  const [zoom, setZoom]             = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'unset' }
  }, [])

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const categoria = producto.categoria ?? 'Obras'
  const tecnicas  = TECNICAS[categoria] ?? TECNICAS['Obras']
  const fmtMeta   = formatoSel ? FORMATOS_META.find(f => f.key === formatoSel) : null
  const precio    = formatoSel ? producto.prices[formatoSel] : null

  const handleAgregar = () => {
    if (!formatoSel) return
    onAddToCart({
      src:         producto.image[imgActiva],
      title:       producto.title,
      // Descripción compuesta: respeta subtitle si existe + formato elegido
      description: [producto.subtitle, `Formato ${formatoSel} ${fmtMeta?.dims ?? ''}`]
        .filter(Boolean).join(' — '),
    })
    setAgregado(true)
    setTimeout(() => setAgregado(false), 2500)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 bg-[#F5F0E8] w-full sm:max-w-5xl sm:mx-4 sm:rounded-3xl rounded-t-3xl max-h-[95vh] overflow-y-auto shadow-2xl border border-oro/30">

        {/* Header sticky */}
        <div className="sticky top-0 z-20 bg-[#F5F0E8]/95 backdrop-blur-sm border-b border-oro/20 px-5 py-4 flex items-center justify-between">
          <button onClick={onClose} className="flex items-center gap-2 text-navy/60 hover:text-navy transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
          <span className="text-xs text-navy/40 tracking-widest uppercase">{categoria}</span>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-navy/10 hover:bg-navy/20 transition-colors">
            <X className="w-4 h-4 text-navy" />
          </button>
        </div>

        <div className="grid lg:grid-cols-2">

          {/* ── Galería + técnicas ── */}
          <div className="p-5 lg:p-8">

            {/* Imagen principal */}
            <div
              className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-oro/30 bg-navy/5 cursor-zoom-in"
              onClick={() => setZoom(true)}
            >
              <img
                src={producto.image[imgActiva]}
                alt={`${producto.title} — imagen ${imgActiva + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                onError={e => { e.currentTarget.style.opacity = '0.3' }}
              />
              <div className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow">
                <ZoomIn className="w-4 h-4 text-navy" />
              </div>
              {producto.image.length > 1 && (
                <>
                  <button onClick={e => { e.stopPropagation(); setImgActiva(i => Math.max(i-1,0)) }}
                    disabled={imgActiva === 0}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center disabled:opacity-30 hover:bg-white shadow">
                    <ChevronLeft className="w-5 h-5 text-navy" />
                  </button>
                  <button onClick={e => { e.stopPropagation(); setImgActiva(i => Math.min(i+1, producto.image.length-1)) }}
                    disabled={imgActiva === producto.image.length - 1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center disabled:opacity-30 hover:bg-white shadow">
                    <ChevronRight className="w-5 h-5 text-navy" />
                  </button>
                </>
              )}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 rounded-full text-white text-xs">
                {imgActiva + 1} / {producto.image.length}
              </div>
            </div>

            {/* Miniaturas — una por cada imagen del array */}
            {producto.image.length > 1 && (
              <div className="flex gap-3 mt-4">
                {producto.image.map((src, i) => (
                  <button key={i} onClick={() => setImgActiva(i)}
                    className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      i === imgActiva ? 'border-oro shadow-[0_0_8px_#D4AF37]' : 'border-oro/20 opacity-60 hover:opacity-90 hover:border-oro/50'
                    }`}>
                    <img src={src} alt={`miniatura ${i+1}`} className="w-full h-full object-cover"
                      onError={e => { e.currentTarget.style.opacity = '0.3' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Tabla de características técnicas — distintas por categoría */}
            <div className="mt-6 rounded-2xl border border-oro/20 overflow-hidden">
              <div className="bg-navy/5 px-5 py-3 border-b border-oro/20">
                <span className="text-xs font-semibold text-navy/60 tracking-widest uppercase">Características técnicas</span>
              </div>
              <div className="divide-y divide-oro/10">
                {tecnicas.map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-start px-5 py-3 gap-4">
                    <span className="text-sm font-medium text-navy/60 flex-shrink-0 w-36">{label}</span>
                    <span className="text-sm text-navy text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Info + compra ── */}
          <div className="px-5 pb-8 lg:px-8 lg:py-8 flex flex-col gap-5">

            {/* Título y descripción — datos exactos del item */}
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-oro/10 border border-oro/30 text-navy text-[10px] font-semibold tracking-widest uppercase mb-3">
                {categoria}
              </span>

              {/* title exacto del item */}
              <h2 className="text-3xl lg:text-4xl font-bold text-navy leading-tight mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {producto.title}
              </h2>

              {/* subtitle solo en obras */}
              {producto.subtitle && (
                <p className="text-oro font-medium text-sm mb-3">{producto.subtitle}</p>
              )}

              {/* description exacta del item */}
              <p className="text-navy/60 leading-relaxed">{producto.description}</p>
            </div>

            {/* Rating decorativo */}
            <div className="flex items-center gap-1.5">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-oro fill-oro" />)}
              <span className="text-sm text-navy/50 ml-1">Pieza única certificada</span>
            </div>

            {/* Selector de formato con precios reales del item */}
            <div className="rounded-2xl border border-oro/30 overflow-hidden">
              <div className="bg-navy/5 px-5 py-3 border-b border-oro/20 flex items-center justify-between">
                <span className="text-sm font-semibold text-navy">Selecciona un formato</span>
                {fmtMeta && <span className="text-xs text-oro font-medium">{fmtMeta.dims}</span>}
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                {FORMATOS_META.map(fmt => {
                  const precioFmt = producto.prices[fmt.key]  // precio real del item
                  const activo = formatoSel === fmt.key
                  return (
                    <button key={fmt.key} type="button" onClick={() => setFormatoSel(fmt.key)}
                      className={`relative p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                        activo ? 'border-oro bg-oro/10 shadow-[0_0_10px_#D4AF3740]' : 'border-oro/20 hover:border-oro/50 hover:bg-oro/5'
                      }`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-navy text-sm">Formato {fmt.label}</span>
                        {activo && <CheckCircle className="w-4 h-4 text-oro" />}
                      </div>
                      <span className="text-xs text-navy/50 block">{fmt.dims}</span>
                      <span className="text-base font-bold text-navy mt-1 block">
                        {precioFmt.toLocaleString('es-ES')} €
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Precio en tiempo real */}
            <div className="flex items-center justify-between px-5 py-4 rounded-2xl bg-gradient-to-r from-navy/5 to-oro/5 border border-oro/20">
              <div>
                <p className="text-xs text-navy/50 mb-1 uppercase tracking-wider">
                  {formatoSel && fmtMeta ? `Formato ${formatoSel} — ${fmtMeta.dims}` : 'Selecciona un formato'}
                </p>
                <p className="text-3xl font-bold text-navy">
                  {precio !== null
                    ? `${precio.toLocaleString('es-ES')} €`
                    : `Desde ${producto.prices.XS.toLocaleString('es-ES')} €`}
                </p>
                <p className="text-xs text-navy/40 mt-0.5">IVA incluido · Envío gratuito</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-green-600 font-semibold">✓ Disponible</p>
                <p className="text-xs text-navy/40 mt-1">Entrega: 7–14 días</p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="space-y-3">
              <button type="button" disabled={!formatoSel} onClick={handleAgregar}
                className="w-full py-4 bg-gradient-to-r from-oro to-navy text-crema font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-oro/20 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-3 text-sm">
                {agregado ? (
                  <><CheckCircle className="w-5 h-5" />¡Añadido al encargo!</>
                ) : (
                  <><ShoppingCart className="w-5 h-5" />
                    {formatoSel
                      ? `Añadir al encargo — ${producto.prices[formatoSel].toLocaleString('es-ES')} €`
                      : 'Selecciona un formato primero'}
                  </>
                )}
              </button>

              <button type="button"
                onClick={() => {
                  onAddToCart({ src: producto.image[imgActiva], title: producto.title, description: producto.subtitle })
                  onSolicitarEncargo()
                }}
                className="w-full py-3 border-2 border-oro text-navy font-semibold rounded-xl hover:bg-oro/10 transition-all duration-300 text-sm">
                Solicitar encargo directamente
              </button>
            </div>

            {/* Aviso medidas personalizadas */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <p className="text-sm text-amber-800 font-semibold mb-1">¿No encuentras tu tamaño ideal?</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                Introduce tus medidas exactas en el configurador de encargo. El precio se calcula automáticamente.
              </p>
            </div>

            {/* Garantías */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Shield, label: 'Pieza certificada' },
                { icon: Package, label: 'Embalaje premium' },
                { icon: Truck, label: 'Envío asegurado' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-oro/5 border border-oro/10">
                  <Icon className="w-5 h-5 text-oro/70" />
                  <span className="text-[10px] text-navy/50 text-center leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Zoom de imagen */}
      {zoom && (
        <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center" onClick={() => setZoom(false)}>
          <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30">
            <X className="w-5 h-5 text-white" />
          </button>
          <img src={producto.image[imgActiva]} alt={producto.title}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl" />
        </div>
      )}
    </div>
  )
}

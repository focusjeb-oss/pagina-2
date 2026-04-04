
import { useState, useEffect, useCallback, memo } from 'react'
import {Menu, X, ArrowRight, Mail, MapPin, Instagram, ChevronRight, Sparkles, Layers, Sun, ShoppingCart, Ruler, CheckCircle, Info, Shield, Package, Truck, CreditCard, Loader2, AlertCircle} from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import Lightbox from './components/Lightbox'
import GrillaProductos from './components/GrillaProductos'
import ProductoDetalle from './components/ProductoDetalle'
import type { ProductoItem } from './components/ProductoDetalle'

// ── Stripe: inicializar UNA sola vez fuera del componente ────────────────────
// MOTIVO: Si se pusiera dentro de App(), se recrearía en cada render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export interface Photo {
  src: string;
  title: string;
  description?: string;
}

// CAMBIO 4: Tipo centralizado para los pasos del drawer.
// 'confirmacion' eliminado (nunca se usaba). 'pago' añadido.
type DrawerStep = 'resumen' | 'datos' | 'pago'

// ── Tipo para los datos del formulario de contacto ───────────────────────────
type FormularioDatos = {
  nombre: string
  email: string
  telefono: string
  direccion: string
  codigoPostal: string
  mensaje: string
}

const navItems = [
  { id: 'obras', label: 'Obras' },
  { id: 'fotografia', label: 'Fotografía' },
  { id: 'encargos', label: 'Encargos' },
  { id: 'nosotros', label: 'Nosotros' },
  { id: 'contacto', label: 'Contacto' },
]

const obras = [
  {
    id: 1,
    title: 'LÍMITE 01',
    subtitle: 'Retrato - Blanco y negro',
    description: 'Resina epoxy - Luz - Pieza única',
    image: [
      '/images/1obras/limite01/1.webp',
      '/images/1obras/limite01/2.webp',
      '/images/1obras/limite01/3.webp',
    ],
    prices: {
      XS: { '5mm': 164.98, '10mm': 181.92 },
      S:  { '5mm': 187.82, '10mm': 219.28 },
      M:  { '5mm': 226.70, '10mm': 255.74 },
      L:  { '5mm': 252.94, '10mm': 298.92 },
    }
  },
  {
    id: 2,
    title: 'LÍMITE 02',
    subtitle: 'Resina epoxy - Luz perimetral',
    description: 'Formato L - Pieza única',
    image: [
      '/images/1obras/limite02/1.webp',
      '/images/1obras/limite02/2.webp',
      '/images/1obras/limite02/3.webp',
    ],
    prices: {
      XS: { '5mm': 164.98, '10mm': 181.92 },
      S:  { '5mm': 187.82, '10mm': 219.28 },
      M:  { '5mm': 226.70, '10mm': 255.74 },
      L:  { '5mm': 252.94, '10mm': 298.92 },
    }
  },
  {
    id: 3,
    title: 'LÍMITE 03',
    subtitle: 'Formato L - Pieza única',
    description: 'Pieza única',
    image: [
      '/images/1obras/limite03/1.webp',
      '/images/1obras/limite03/2.webp',
      '/images/1obras/limite03/3.webp'
    ],
    prices: {
      XS: { '5mm': 164.98, '10mm': 181.92 },
      S:  { '5mm': 187.82, '10mm': 219.28 },
      M:  { '5mm': 226.70, '10mm': 255.74 },
      L:  { '5mm': 252.94, '10mm': 298.92 },
    }
  },
  {
    id: 4,
    title: 'ORIGEN',
    subtitle: 'Formato L',
    description: 'Fotografía - Resina - Luz',
    image: [
      '/images/origen/1.webp',
      '/images/origen/2.webp'
    ],
    prices: {
      XS: { '5mm': 164.98, '10mm': 181.92 },
      S:  { '5mm': 187.82, '10mm': 219.28 },
      M:  { '5mm': 226.70, '10mm': 255.74 },
      L:  { '5mm': 252.94, '10mm': 298.92 },
    }
  },
  {
    id: 5,
    title: 'LÍMITE 03',
    subtitle: 'Formato L - Pieza única',
    description: 'Pieza única',
    image: [
      '/images/1obras/limite03/1.webp',
      '/images/1obras/limite03/2.webp',
      '/images/1obras/limite03/3.webp'
    ],
    prices: {
      XS: { '5mm': 164.98, '10mm': 181.92 },
      S:  { '5mm': 187.82, '10mm': 219.28 },
      M:  { '5mm': 226.70, '10mm': 255.74 },
      L:  { '5mm': 252.94, '10mm': 298.92 },
    }
  },
  {
    id: 6,
    title: 'LÍMITE 03',
    subtitle: 'Formato L - Pieza única',
    description: 'Pieza única',
    image: [
      '/images/1obras/limite03/1.webp',
      '/images/1obras/limite03/2.webp',
      '/images/1obras/limite03/3.webp'
    ],
    prices: {
      XS: { '5mm': 164.98, '10mm': 181.92 },
      S:  { '5mm': 187.82, '10mm': 219.28 },
      M:  { '5mm': 226.70, '10mm': 255.74 },
      L:  { '5mm': 252.94, '10mm': 298.92 },
    }
  },
  {
    id: 7,
    title: 'LÍMITE 03',
    subtitle: 'Formato L - Pieza única',
    description: 'Pieza única',
    image: [
      '/images/1obras/limite03/1.webp',
      '/images/1obras/limite03/2.webp',
      '/images/1obras/limite03/3.webp'
    ],
    prices: {
      XS: { '5mm': 164.98, '10mm': 181.92 },
      S:  { '5mm': 187.82, '10mm': 219.28 },
      M:  { '5mm': 226.70, '10mm': 255.74 },
      L:  { '5mm': 252.94, '10mm': 298.92 },
    }
  },
  {
    id: 8,
    title: 'LÍMITE 03',
    subtitle: 'Formato L - Pieza única',
    description: 'Pieza única',
    image: [
      '/images/1obras/limite03/1.webp',
      '/images/1obras/limite03/2.webp',
      '/images/1obras/limite03/3.webp'
    ],
    prices: {
      XS: { '5mm': 164.98, '10mm': 181.92 },
      S:  { '5mm': 187.82, '10mm': 219.28 },
      M:  { '5mm': 226.70, '10mm': 255.74 },
      L:  { '5mm': 252.94, '10mm': 298.92 },
    }
  },
]

const servicios = [
  {
    id: 1,
    title: 'Retrato',
    description: 'Retratos construidos desde la presencia y la quietud.',
    image: [
      '/images/2servicios/retrato/1.webp',
      '/images/2servicios/retrato/2.webp'
    ],
    prices: {
      XS: { '5mm': 164.98, '10mm': 181.92 },
      S:  { '5mm': 187.82, '10mm': 219.28 },
      M:  { '5mm': 226.70, '10mm': 255.74 },
      L:  { '5mm': 252.94, '10mm': 298.92 },
    }
  },
  {
    id: 2,
    title: 'Editorial / Conceptual',
    description: 'Imagen conceptual como exploración visual, sin finalidad comercial inmediata.',
    image: [
      '/images/2servicios/editorial/1.webp',
      '/images/2servicios/editorial/2.webp'
    ],
    prices: {
      XS: { '5mm': 164.98, '10mm': 181.92 },
      S:  { '5mm': 187.82, '10mm': 219.28 },
      M:  { '5mm': 226.70, '10mm': 255.74 },
      L:  { '5mm': 252.94, '10mm': 298.92 },
    }
  },
  {
    id: 3,
    title: 'Fotografía para obra',
    description: 'Algunas imágenes nacen ya con destino físico.',
    image: [
      '/images/2servicios/obra/1.webp',
      '/images/2servicios/obra/2.webp'
    ],
    prices: {
      XS: { '5mm': 164.98, '10mm': 181.92 },
      S:  { '5mm': 187.82, '10mm': 219.28 },
      M:  { '5mm': 226.70, '10mm': 255.74 },
      L:  { '5mm': 252.94, '10mm': 298.92 },
    }
  },
  {
    id: 4,
    title: 'Fotografía para obra',
    description: 'Algunas imágenes nacen ya con destino físico.',
    image: [
      '/images/2servicios/obra/1.webp',
      '/images/2servicios/obra/2.webp'
    ],
    prices: {
      XS: { '5mm': 164.98, '10mm': 181.92 },
      S:  { '5mm': 187.82, '10mm': 219.28 },
      M:  { '5mm': 226.70, '10mm': 255.74 },
      L:  { '5mm': 252.94, '10mm': 298.92 },
    }
  },
  {
    id: 5,
    title: 'Fotografía para obra',
    description: 'Algunas imágenes nacen ya con destino físico.',
    image: [
      '/images/2servicios/obra/1.webp',
      '/images/2servicios/obra/2.webp'
    ],
    prices: {
      XS: { '5mm': 164.98, '10mm': 181.92 },
      S:  { '5mm': 187.82, '10mm': 219.28 },
      M:  { '5mm': 226.70, '10mm': 255.74 },
      L:  { '5mm': 252.94, '10mm': 298.92 },
    }
  },
  {
    id: 6,
    title: 'Fotografía para obra',
    description: 'Algunas imágenes nacen ya con destino físico.',
    image: [
      '/images/2servicios/obra/1.webp',
      '/images/2servicios/obra/2.webp'
    ],
    prices: {
      XS: { '5mm': 164.98, '10mm': 181.92 },
      S:  { '5mm': 187.82, '10mm': 219.28 },
      M:  { '5mm': 226.70, '10mm': 255.74 },
      L:  { '5mm': 252.94, '10mm': 298.92 },
    }
  },
]

const encargos = [
  {
    title: 'Imagen del cliente',
    description: 'Retratos construidos desde la presencia y la quietud.',
    image: [
      '/images/3encargos/imgcliente/1.webp',
      '/images/3encargos/imgcliente/2.webp'
    ],
    prices: {
      XS: { '5mm': 164.98, '10mm': 181.92 },
      S:  { '5mm': 187.82, '10mm': 219.28 },
      M:  { '5mm': 226.70, '10mm': 255.74 },
      L:  { '5mm': 252.94, '10mm': 298.92 },
    }
  },
  { 
    title: 'Sesión fotográfica FOCUS JEB',
    description: 'Imagen esencial como exploración visual, sin finalidad comercial inmediata.',
    image: [
      '/images/3encargos/sesionFOCUSJEB/1.webp',
      '/images/3encargos/sesionFOCUSJEB/2.webp',
      '/images/3encargos/sesionFOCUSJEB/3.webp'
    ],
    prices: {
      XS: { '5mm': 164.98, '10mm': 181.92 },
      S:  { '5mm': 187.82, '10mm': 219.28 },
      M:  { '5mm': 226.70, '10mm': 255.74 },
      L:  { '5mm': 252.94, '10mm': 298.92 },
    } 
  },
  {
    title: 'Obra personalizada',
    description: 'Cada pieza se desarrolla a partir de una idea, una imagen y un espacio concreto.',
    image: [
      '/images/3encargos/personalizada/1.webp',
      '/images/3encargos/personalizada/2.webp'
    ],
    prices: {
      XS: { '5mm': 164.98, '10mm': 181.92 },
      S:  { '5mm': 187.82, '10mm': 219.28 },
      M:  { '5mm': 226.70, '10mm': 255.74 },
      L:  { '5mm': 252.94, '10mm': 298.92 },
    }
  },
  {
    title: 'Obra personalizada',
    description: 'Cada pieza se desarrolla a partir de una idea, una imagen y un espacio concreto.',
    image: [
      '/images/3encargos/personalizada/1.webp',
      '/images/3encargos/personalizada/2.webp'
    ],
    prices: {
      XS: { '5mm': 164.98, '10mm': 181.92 },
      S:  { '5mm': 187.82, '10mm': 219.28 },
      M:  { '5mm': 226.70, '10mm': 255.74 },
      L:  { '5mm': 252.94, '10mm': 298.92 },
    }
  },
  {
    title: 'Obra personalizada',
    description: 'Cada pieza se desarrolla a partir de una idea, una imagen y un espacio concreto.',
    image: [
      '/images/3encargos/personalizada/1.webp',
      '/images/3encargos/personalizada/2.webp'
    ],
    prices: {
      XS: { '5mm': 164.98, '10mm': 181.92 },
      S:  { '5mm': 187.82, '10mm': 219.28 },
      M:  { '5mm': 226.70, '10mm': 255.74 },
      L:  { '5mm': 252.94, '10mm': 298.92 },
    }
  },
  {
    title: 'Obra personalizada',
    description: 'Cada pieza se desarrolla a partir de una idea, una imagen y un espacio concreto.',
    image: [
      '/images/3encargos/personalizada/1.webp',
      '/images/3encargos/personalizada/2.webp'
    ],
    prices: {
      XS: { '5mm': 164.98, '10mm': 181.92 },
      S:  { '5mm': 187.82, '10mm': 219.28 },
      M:  { '5mm': 226.70, '10mm': 255.74 },
      L:  { '5mm': 252.94, '10mm': 298.92 },
    }
  },
]

export const formatosEstandar = [
  { key: 'XS', label: 'XS', dims: '50×30 cm', alto: 50, ancho: 30, precio5mm: 164.98, precio10mm: 181.92, descripcion: 'Pieza íntima, ideal para espacios reducidos o colecciones.' },
  { key: 'S',  label: 'S',  dims: '60×40 cm', alto: 60, ancho: 40, precio5mm: 187.82, precio10mm: 219.28, descripcion: 'Equilibrio entre presencia y discreción.' },
  { key: 'M',  label: 'M',  dims: '80×60 cm', alto: 80, ancho: 60, precio5mm: 226.70, precio10mm: 255.74, descripcion: 'El formato más versátil. Impacto en cualquier espacio.' },
  { key: 'L',  label: 'L',  dims: '100×70 cm', alto: 100, ancho: 70, precio5mm: 252.94, precio10mm: 298.92, descripcion: 'Presencia máxima. Pensado para paredes protagonistas.' },
]

function calcularPrecioPersonalizado(anchoCm: number, altoCm: number, grosor: '5mm' | '10mm' = '5mm'): number {
  const areaCm2 = altoCm * anchoCm
  let precioPorCm2: number
  if (areaCm2 <= 1500)      precioPorCm2 = 0.85
  else if (areaCm2 <= 2400) precioPorCm2 = 0.69
  else if (areaCm2 <= 4800) precioPorCm2 = 0.55
  else if (areaCm2 <= 7000) precioPorCm2 = 0.407
  else                       precioPorCm2 = 0.32
  const base = Math.round(areaCm2 * precioPorCm2)
  return grosor === '10mm' ? Math.round(base * (298.92 / 252.94)) : base
}

// ─── CONFIGURADOR DE PRECIOS ──────────────────────────────────────────────────
// CAMBIO 5: Se elimina const [encargoEnviado, setEncargoEnviado] = useState(false)
// que estaba en la línea 166 del original dentro de este componente.
// MOTIVO: encargoEnviado es estado del flujo de pago global (App). Este componente
// nunca lo usaba — era código muerto que generaba confusión.
const ConfiguradorPrecios = ({
  onFormatoSelect,
  onGrosorChange,
  selectedGrosor,
  selectedFormat,
}: {
  onFormatoSelect: (fmt: string, precio: number) => void
  onGrosorChange: (g: '5mm' | '10mm') => void
  selectedGrosor: '5mm' | '10mm' | null
  selectedFormat: string | null
}) => {
  const [modoConfig, setModoConfig] = useState<'estandar' | 'personalizado'>('estandar')
  const [anchoCm, setAnchoCm] = useState<number>(60)
  const [altoCm, setAltoCm] = useState<number>(80)
  const [precioPersonalizado, setPrecioPersonalizado] = useState<number>(0)
  const [mostrarDesglose, setMostrarDesglose] = useState(false)

  // Fuente de verdad única: App. Se deriva del string selectedFormat
  const formatoActivo = selectedFormat
    ? (selectedFormat.match(/Formato\s*(XS|S|M|L)/)?.[1] ?? null)
    : null

  useEffect(() => {
    if (modoConfig === 'personalizado') {
      setPrecioPersonalizado(calcularPrecioPersonalizado(anchoCm, altoCm, selectedGrosor ?? '5mm'))
    }
  }, [anchoCm, altoCm, modoConfig, selectedGrosor])

  const handleFormatoEstandar = (fmt: typeof formatosEstandar[0]) => {
    const grosorFinal = selectedGrosor ?? '5mm'
    const precio = grosorFinal === '5mm' ? fmt.precio5mm : fmt.precio10mm
    onFormatoSelect(`Formato ${fmt.label} - ${fmt.dims} · Soporte ${grosorFinal}`, precio)
  }

  const handleGrosor = (g: '5mm' | '10mm') => {
    onGrosorChange(g)
    if (formatoActivo) {
      const fmt = formatosEstandar.find(f => f.key === formatoActivo)
      if (fmt) {
        const precio = g === '5mm' ? fmt.precio5mm : fmt.precio10mm
        onFormatoSelect(`Formato ${fmt.label} - ${fmt.dims} · Soporte ${g}`, precio)
      }
    }
  }

  const handlePersonalizado = () => {
    const label = `Personalizado - ${anchoCm}×${altoCm} cm · Soporte ${selectedGrosor ?? '5mm'}`
    onFormatoSelect(label, precioPersonalizado)
  }

  const areaCm2 = anchoCm * altoCm
  const areaM2 = (areaCm2 / 10000).toFixed(4)

  return (
    <div className="rounded-2xl border border-oro/40 overflow-hidden bg-crema">
      <div className="bg-gradient-to-r from-navy/10 to-oro/10 px-6 py-4 border-b border-oro/20">
        <div className="flex items-center gap-2 mb-1">
          <Ruler className="w-4 h-4 text-oro" />
          <span className="text-sm font-semibold text-navy tracking-wider uppercase">Configurador de formato</span>
        </div>
        <p className="text-xs text-navy/50">Selecciona grosor, tamaño estándar o introduce tus medidas personalizadas</p>
        {selectedFormat && formatoActivo && (
          <p className="text-xs text-oro font-medium mt-1 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            Configuración traída desde la ficha: <strong>{formatoActivo} · {selectedGrosor ?? '–'}</strong>
          </p>
        )}
      </div>

      {/* ── SELECTOR DE GROSOR ── */}
      <div className="px-5 pt-5 pb-3">
        <p className="text-xs font-semibold text-navy/60 tracking-widest uppercase mb-3 flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-oro" />
          Soporte — Grosor del material
        </p>
        <div className="grid grid-cols-2 gap-3">
          {([
            { key: '5mm' as const, label: 'PVC 5 mm', sublabel: 'Ligero · Perfil fino', desc: 'Énfasis en la imagen. Ideal para formatos XS y S.', precio: '164,98 – 252,94 €' },
            { key: '10mm' as const, label: 'PVC 10 mm', sublabel: 'Masa · Profundidad', desc: 'Mayor cimiento visual. Recomendado para M y L.', precio: '181,92 – 298,92 €' },
          ] as const).map(g => {
            const activo = selectedGrosor === g.key
            return (
              <button
                key={g.key}
                type="button"
                onClick={() => handleGrosor(g.key)}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 group ${
                  activo
                    ? 'border-oro bg-oro/10 shadow-[0_0_12px_#D4AF3740]'
                    : 'border-oro/20 hover:border-oro/50 hover:bg-oro/5'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`rounded-sm border-2 transition-colors flex-shrink-0 ${activo ? 'border-oro bg-oro/20' : 'border-navy/30 group-hover:border-oro/50'}`}
                      style={{ width: g.key === '10mm' ? '12px' : '6px', height: '32px' }}
                    />
                    <div>
                      <span className={`block text-sm font-bold leading-tight ${activo ? 'text-navy' : 'text-navy/80'}`}>{g.label}</span>
                      <span className={`block text-[10px] font-semibold tracking-wider uppercase ${activo ? 'text-oro' : 'text-navy/40'}`}>{g.sublabel}</span>
                    </div>
                  </div>
                  {activo && <CheckCircle className="w-4 h-4 text-oro flex-shrink-0" />}
                </div>
                <p className={`text-xs leading-relaxed ${activo ? 'text-navy/70' : 'text-navy/40'}`}>{g.desc}</p>
                <p className={`text-xs font-semibold mt-2 ${activo ? 'text-navy' : 'text-navy/50'}`}>{g.precio}</p>
              </button>
            )
          })}
        </div>
        {!selectedGrosor && (
          <p className="text-[11px] text-amber-600 mt-2 text-center">Selecciona el grosor del soporte para ver los precios exactos</p>
        )}
      </div>

      <div className="flex border-b border-t border-oro/20 mt-3">
        <button
          type="button"
          onClick={() => setModoConfig('estandar')}
          className={`flex-1 py-3 text-sm font-medium transition-all ${modoConfig === 'estandar' ? 'bg-oro/10 text-navy border-b-2 border-oro' : 'text-navy/50 hover:text-navy'}`}
        >
          Formatos estándar
        </button>
        <button
          type="button"
          onClick={() => setModoConfig('personalizado')}
          className={`flex-1 py-3 text-sm font-medium transition-all ${modoConfig === 'personalizado' ? 'bg-oro/10 text-navy border-b-2 border-oro' : 'text-navy/50 hover:text-navy'}`}
        >
          Medidas propias
        </button>
      </div>

      <div className="p-5">
        {modoConfig === 'estandar' ? (
          <div className="space-y-3">
            {formatosEstandar.map((fmt) => {
              const precioMostrar = selectedGrosor
                ? (selectedGrosor === '5mm' ? fmt.precio5mm : fmt.precio10mm)
                : fmt.precio5mm
              return (
                <button
                  key={fmt.key}
                  type="button"
                  onClick={() => handleFormatoEstandar(fmt)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 text-left group ${
                    formatoActivo === fmt.key
                      ? 'border-oro bg-oro/10 shadow-[0_0_12px_#D4AF3740]'
                      : 'border-oro/20 hover:border-oro/60 hover:bg-oro/5'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-end justify-center w-10 h-10 flex-shrink-0">
                      <div
                        className={`border-2 ${formatoActivo === fmt.key ? 'border-oro bg-oro/20' : 'border-navy/30 group-hover:border-oro/50'} transition-colors rounded-sm`}
                        style={{
                          width: `${(fmt.alto / 100) * 32}px`,
                          height: `${(fmt.ancho / 70) * 28}px`,
                          minWidth: '12px',
                          minHeight: '10px',
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${formatoActivo === fmt.key ? 'text-navy' : 'text-navy/80'}`}>
                          Formato {fmt.label}
                        </span>
                        <span className="text-xs text-navy/40 font-mono">{fmt.dims}</span>
                      </div>
                      <p className="text-xs text-navy/50 mt-0.5 max-w-[220px]">{fmt.descripcion}</p>
                      {selectedGrosor && (
                        <div className="flex gap-2 mt-1">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${selectedGrosor === '5mm' ? 'bg-oro/20 border-oro text-navy font-semibold' : 'border-navy/20 text-navy/40'}`}>
                            5mm {fmt.precio5mm.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${selectedGrosor === '10mm' ? 'bg-oro/20 border-oro text-navy font-semibold' : 'border-navy/20 text-navy/40'}`}>
                            10mm {fmt.precio10mm.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-xl font-bold ${formatoActivo === fmt.key ? 'text-navy' : 'text-navy/70'}`}>
                      {precioMostrar.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                    </div>
                    {!selectedGrosor && (
                      <span className="text-[10px] text-navy/30">desde</span>
                    )}
                    {formatoActivo === fmt.key && (
                      <div className="flex items-center gap-1 justify-end mt-1">
                        <CheckCircle className="w-3 h-3 text-oro" />
                        <span className="text-xs text-oro">Seleccionado</span>
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy/60 mb-2 uppercase tracking-wider">Ancho (cm)</label>
                <input
                  type="number"
                  min={20}
                  max={300}
                  value={anchoCm}
                  onChange={e => setAnchoCm(Math.max(20, Math.min(300, Number(e.target.value))))}
                  className="w-full px-4 py-3 bg-white border border-oro/40 rounded-xl text-navy font-mono text-lg font-bold text-center focus:outline-none focus:border-oro focus:ring-1 focus:ring-oro/30"
                />
                <input
                  type="range"
                  min={20}
                  max={300}
                  value={anchoCm}
                  onChange={e => setAnchoCm(Number(e.target.value))}
                  className="w-full mt-2 accent-yellow-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy/60 mb-2 uppercase tracking-wider">Alto (cm)</label>
                <input
                  type="number"
                  min={20}
                  max={300}
                  value={altoCm}
                  onChange={e => setAltoCm(Math.max(20, Math.min(300, Number(e.target.value))))}
                  className="w-full px-4 py-3 bg-white border border-oro/40 rounded-xl text-navy font-mono text-lg font-bold text-center focus:outline-none focus:border-oro focus:ring-1 focus:ring-oro/30"
                />
                <input
                  type="range"
                  min={20}
                  max={300}
                  value={altoCm}
                  onChange={e => setAltoCm(Number(e.target.value))}
                  className="w-full mt-2 accent-yellow-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-center py-4 bg-crema rounded-xl border border-oro/10">
              <div className="relative flex items-center justify-center" style={{ width: '120px', height: '100px' }}>
                <div
                  className="border-2 border-oro/60 bg-oro/10 rounded-sm flex items-center justify-center transition-all duration-300"
                  style={{
                    width: `${Math.min((anchoCm / 300) * 110, 110)}px`,
                    height: `${Math.min((altoCm / 300) * 90, 90)}px`,
                    minWidth: '20px',
                    minHeight: '20px',
                  }}
                >
                  <span className="text-[9px] text-oro/70 font-mono">{anchoCm}×{altoCm}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-oro/20 overflow-hidden">
              <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-oro/5 transition" onClick={() => setMostrarDesglose(!mostrarDesglose)}>
                <div>
                  <span className="text-xs text-navy/50 block mb-0.5">Superficie: {areaCm2.toLocaleString('es-ES')} cm² ({areaM2} m²) · Soporte {selectedGrosor ?? '5mm'}</span>
                  <span className="text-2xl font-bold text-navy">{precioPersonalizado.toLocaleString('es-ES')} €</span>
                  <span className="text-xs text-navy/40 ml-2">IVA incluido</span>
                </div>
                <Info className="w-4 h-4 text-oro/60" />
              </div>
              {mostrarDesglose && (
                <div className="px-4 pb-4 text-xs text-navy/50 space-y-1 border-t border-oro/10 pt-3">
                  <div className="flex justify-between"><span>Material premium (resina + fotografía)</span><span className="font-medium text-navy">{Math.round(precioPersonalizado * 0.6).toLocaleString('es-ES')} €</span></div>
                  <div className="flex justify-between"><span>Sistema de iluminación perimetral</span><span className="font-medium text-navy">{Math.round(precioPersonalizado * 0.25).toLocaleString('es-ES')} €</span></div>
                  <div className="flex justify-between"><span>Acabado y certificación pieza única</span><span className="font-medium text-navy">{Math.round(precioPersonalizado * 0.15).toLocaleString('es-ES')} €</span></div>
                  <div className="border-t border-oro/10 pt-2 flex justify-between font-semibold text-navy">
                    <span>Total</span>
                    <span>{precioPersonalizado.toLocaleString('es-ES')} €</span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handlePersonalizado}
              className="w-full py-3 bg-gradient-to-r from-oro to-navy text-crema font-semibold rounded-xl hover:shadow-lg hover:shadow-oro/20 transition-all duration-300 hover:-translate-y-0.5 text-sm"
            >
              Aplicar medida personalizada — {precioPersonalizado.toLocaleString('es-ES')} €
            </button>
          </div>
        )}
      </div>

      <div className="px-5 pb-5 grid grid-cols-3 gap-3">
        {[
          { icon: Shield, label: 'Pieza certificada' },
          { icon: Package, label: 'Embalaje premium' },
          { icon: Truck, label: 'Envío asegurado' },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-oro/5 border border-oro/10">
            <Icon className="w-4 h-4 text-oro/60" />
            <span className="text-[10px] text-navy/50 text-center leading-tight">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── GALERÍA ──────────────────────────────────────────────────────────────────
const galleryImages = [
  { src: '/images/1obras/limite01/1.webp', title: "LÍMITE 01", description: "Formato L - Fotografía + Resina + Luz" },
  { src: '/images/1obras/limite02/1.webp', title: "LÍMITE 02", description: "Retrato - Blanco y negro - Resina epoxy" },
  { src: '/images/1obras/limite03/1.webp', title: "LÍMITE 03", description: "Formato L - Pieza única" },
  { src: '/images/origen/1.webp', title: "ORIGEN", description: "Formato L - Naturaleza" },
  { src: '/images/2servicios/retrato/1.webp', title: "Retrato", description: "Retratos construidos desde la presencia y la quietud." },
  { src: '/images/2servicios/editorial/1.webp', title: "Editorial / Conceptual", description: "Imagen conceptual como exploración visual, sin finalidad comercial inmediata." },
  { src: '/images/2servicios/obra/1.webp', title: "Fotografía para obra", description: "Algunas imágenes nacen ya con destino físico." },
  { src: '/images/3encargos/imgcliente/1.webp', title: "Imagen del cliente", description: "Retratos construidos desde la presencia y la quietud." },
  { src: '/images/3encargos/sesionFOCUSJEB/1.webp', title: "Sesión fotográfica FOCUS JEB", description: "Imagen esencial como exploración visual, sin finalidad comercial inmediata." },
  { src: '/images/3encargos/personalizada/1.webp', title: "Obra personalizada", description: "Cada pieza se desarrolla a partir de una idea, una imagen y un espacio concreto." },
]

// ─── STRIPE PAYMENT FORM ──────────────────────────────────────────────────────
// CAMBIO 12: Nuevo componente. Solo se monta cuando clientSecret existe y está
// dentro de <Elements>. Confirma el pago con Stripe y envía confirmación por
// Web3Forms. Separado de App para poder usar useStripe/useElements.
const StripePaymentForm = memo(({
  totalPrice,
  formData,
  selectedFormat,
  selectedImages,
  onSuccess,
  onError,
}: {
  totalPrice: number
  formData: FormularioDatos
  selectedFormat: string
  selectedImages: Photo[]
  onSuccess: () => void
  onError: (msg: string) => void
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)

    // Paso 1: confirmar el pago con Stripe
    // redirect: 'if_required' evita que Stripe redirija a otra página.
    // Manejamos el resultado dentro del drawer.
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Stripe envía automáticamente un recibo de pago al cliente.
        // Este email es independiente del email de Web3Forms.
        receipt_email: formData.email,
        payment_method_data: {
          billing_details: {
            name: formData.nombre,
            email: formData.email,
            phone: formData.telefono,
            address: {
              line1: formData.direccion,
              postal_code: formData.codigoPostal,
              country: 'ES',
            },
          },
        },
      },
      redirect: 'if_required',
    })

    if (error) {
      onError(error.message || 'Error al procesar el pago')
      setProcessing(false)
      return
    }

    if (paymentIntent?.status === 'succeeded') {
      // Paso 2: pago OK → enviamos confirmación por Web3Forms
      // MOTIVO del try/catch: si el email falla, el pago ya está confirmado
      // en Stripe. No bloqueamos el flujo — los datos están en el dashboard.
      try {
        const wfData = new FormData()
        wfData.append('access_key', '732ce6fe-2790-45ea-bef1-245ae1e76878')
        // subject legible en bandeja de entrada — antes llegaba como "New Submission"
        wfData.append('subject', `✅ Encargo pagado — FOCUS JEB #${paymentIntent.id.slice(-6).toUpperCase()}`)
        wfData.append('from_name', 'FOCUS JEB Web')
        wfData.append('name', formData.nombre)
        wfData.append('email', formData.email)
        // Web3Forms envía copia al cliente automáticamente cuando hay campo 'email'
        // obras_seleccionadas en texto plano — JSON llegaba ilegible en el email
        wfData.append('message', `
NUEVO ENCARGO PAGADO — FOCUS JEB
════════════════════════════════
Referencia Stripe: ${paymentIntent.id}
Cliente: ${formData.nombre}
Email: ${formData.email}
Teléfono: ${formData.telefono}
Dirección: ${formData.direccion}, ${formData.codigoPostal}

PEDIDO:
Formato: ${selectedFormat}
Obras: ${selectedImages.map(p => p.title).join(', ') || '(encargo personalizado)'}
Total pagado: ${totalPrice.toLocaleString('es-ES')} €

Mensaje del cliente:
${formData.mensaje || '(sin mensaje)'}
        `.trim())

        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: wfData,
        })
      } catch {
        // El pago está confirmado en Stripe aunque el email falle.
        // Los datos del pedido están en dashboard.stripe.com
        console.error('Email de confirmación fallido — revisar Web3Forms dashboard')
      }

      onSuccess()
    }

    setProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Resumen del pedido antes de pagar */}
      <div className="p-4 rounded-xl bg-navy/5 border border-oro/20">
        <p className="text-xs text-navy/50 uppercase tracking-wider mb-1">Total a pagar</p>
        <p className="text-3xl font-bold text-navy">{totalPrice.toLocaleString('es-ES')} €</p>
        <p className="text-xs text-navy/40 mt-1">Formato: {selectedFormat}</p>
      </div>

      {/* Formulario de Stripe — PCI compliant automáticamente */}
      <div className="p-4 rounded-xl border border-oro/30 bg-white">
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full py-4 bg-gradient-to-r from-oro to-navy text-crema font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-oro/20 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-3"
      >
        {processing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Procesando pago...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Pagar {totalPrice.toLocaleString('es-ES')} € — Confirmar encargo
          </>
        )}
      </button>

      <p className="text-center text-xs text-navy/40 flex items-center justify-center gap-1.5">
        <Shield className="w-3.5 h-3.5" />
        Pago seguro con Stripe · SSL · No almacenamos datos de tarjeta
      </p>
    </form>
  )
})

// ─── APP ──────────────────────────────────────────────────────────────────────
function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('inicio')
  const [scrollY, setScrollY] = useState(0)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const [showEncargoDrawer, setShowEncargoDrawer] = useState(false)
  const [selectedImages, setSelectedImages] = useState<Photo[]>([])
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null)
  const [selectedFormatPrice, setSelectedFormatPrice] = useState<number>(0)
  const [selectedGrosor, setSelectedGrosor] = useState<'5mm' | '10mm' | null>(null)
  const [totalPrice, setTotalPrice] = useState(0)
  const [drawerStep, setDrawerStep] = useState<DrawerStep>('resumen')
  const [hasUploadedFile, setHasUploadedFile] = useState(false)

  // ── Estados Stripe y confirmación ─────────────────────────────────────────
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [encargoEnviado, setEncargoEnviado] = useState(false)
  // formData persiste los datos del paso 2 para usarlos en el pago
  const [formData, setFormData] = useState<FormularioDatos | null>(null)

  // ── Detalle de producto (modal tipo tienda) ───────────────────────────────
  const [productoDetalle, setProductoDetalle] = useState<ProductoItem | null>(null)

  // ── Lightbox ──────────────────────────────────────────────────────────────
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activePhotos, setActivePhotos] = useState<Photo[]>([])

  const openGallery = useCallback((photos: Photo[], index: number = 0) => {
    setActivePhotos(photos)
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }, [])

  const addToCart = useCallback((photo: Photo) => {
    setSelectedImages((prev) => {
      if (prev.some((p) => p.src === photo.src)) return prev
      return [...prev, photo]
    })
  }, [])

  const removeFromCart = useCallback((srcToRemove: string) => {
    setSelectedImages((prev) => prev.filter((p) => p.src !== srcToRemove))
  }, [])

  const clearCart = useCallback(() => {
    setSelectedImages([])
    setHasUploadedFile(false)
  }, [])

  const handleFormatoSelect = useCallback((fmt: string, precio: number) => {
    setSelectedFormat(fmt)
    setSelectedFormatPrice(precio)
  }, [])

  const handleFormatoYGrosorDesdeDetalle = useCallback(
    (formato: string, precio: number, grosor: string) => {
      setSelectedFormat(formato)
      setSelectedFormatPrice(precio)
      setSelectedGrosor(grosor as '5mm' | '10mm')
    },
    []
  )

  // CAMBIO 7: Nuevo callback. Puente entre paso 'datos' y paso 'pago'.
  // Llama a la Netlify Function con el importe en céntimos,
  // recibe clientSecret y avanza el drawer al paso de pago.
  // MOTIVO: La secret key de Stripe nunca puede estar en el frontend.
  // La Netlify Function es el servidor que la protege.
  const handleProceedToPayment = useCallback(async (datos: FormularioDatos) => {
    if (!selectedFormat || totalPrice === 0) return

    setPaymentLoading(true)
    setPaymentError(null)
    setFormData(datos)

    try {
      const res = await fetch('/.netlify/functions/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Stripe trabaja en céntimos — nunca decimales
          amount: Math.round(totalPrice * 100),
          orderDetails: {
            formato: selectedFormat,
            obras: selectedImages.map(p => p.title).join(', '),
            email: datos.email,
            nombre: datos.nombre,
          },
        }),
      })

      if (!res.ok) throw new Error('Error del servidor')

      const { clientSecret: secret } = await res.json()
      setClientSecret(secret)
      setDrawerStep('pago')
    } catch {
      setPaymentError('No se pudo iniciar el pago. Inténtalo de nuevo o escríbenos a focusjeb@gmail.com')
    } finally {
      // finally garantiza que paymentLoading siempre vuelve a false
      setPaymentLoading(false)
    }
  }, [selectedFormat, totalPrice, selectedImages])

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          const sections = ['inicio', 'obras', 'fotografia', 'encargos', 'nosotros', 'contacto']
          sections.forEach(section => {
            const element = document.getElementById(section)
            if (element) {
              const rect = element.getBoundingClientRect()
              if (rect.top <= 100 && rect.bottom >= 100) {
                setActiveSection(section)
              }
            }
          })
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id))
          }
        })
      },
      { threshold: 0, rootMargin: '0px 0px 200px 0px' }
    )
    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!selectedFormat) {
      setTotalPrice(0)
      return
    }
    const numPiezas = selectedImages.length || 1
    const total = numPiezas * selectedFormatPrice
    setTotalPrice(Number(total.toFixed(2)))
  }, [selectedImages.length, selectedFormat, selectedFormatPrice])

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }, [])

  const cartCount = selectedImages.length

  return (
    <div className="noise-texture min-h-screen bg-crema text-navy border border-oro overflow-x-hidden relative">
      {/* Barra de progreso de scroll */}
      <div
        className="fixed top-0 left-0 z-[60] h-[2px] bg-gradient-to-r from-oro via-oro/80 to-oro/40 transition-all duration-75"
        style={{ width: `${Math.min((scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100, 100)}%` }}
      />

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrollY > 50
            ? 'bg-[#F5F0E8] border-b border-oro py-4 shadow-sm'
            : 'bg-[#F5F0E8] border-b border-oro/40 py-6'
        }`}
      >
        <div className="w-full px-6 lg:px-12 flex items-center justify-between">
          <button
            onClick={() => scrollToSection('inicio')}
            className="flex items-center gap-3 group"
          >
            <img
              src="/images/logo/2.png"
              alt="FOCUS JEB"
              className="w-9 h-9 transition-transform duration-300 group-hover:scale-110"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight">
                FOCUS<span className="text-navy">JEB</span>
              </span>
              <span className="text-[10px] tracking-[0.3em] text-oro uppercase">
                Estudio Visual
              </span>
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-1 bg-[#ede8de] rounded-full px-2 py-2 border border-oro">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-oro to-oro text-navy shadow-lg shadow-oro/30'
                    : 'text-navy/60 hover:text-navy hover:bg-oro/15'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowEncargoDrawer(true)}
            className="hidden lg:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-oro to-navy border border-oro rounded-full font-medium text-sm hover:shadow-lg hover:shadow-oro/30 transition-all duration-300 hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4" />
            Solicitar encargo
          </button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-12 h-12 flex items-center justify-center rounded-full bg-[#ede8de] border border-oro/40"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <div
          className={`lg:hidden absolute top-full left-0 right-0 bg-[#F5F0E8] border-b border-oro/30 transition-all duration-300 ${
            isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          <div className="p-6 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="w-full text-left px-4 py-4 rounded-xl text-lg font-medium text-navy/80 hover:text-navy hover:bg-oro/10 transition-all duration-200"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => setShowEncargoDrawer(true)}
              className="w-full mt-4 px-4 py-4 bg-gradient-to-r from-oro to-navy rounded-xl font-medium"
            >
              Solicitar encargo
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-oro/5 rounded-full blur-[80px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-navy/5 rounded-full blur-[80px]" />
        </div>

        <div className="relative w-full px-6 lg:px-12 py-20 lg:py-0">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className={`space-y-8 transition-opacity duration-500 ${visibleSections.has('inicio') ? 'opacity-100' : 'opacity-0'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-oro/10 border border-oro">
                <div className="w-2 h-2 rounded-full bg-oro animate-pulse" />
                <span className="text-sm text-navy/60 tracking-wide">Obra fotográfica encapsulada en luz</span>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight text-navy" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  La imagen no{''}
                  <span className="block bg-gradient-to-r from-oro via-navy to-crema bg-clip-text">
                    se mira.
                  </span>
                  <span className="block mt-2">Se habita.</span>
                </h1>
                <p className="text-xl text-navy/50 max-w-lg leading-relaxed">
                  Fotografía transformada en objeto visual mediante resina y luz.
                  Cada pieza pensada para habitar un espacio.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => openGallery(
                    obras[0].image.map(img => ({ src: img, title: obras[0].title })) as Photo[],
                    0
                  )}
                  className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-oro to-navy rounded-full font-semibold text-lg text-crema hover:shadow-2xl hover:shadow-oro/30 transition-all duration-300 hover:-translate-y-1"
                >
                  Ver obras
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => scrollToSection('nosotros')}
                  className="px-8 py-4 rounded-full font-semibold text-lg border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                >
                  Conócenos
                </button>
              </div>

              <div className="flex items-center gap-8 pt-8 border-t border-navy/10">
                <div>
                  <div className="text-3xl font-bold text-navy">12</div>
                  <div className="text-sm text-navy/40">Obras únicas</div>
                </div>
                <div className="w-px h-12 bg-navy/10" />
                <div>
                  <div className="text-3xl font-bold text-navy">5</div>
                  <div className="text-sm text-navy/40">Años de trayectoria</div>
                </div>
                <div className="w-px h-12 bg-navy/10" />
                <div>
                  <div className="text-3xl font-bold text-navy">48</div>
                  <div className="text-sm text-navy/40">Encargos realizados</div>
                </div>
              </div>
            </div>

            <div className={`relative transition-opacity duration-500 delay-150 ${visibleSections.has('inicio') ? 'opacity-100' : 'opacity-0'}`}>
              <div
                className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-oro/40 shadow-[0_0_10px_#D4AF37,0_0_20px_#D4AF37,inset_0_0_10px_#D4AF37] hover:border-oro hover:shadow-[0_0_25px_#D4AF37,0_0_45px_#D4AF37,inset_0_0_20px_#D4AF37] transition-all duration-500 cursor-pointer"
                onClick={() => openGallery(
                  obras[0].image.map(img => ({
                    src: img,
                    title: obras[0].title,
                    description: `${obras[0].subtitle} - ${obras[0].description}`
                  })) as Photo[],
                  0
                )}
              >
                <img
                  src={galleryImages[0].src}
                  alt="Obra fotográfica con luz perimetral"
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    addToCart({
                      src: obras[0].image[0],
                      title: obras[0].title,
                      description: obras[0].subtitle + ' - ' + obras[0].description,
                    })
                  }}
                  className="absolute bottom-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-oro/90 text-navy shadow-lg hover:bg-oro hover:scale-110 active:scale-95 transition-all duration-200"
                  title="Solicitar encargo similar"
                >
                  <ShoppingCart size={18} />
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl" />
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#F5F0E8]/90 rounded-2xl border border-oro/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-oro">LÍMITE 01</p>
                      <p className="text-oro font-semibold">Resina epoxy con luz perimetral</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-oro to-navy flex items-center justify-center">
                      <Sun className="w-6 h-6 text-oro" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-crema-500/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-oro-500/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Obras Section */}
      <section id="obras" className="relative py-24">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className={`text-center max-w-3xl mx-auto mb-12 transition-opacity duration-600 ${visibleSections.has('obras') ? 'opacity-100' : 'opacity-0'}`}>
              <span className="inline-block px-4 py-2 rounded-full bg-oro/10 border border-oro text-navy text-xs font-semibold mb-6 tracking-widest uppercase">Colección</span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Obras</h2>
              <p className="text-xl text-navy/50 leading-relaxed">Cada obra es una pieza única. No reproducimos imágenes en serie.</p>
            </div>
            <GrillaProductos
              items={obras.map(o => ({ ...o, categoria: 'Obras' }))}
              cols={4}
              isVisible={visibleSections.has('obras')}
              onVerDetalle={item => setProductoDetalle(item)}
              onAddToCart={addToCart}
            />
          </div>
        </div>
      </section>

      {/* Fotografía Section */}
      <section id="fotografia" className="relative py-24 bg-crema">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-oro-500/5 to-transparent" />
        <div className="relative w-full px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className={`max-w-3xl mb-12 transition-opacity duration-600 ${visibleSections.has('fotografia') ? 'opacity-100' : 'opacity-0'}`}>
              <span className="inline-block px-4 py-2 rounded-full bg-oro/10 border border-oro text-navy text-xs font-semibold mb-6 tracking-widest uppercase">Servicios</span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Fotografía</h2>
              <p className="text-xl text-navy/50 leading-relaxed">La fotografía es el punto de partida de nuestro trabajo.</p>
            </div>
            <GrillaProductos
              items={servicios.map(s => ({ ...s, categoria: 'Fotografía' }))}
              cols={3}
              isVisible={visibleSections.has('fotografia')}
              onVerDetalle={item => setProductoDetalle(item)}
              onAddToCart={addToCart}
            />
          </div>
        </div>
      </section>

      {/* Encargos Section */}
      <section id="encargos" className="relative py-24">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className={`text-center max-w-3xl mx-auto mb-12 transition-opacity duration-600 ${visibleSections.has('encargos') ? 'opacity-100' : 'opacity-0'}`}>
              <span className="inline-block px-4 py-2 rounded-full bg-oro/10 border border-oro text-navy text-xs font-semibold mb-6 tracking-widest uppercase">Trabajos a medida</span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Encargos</h2>
              <p className="text-xl text-navy/50 leading-relaxed">Los encargos se realizan de forma limitada...</p>
            </div>
            <GrillaProductos
              items={encargos.map((e, idx) => ({ ...e, id: idx, categoria: 'Encargos' }))}
              cols={3}
              isVisible={visibleSections.has('encargos')}
              onVerDetalle={item => setProductoDetalle(item)}
              onAddToCart={addToCart}
            />
          </div>
        </div>
      </section>

      {/* Nosotros Section */}
      <section id="nosotros" className="relative py-32 bg-crema">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-crema-500/5 to-transparent" />
        <div className="relative w-full px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className={`transition-opacity duration-600 ${visibleSections.has('nosotros') ? 'opacity-100' : 'opacity-0'}`}>
                <span className="inline-block px-4 py-2 rounded-full bg-oro/10 border border-oro text-navy text-xs font-semibold mb-6 tracking-widest uppercase">
                  Sobre nosotros
                </span>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Imagen convertida{' '}
                  <span className="bg-gradient-to-r from-navy to-navy bg-clip-text">
                    en objeto.
                  </span>
                </h2>
                <div className="space-y-6 text-lg text-navy/60 leading-relaxed">
                  <p>
                    FOCUS JEB es un estudio visual que trabaja con imagen, materia y luz
                    para crear otro diálogo posible entre el objeto, la imagen y el espectador.
                  </p>
                  <p>
                    Somos un estudio especializado en transformar fotografía en objeto visual
                    a través de resina y luz. Cada obra encapsulada en resina es única y
                    diseñada para habitar espacios, trascendiendo su naturaleza bidimensional.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 mt-8">
                  {['Retrato', 'Presencia', 'Materia', 'Luz', 'Resina'].map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 rounded-full bg-white/5 border border-navy/10 text-navy/60 hover:border-oro hover:text-navy transition-all duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className={`relative transition-opacity duration-600 delay-200 ${visibleSections.has('nosotros') ? 'opacity-100' : 'opacity-0'}`}>
                <div className="relative">
                  <div className="aspect-square rounded-3xl overflow-hidden border border-oro">
                    <img
                      src="/images/logo/1.png"
                      alt="Proceso de trabajo"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-crema to-transparent" />
                  </div>
                  <div className="absolute -bottom-8 -left-8 p-6 bg-crema backdrop-blur-xl rounded-2xl border border-oro shadow-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-navy border border-oro flex items-center justify-center">
                        <Layers className="w-6 h-6 text-oro" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">Piezas Únicas</div>
                        <div className="text-sm text-navy/50">sin reproducción</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto Section — SIMPLIFICADA */}
      {/* CAMBIO: El formulario de contacto fue eliminado por tener:
          1. className="hidden" que lo hacía invisible (bug)
          2. bot-field duplicado múltiples veces
          3. Funcionalidad duplicada con el drawer
          Ahora es solo información de contacto + CTA al drawer */}
      <section id="contacto" className="relative py-32 bg-crema">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className={`max-w-2xl mb-16 transition-opacity duration-600 ${visibleSections.has('contacto') ? 'opacity-100' : 'opacity-0'}`}>
              <span className="inline-block px-4 py-2 rounded-full bg-oro/10 border border-oro text-navy text-xs font-semibold mb-6 tracking-widest uppercase">
                Contacto
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Hablemos de tu proyecto
              </h2>
              <p className="text-xl text-navy/50">
                Estamos en Benidorm, creando piezas fotográficas únicas para todo el mundo.
              </p>
            </div>

            <div className={`grid sm:grid-cols-3 gap-6 transition-opacity duration-600 delay-100 ${visibleSections.has('contacto') ? 'opacity-100' : 'opacity-0'}`}>
              <a
                href="mailto:focusjeb@gmail.com"
                className="group flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-oro hover:shadow-[0_0_20px_#D4AF3740] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-oro/10 flex items-center justify-center group-hover:bg-oro/20 transition-colors">
                  <Mail className="w-5 h-5 text-navy" />
                </div>
                <div>
                  <div className="text-xs text-navy/50 mb-1">Email</div>
                  <div className="font-medium text-navy">focusjeb@gmail.com</div>
                </div>
                <ChevronRight className="w-5 h-5 text-navy/30 ml-auto group-hover:text-navy group-hover:translate-x-1 transition-all duration-300" />
              </a>

              <div className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-oro">
                <div className="w-12 h-12 rounded-full bg-oro/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-navy" />
                </div>
                <div>
                  <div className="text-xs text-navy/50 mb-1">Ubicación</div>
                  <div className="font-medium text-navy">Benidorm, España</div>
                </div>
              </div>

              <a
                href="https://www.instagram.com/focus_jeb"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-oro hover:shadow-[0_0_20px_#D4AF3740] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-oro/10 flex items-center justify-center group-hover:bg-oro/20 transition-colors">
                  <Instagram className="w-5 h-5 text-navy" />
                </div>
                <div>
                  <div className="text-xs text-navy/50 mb-1">Instagram</div>
                  <div className="font-medium text-navy">@focusjeb</div>
                </div>
                <ChevronRight className="w-5 h-5 text-navy/30 ml-auto group-hover:text-navy group-hover:translate-x-1 transition-all duration-300" />
              </a>
            </div>

            <div className={`mt-12 text-center transition-opacity duration-600 delay-200 ${visibleSections.has('contacto') ? 'opacity-100' : 'opacity-0'}`}>
              <p className="text-navy/50 mb-6 text-lg">
                ¿Tienes un proyecto en mente? Solicita tu encargo directamente.
              </p>
              <button
                onClick={() => { setShowEncargoDrawer(true); setDrawerStep('resumen') }}
                className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-oro to-navy text-crema font-semibold text-lg rounded-full hover:shadow-2xl hover:shadow-oro/30 transition-all duration-300 hover:-translate-y-1"
              >
                <Sparkles className="w-5 h-5" />
                Solicitar encargo
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-oro/20">
        <div className="w-full px-2 lg:px-3 py-4 text-center border-b border-oro/10">
          <p className="text-3xl font-light text-navy/70 max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            "Cada imagen merece un cuerpo."
          </p>
          <div className="w-32 h-px bg-oro mx-auto mt-8" />
        </div>
        <div className="w-full px-6 lg:px-12 py-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src="/images/logo/2.png" alt="FOCUS JEB" className="w-9 h-9" />
              <span className="text-lg font-bold">
                FOCUS<span className="text-oro">JEB</span>
              </span>
            </div>
            <p className="text-navy/40 text-sm">
              © 2025 FOCUS JEB. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/focus_jeb"
                className="w-10 h-10 rounded-full bg-white/5 border border-navy/10 flex items-center justify-center hover:border-oro/50 hover:text-oro transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="mailto:focusjeb@gmail.com"
                className="w-10 h-10 rounded-full bg-white/5 border border-navy/10 flex items-center justify-center hover:border-oro/50 hover:text-oro transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Botón flotante carrito */}
      {!showEncargoDrawer && (
        <button
          onClick={() => { setShowEncargoDrawer(true); setDrawerStep('resumen') }}
          className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-oro to-navy text-crema shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-crema/30"
        >
          <ShoppingCart size={22} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center border-2 border-crema shadow-lg">
              {cartCount}
            </span>
          )}
        </button>
      )}

      {/* ── DRAWER DE ENCARGO ────────────────────────────────────────────────── */}
      {showEncargoDrawer && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowEncargoDrawer(false)}
          />

          <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#F5F0E8] rounded-t-3xl max-h-[94vh] overflow-y-auto border-t-4 border-oro shadow-2xl">

            {/* Header drawer */}
            <div className="sticky top-0 bg-[#F5F0E8] border-b border-oro/30 px-6 py-5 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDrawerStep('resumen')}
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-oro to-navy text-crema flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 shadow-md border-2 border-crema/20"
                  >
                    <ShoppingCart size={18} />
                  </button>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-crema shadow">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-navy">Solicitar encargo</h3>
                  <p className="text-sm text-navy/60">
                    {cartCount} pieza{cartCount !== 1 ? 's' : ''} seleccionada{cartCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* CAMBIO 8: Steps actualizados de 2 a 3 pasos.
                  Navegación solo hacia atrás desde pago — no se puede saltar datos. */}
              <div className="hidden sm:flex items-center gap-2 text-xs">
                {(['resumen', 'datos', 'pago'] as const).map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (step === 'resumen' && drawerStep !== 'pago') setDrawerStep('resumen')
                        if (step === 'datos' && drawerStep === 'pago') setDrawerStep('datos')
                      }}
                      className="flex items-center gap-1.5"
                    >
                      <span
                        className={`text-xl font-light transition-all duration-300 ${drawerStep === step ? 'text-oro' : 'text-navy/20'}`}
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        0{i + 1}
                      </span>
                      <span className={`text-xs tracking-widest uppercase transition-all duration-300 ${drawerStep === step ? 'text-navy' : 'text-navy/30'}`}>
                        {step === 'resumen' ? 'Formato' : step === 'datos' ? 'Datos' : 'Pago'}
                      </span>
                    </button>
                    {i < 2 && <div className="w-6 h-px bg-oro/30" />}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowEncargoDrawer(false)}
                className="text-navy/70 hover:text-navy"
              >
                <X size={28} />
              </button>
            </div>

            {/* CAMBIO 9: El <form> único fue eliminado.
                Cada paso gestiona su propio submit.
                - Paso 'resumen': sin submit, botón type="button"
                - Paso 'datos': div con id, botón type="button" → handleProceedToPayment
                - Paso 'pago': StripePaymentForm con su propio <form> interno */}
            <div className="p-6 space-y-6">

              {/* PASO 1: RESUMEN + UPLOAD */}
              {drawerStep === 'resumen' && (
                <>
                  {cartCount === 0 ? (
                    <div className="text-center py-10 border border-dashed border-oro/30 rounded-3xl bg-crema">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-oro/30" />
                      <p className="text-navy/60 font-medium">No has seleccionado ninguna obra de la galería</p>
                      <p className="text-sm text-navy/40 mt-1">Puedes solicitar un encargo personalizado con el formato elegido.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {selectedImages.map((photo, i) => (
                        <div key={i} className="relative group">
                          <img
                            src={photo.src}
                            alt={photo.title}
                            className="w-full aspect-[3/4] object-cover rounded-xl shadow-md border border-oro/20"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent h-1/2 rounded-b-xl" />
                          <div className="absolute bottom-2 left-2 right-2 text-white text-xs">
                            <p className="font-semibold line-clamp-1">{photo.title}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(photo.src)}
                            className="absolute top-2 right-2 bg-red-500/90 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <ConfiguradorPrecios
                    onFormatoSelect={handleFormatoSelect}
                    onGrosorChange={setSelectedGrosor}
                    selectedGrosor={selectedGrosor}
                    selectedFormat={selectedFormat}
                  />

                  {selectedFormat && cartCount > 0 && (
                    <div className="rounded-2xl border border-oro/30 bg-gradient-to-r from-navy/5 to-oro/5 p-5">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-navy/60 text-sm">
                          {cartCount} pieza{cartCount !== 1 ? 's' : ''} × {selectedFormatPrice.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                        </span>
                        <span className="text-3xl font-bold text-navy">{totalPrice.toLocaleString('es-ES')} €</span>
                      </div>
                      <p className="text-xs text-navy/40">Formato: {selectedFormat} · IVA incluido</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-navy/70 mb-2">
                      Sube imágenes de referencia{' '}
                      <span className="text-navy/40 font-normal">(opcional si seleccionas obra de la galería)</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={e => setHasUploadedFile(!!(e.target.files && e.target.files.length > 0))}
                      className="w-full px-4 py-3 bg-white border border-oro rounded-xl text-navy file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:bg-oro file:text-navy hover:file:bg-oro/90"
                    />
                    <p className="text-xs text-navy/40 mt-2">Máx. 50MB total</p>

                    <div className={`mt-3 px-4 py-2 rounded-xl text-xs flex items-center gap-2 ${
                      cartCount > 0 || hasUploadedFile
                        ? 'bg-green-50 border border-green-200 text-green-700'
                        : 'bg-amber-50 border border-amber-200 text-amber-700'
                    }`}>
                      {cartCount > 0 || hasUploadedFile ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>
                            {cartCount > 0 && hasUploadedFile
                              ? `${cartCount} obra${cartCount !== 1 ? 's' : ''} de galería + imagen propia subida`
                              : cartCount > 0
                              ? `${cartCount} obra${cartCount !== 1 ? 's' : ''} seleccionada${cartCount !== 1 ? 's' : ''} de la galería`
                              : 'Imagen propia subida correctamente'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Info className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>Selecciona al menos una obra de la galería o sube una imagen para continuar</span>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!selectedFormat || (!cartCount && !hasUploadedFile)}
                    onClick={() => setDrawerStep('datos')}
                    className="w-full py-4 bg-gradient-to-r from-oro to-navy text-crema font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-oro/20 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    Continuar con mis datos
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* PASO 2: DATOS PERSONALES
                  CAMBIO 10: Ya no es un <form> con submit nativo.
                  El div tiene id="drawer-datos-form" para leer sus campos.
                  El botón es type="button" y llama a handleProceedToPayment. */}
              {drawerStep === 'datos' && (
                <div id="drawer-datos-form" className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-navy/70 mb-2">Nombre y apellido *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full px-4 py-4 bg-white border border-oro rounded-xl text-navy focus:outline-none focus:ring-1 focus:ring-oro"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy/70 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-4 py-4 bg-white border border-oro rounded-xl text-navy focus:outline-none focus:ring-1 focus:ring-oro"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-navy/70 mb-2">Teléfono *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        className="w-full px-4 py-4 bg-white border border-oro rounded-xl text-navy focus:outline-none focus:ring-1 focus:ring-oro"
                        placeholder="+34 600 000 000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy/70 mb-2">Código postal *</label>
                      <input
                        type="text"
                        name="postal_code"
                        required
                        className="w-full px-4 py-4 bg-white border border-oro rounded-xl text-navy focus:outline-none focus:ring-1 focus:ring-oro"
                        placeholder="03500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy/70 mb-2">Dirección de envío *</label>
                    <input
                      type="text"
                      name="address"
                      required
                      className="w-full px-4 py-4 bg-white border border-oro rounded-xl text-navy focus:outline-none focus:ring-1 focus:ring-oro"
                      placeholder="Calle, número, piso..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy/70 mb-2">Mensaje / notas adicionales</label>
                    <textarea
                      name="message"
                      rows={3}
                      className="w-full px-4 py-4 bg-white border border-oro rounded-xl text-navy resize-none focus:outline-none focus:ring-1 focus:ring-oro"
                      placeholder="Cuéntanos sobre tu proyecto..."
                    />
                  </div>

                  {/* Error al crear el PaymentIntent */}
                  {paymentError && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{paymentError}</p>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDrawerStep('resumen')}
                      className="py-4 rounded-xl border border-oro text-navy font-semibold hover:bg-oro/10 transition-all duration-300"
                    >
                      ← Volver
                    </button>
                    <button
                      type="button"
                      disabled={paymentLoading}
                      onClick={() => {
                        // Leemos el div por id y validamos los inputs requeridos
                        const container = document.getElementById('drawer-datos-form')
                        if (!container) return
                        const inputs = container.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea')
                        // Validación nativa del navegador en cada campo requerido
                        for (const input of inputs) {
                          if (!input.checkValidity()) {
                            input.reportValidity()
                            return
                          }
                        }
                        const get = (name: string) =>
                          (container.querySelector(`[name="${name}"]`) as HTMLInputElement)?.value ?? ''

                        handleProceedToPayment({
                          nombre: get('name'),
                          email: get('email'),
                          telefono: get('phone'),
                          direccion: get('address'),
                          codigoPostal: get('postal_code'),
                          mensaje: get('message'),
                        })
                      }}
                      className="py-4 bg-gradient-to-r from-oro to-navy text-crema font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-oro/20 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {paymentLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Preparando pago...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          Ir al pago
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* PASO 3: PAGO CON STRIPE
                  CAMBIO 11: Nuevo bloque. Solo se monta cuando clientSecret existe.
                  Elements personalizado con la paleta de la marca. */}
              {drawerStep === 'pago' && clientSecret && (
                <div className="space-y-4">

                  {/* Banner de confirmación post-pago */}
                  {encargoEnviado && (
                    <div className="p-5 rounded-2xl bg-green-50 border border-green-200 flex items-center gap-4">
                      <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-green-800">¡Pago confirmado! Encargo recibido.</p>
                        <p className="text-sm text-green-700 mt-0.5">
                          Te hemos enviado la confirmación a <strong>{formData?.email}</strong>.
                          También recibirás el recibo de pago de Stripe.
                        </p>
                      </div>
                    </div>
                  )}

                  {!encargoEnviado && (
                    <>
                      {/* Resumen compacto de datos */}
                      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-navy/5 border border-oro/10">
                        <div className="text-sm text-navy/60">
                          <span className="font-medium text-navy">{formData?.nombre}</span>
                          <span className="mx-2">·</span>
                          {formData?.email}
                        </div>
                        <button
                          type="button"
                          onClick={() => setDrawerStep('datos')}
                          className="text-xs text-oro hover:text-navy transition-colors underline underline-offset-2"
                        >
                          Editar
                        </button>
                      </div>

                      {/* Error de Stripe */}
                      {paymentError && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-red-700">{paymentError}</p>
                        </div>
                      )}

                      {/* Stripe Elements con paleta de marca */}
                      <Elements
                        stripe={stripePromise}
                        options={{
                          clientSecret,
                          appearance: {
                            theme: 'stripe',
                            variables: {
                              colorPrimary: '#D4AF37',
                              colorBackground: '#ffffff',
                              colorText: '#2C3E50',
                              colorDanger: '#ef4444',
                              fontFamily: 'Inter, system-ui, sans-serif',
                              borderRadius: '12px',
                            },
                          },
                        }}
                      >
                        <StripePaymentForm
                          totalPrice={totalPrice}
                          formData={formData!}
                          selectedFormat={selectedFormat!}
                          selectedImages={selectedImages}
                          onSuccess={() => {
                            setEncargoEnviado(true)
                            clearCart()
                            setSelectedFormat(null)
                            setSelectedFormatPrice(0)
                            // Cerramos el drawer automáticamente tras 5 segundos
                            setTimeout(() => {
                              setEncargoEnviado(false)
                              setShowEncargoDrawer(false)
                              setDrawerStep('resumen')
                              setClientSecret(null)
                            }, 5000)
                          }}
                          onError={(msg) => setPaymentError(msg)}
                        />
                      </Elements>
                    </>
                  )}
                </div>
              )}

            </div>
          </div>
        </>
      )}

      {/* Modal detalle de producto */}
      {productoDetalle && (
        <ProductoDetalle
          producto={productoDetalle}
          onClose={() => setProductoDetalle(null)}
          onAddToCart={addToCart}
          onSolicitarEncargo={() => {
            setProductoDetalle(null)
            setShowEncargoDrawer(true)
            setDrawerStep('resumen')
          }}
          onFormatoYGrosorSelect={handleFormatoYGrosorDesdeDetalle}
        />
      )}

      {/* Lightbox */}
      {lightboxOpen && activePhotos.length > 0 && (
        <Lightbox
          images={activePhotos}
          currentIndex={currentImageIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onNext={() => setCurrentImageIndex(prev => Math.min(prev + 1, activePhotos.length - 1))}
          onPrev={() => setCurrentImageIndex(prev => Math.max(prev - 1, 0))}
          onGoTo={(index) => setCurrentImageIndex(index)}
          onAddToCart={(photo) => { addToCart(photo) }}
        />
      )}
    </div>
  )
}

export default App
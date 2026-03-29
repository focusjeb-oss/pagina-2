import { useState, useEffect, useCallback, memo } from 'react'
import { Menu, X, ArrowRight, Mail, MapPin, Instagram, ChevronRight, Sparkles, Layers, Sun, ShoppingCart, Ruler, CheckCircle, Info, Shield, Package, Truck } from 'lucide-react'
import Lightbox from './components/Lightbox'

export interface Photo {
  src: string;
  title: string;
  description?: string;
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
      prices: { L: 2850, M: 2250, S: 1650, XS: 1250 }
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
      prices: { L: 2850, M: 2250, S: 1650, XS: 1250 }
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
      prices: { L: 2850, M: 2250, S: 1650, XS: 1250 }
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
      prices: { L: 2850, M: 2250, S: 1650, XS: 1250 }
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
      prices: { L: 2850, M: 2250, S: 1650, XS: 1250 }
    },
    {
      id: 2,
      title: 'Editorial / Conceptual',
      description: 'Imagen conceptual como exploración visual, sin finalidad comercial inmediata.',
      image: [
        '/images/2servicios/editorial/1.webp',
        '/images/2servicios/editorial/2.webp'
      ],
      prices: { L: 2850, M: 2250, S: 1650, XS: 1250 }
    },
    {
      id: 3,
      title: 'Fotografía para obra',
      description: 'Algunas imágenes nacen ya con destino físico.',
      image: [
        '/images/2servicios/obra/1.webp',
        '/images/2servicios/obra/2.webp'
      ],
      prices: { L: 2850, M: 2250, S: 1650, XS: 1250 }
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
      prices: { L: 2850, M: 2250, S: 1650, XS: 1250 }
    },
    {
      title: 'Sesión fotográfica FOCUS JEB',
      description: 'Imagen esencial como exploración visual, sin finalidad comercial inmediata.',
      image: [
        '/images/3encargos/sesionFOCUSJEB/1.webp',
        '/images/3encargos/sesionFOCUSJEB/2.webp',
        '/images/3encargos/sesionFOCUSJEB/3.webp'
      ],
      prices: { L: 2850, M: 2250, S: 1650, XS: 1250 }
    },
    {
      title: 'Obra personalizada',
      description: 'Cada pieza se desarrolla a partir de una idea, una imagen y un espacio concreto.',
      image: [
        '/images/3encargos/personalizada/1.webp',
        '/images/3encargos/personalizada/2.webp'
      ],
      prices: { L: 2850, M: 2250, S: 1650, XS: 1250 }
    },
  ]

  const formatosEstandar = [
  { key: 'XS', label: 'XS', dims: '50×30 cm', ancho: 50, alto: 30, precio: 1250, descripcion: 'Pieza íntima, ideal para espacios reducidos o colecciones.' },
  { key: 'S',  label: 'S',  dims: '60×40 cm', ancho: 60, alto: 40, precio: 1650, descripcion: 'Equilibrio entre presencia y discreción.' },
  { key: 'M',  label: 'M',  dims: '80×60 cm', ancho: 80, alto: 60, precio: 2250, descripcion: 'El formato más versátil. Impacto en cualquier espacio.' },
  { key: 'L',  label: 'L',  dims: '100×70 cm', ancho: 100, alto: 70, precio: 2850, descripcion: 'Presencia máxima. Pensado para paredes protagonistas.' },
]


function calcularPrecioPersonalizado(anchoCm: number, altoCm: number): number {
  const areaCm2 = anchoCm * altoCm
  let precioPorCm2: number
  if (areaCm2 <= 1500)      precioPorCm2 = 0.85
  else if (areaCm2 <= 2400) precioPorCm2 = 0.69
  else if (areaCm2 <= 4800) precioPorCm2 = 0.55
  else if (areaCm2 <= 7000) precioPorCm2 = 0.407
  else                       precioPorCm2 = 0.32
  return Math.round(areaCm2 * precioPorCm2)
}

// ─── COMPONENTE CONFIGURADOR DE PRECIOS (CORREGIDO + OPTIMIZADO) ─────────────
const ConfiguradorPrecios = memo(({ onFormatoSelect }: { onFormatoSelect: (fmt: string, precio: number) => void }) => {
  const [modoConfig, setModoConfig] = useState<'estandar' | 'personalizado'>('estandar')
  const [formatoActivo, setFormatoActivo] = useState<string | null>(null)
  const [anchoCm, setAnchoCm] = useState<number>(80)
  const [altoCm, setAltoCm] = useState<number>(60)
  const [precioPersonalizado, setPrecioPersonalizado] = useState<number>(0)
  const [mostrarDesglose, setMostrarDesglose] = useState(false)

  useEffect(() => {
    if (modoConfig === 'personalizado') {
      setPrecioPersonalizado(calcularPrecioPersonalizado(anchoCm, altoCm))
    }
  }, [anchoCm, altoCm, modoConfig])

  const handleFormatoEstandar = useCallback((fmt: typeof formatosEstandar[0]) => {
    setFormatoActivo(fmt.key)
    onFormatoSelect(`${fmt.label} - ${fmt.dims}`, fmt.precio)
  }, [onFormatoSelect])

  const handlePersonalizado = useCallback(() => {
    const label = `Personalizado - ${anchoCm}×${altoCm} cm`
    onFormatoSelect(label, precioPersonalizado)
  }, [anchoCm, altoCm, precioPersonalizado, onFormatoSelect])

  const areaCm2 = anchoCm * altoCm
  const areaM2 = (areaCm2 / 10000).toFixed(4)

  return (
    <div className="rounded-2xl border border-oro/40 overflow-hidden bg-crema">
      {/* Header configurador */}
      <div className="bg-gradient-to-r from-navy/10 to-oro/10 px-6 py-4 border-b border-oro/20">
        <div className="flex items-center gap-2 mb-1">
          <Ruler className="w-4 h-4 text-oro" />
          <span className="text-sm font-semibold text-navy tracking-wider uppercase">Configurador de formato</span>
        </div>
        <p className="text-xs text-navy/50">Selecciona un tamaño estándar o introduce tus medidas personalizadas</p>
      </div>

      {/* Pestañas modo */}
      <div className="flex border-b border-oro/20">
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
            {formatosEstandar.map((fmt) => (
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
                        width: `${(fmt.ancho / 100) * 32}px`,
                        height: `${(fmt.alto / 70) * 28}px`,
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
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-xl font-bold ${formatoActivo === fmt.key ? 'text-navy' : 'text-navy/70'}`}>
                    {fmt.precio.toLocaleString('es-ES')} €
                  </div>
                  {formatoActivo === fmt.key && (
                    <div className="flex items-center gap-1 justify-end mt-1">
                      <CheckCircle className="w-3 h-3 text-oro" />
                      <span className="text-xs text-oro">Seleccionado</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
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
                  <span className="text-xs text-navy/50 block mb-0.5">Superficie: {areaCm2.toLocaleString('es-ES')} cm² ({areaM2} m²)</span>
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

      {/* Garantías */}
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
})

// Array de imágenes para la galería (ACTUALIZA ESTAS URLs CON TUS IMÁGENES REALES)
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

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('inicio')
  const [scrollY, setScrollY] = useState(0)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const [showEncargoDrawer, setShowEncargoDrawer] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Photo[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [selectedFormatPrice, setSelectedFormatPrice] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [drawerStep, setDrawerStep] = useState<'resumen' | 'datos' | 'confirmacion'>('resumen')
  const [hasUploadedFile, setHasUploadedFile] = useState(false)

  // Estados para el Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activePhotos, setActivePhotos] = useState<Photo[]>([]);
  const [message, setMessage] = useState("")
  const openGallery = useCallback((photos: Photo[], index: number = 0) => {
    setActivePhotos(photos);
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  }, []);

  const addToCart = useCallback((photo: Photo) => {
    setSelectedImages((prev) => {
      if (prev.some((p) => p.src === photo.src)) return prev;
      return [...prev, photo];
    });
    }, []);
    const removeFromCart = useCallback((srcToRemove: string) => {
      setSelectedImages((prev) => prev.filter((p) => p.src !== srcToRemove));
      }, []);
      const clearCart = useCallback(() => { setSelectedImages([]); setHasUploadedFile(false); }, []);
      const handleFormatoSelect = useCallback((fmt: string, precio: number) => {
         setSelectedFormat(fmt)
         setSelectedFormatPrice(precio)
        }, []);

    const addFormatToMessage = (format: string) => {
      setMessage(prev => prev + `\nFormato seleccionado: ${format}`)
     };
  
  
useEffect(() => {
  let rafId: number;

  const handleScroll = () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      setScrollY(window.scrollY);
      const sections = ['inicio', 'obras', 'fotografia', 'encargos', 'nosotros', 'contacto'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('scroll', handleScroll);
  };
}, []);

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
      setTotalPrice(0);
      return;
    }

    const numPiezas = selectedImages.length || 1;
    const total = numPiezas * selectedFormatPrice;
    setTotalPrice(Math.round(total));
  }, [selectedImages.length, selectedFormat, selectedFormatPrice]);

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

          {/* Desktop Menu */}
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}className="lg:hidden w-12 h-12 flex items-center justify-center rounded-full bg-[#ede8de] border border-oro/40"
            
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
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
      <section
        id="inicio"
        className="relative min-h-screen flex items-center pt-20"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-oro/5 rounded-full blur-[80px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-navy/5 rounded-full blur-[80px]" />
        </div>

        <div className="relative w-full px-6 lg:px-12 py-20 lg:py-0">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div
              className={`space-y-8 transition-opacity duration-500 ${
                visibleSections.has('inicio') ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-oro/10 border border-oro">
                <div className="w-2 h-2 rounded-full bg-oro animate-pulse" />
                <span className="text-sm text-navy/60 tracking-wide">
                  Obra fotográfica encapsulada en luz
                </span>
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
                  <div className="text-3xl font-bold text-navy-400">5</div>
                  <div className="text-sm text-navy/40">Años de trayectoria</div>
                </div>
                <div className="w-px h-12 bg-navy/10" />
                <div>
                  <div className="text-3xl font-bold text-navy-400">48</div>
                  <div className="text-sm text-navy/40">Encargos realizados</div>
                </div>
              </div>
            </div>

            <div
                className={`relative transition-opacity duration-500 delay-150 ${
                  visibleSections.has('inicio') ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div 
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-oro/40 shadow-[0_0_10px_#D4AF37,0_0_20px_#D4AF37,inset_0_0_10px_#D4AF37] hover:border-oro hover:shadow-[0_0_25px_#D4AF37,0_0_45px_#D4AF37,inset_0_0_20px_#D4AF37] transition-all duration-500 cursor-pointer"
                  onClick={() => openGallery(
                    obras[0].image.map(img => ({
                    src: img,
                    title: obras[0].title,
                    description: `${obras[0].subtitle} - ${obras[0].description}`})) as Photo[],
                    0
                  )}
                >
                  <img
                    src={galleryImages[0].src}
                    alt="Obra fotográfica con luz perimetral"
                    className="w-full h-full object-cover transition-transform duration-700  group-hover:grayscale-0 group-hover:scale-105"
                  />
                  <button
                   onClick={(e) => {
                    e.stopPropagation(); // evita abrir la galería/lightbox
                    addToCart({
                    src: obras[0].image[0],
                    title: obras[0].title,
                    description: obras[0].subtitle + " - " + obras[0].description,
                    });           
                  }}
                    className="absolute bottom-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-oro/90 text-navy shadow-lg hover:bg-oro hover:scale-110 active:scale-95 transition-all duration-200"
                    title="Solicitar encargo similar"
                     >
                     <ShoppingCart size={18} />
                   </button>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl" />
                
                {/* Floating badge */}
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#F5F0E8]/90 rounded-2xl border border-oro/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-oro">LÍMITE 01</p>
                      <p className="text-oro lg font-semibold">Resina epoxy con luz perimetral</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-oro to-navy flex items-center justify-center">
                      <Sun className="w-6 h-6 text-oro" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-crema-500/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-oro-500/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

       {/* Obras Section */}
<section id="obras" className="relative py-32">
  <div className="w-full px-6 lg:px-12">
    <div className="max-w-7xl mx-auto">
      <div className={`text-center max-w-3xl mx-auto mb-16 transition-opacity duration-600 ${visibleSections.has('obras') ? 'opacity-100' : 'opacity-0'}`}>
        <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-oro-500/10 to-oro-500/10 border border-oro text-navy text-xs font-semibold mb-6 tracking-widest uppercase">Colección</span>
         <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Obras</h2>
        <p className="text-xl text-navy/50 leading-relaxed">Cada obra es una pieza única. No reproducimos imágenes en serie.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {obras.map((obra, index) => (
          <div
            key={obra.id}
            className={`group transition-opacity duration-500 ${visibleSections.has('obras') ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: `${index * 80}ms` }}
          >
           <div 
              className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-oro/40 shadow-[0_0_10px_#D4AF37,0_0_20px_#D4AF37,inset_0_0_10px_#D4AF37] hover:border-oro hover:shadow-[0_0_25px_#D4AF37,0_0_45px_#D4AF37,inset_0_0_20px_#D4AF37] transition-[box-shadow,border-color] duration-300 cursor-pointer"
              onClick={() => openGallery(
                obra.image.map(src => ({ src, title: obra.title })) as Photo[],
                0
              )}
            >
              <img
                src={obra.image[0]}
                alt={obra.title}
                className="w-full h-full object-cover transition-all duration-700  group-hover:grayscale-0 group-hover:scale-110"
              />

              <button
                   onClick={(e) => {
                    e.stopPropagation();
                    addToCart({
                    src: obra.image[0],
                    title: obra.title,
                    description: obra.subtitle + " - " + obra.description,
                    });
                  }}
                    className="absolute bottom-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-oro/90 text-oro shadow-lg hover:bg-oro hover:scale-110 active:scale-95 transition-all duration-200"
                    title="Solicitar encargo similar"
                     >
                     <ShoppingCart size={18} />
                   </button>

              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-oro/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>

            {/* Texto debajo de la miniatura */}
            <div className="pt-4 px-1">
              <h3 className="text-lg font-bold text-navy mb-1">{obra.title}</h3>
              <p className="text-oro text-sm font-medium mb-1">{obra.subtitle}</p>
              <p className="text-navy/50 text-sm mb-3">{obra.description}</p>
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-navy/40">Desde</span>
                <span className="text-xl font-bold text-navy">{obra.prices.L} €</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

      {/* Fotografía Section */}
<section id="fotografia" className="relative py-32 bg-crema">
  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-oro-500/5 to-transparent" />

  <div className="relative w-full px-6 lg:px-12">
    <div className="max-w-7xl mx-auto">
      <div className={`max-w-3xl mb-16 transition-opacity duration-600 ${visibleSections.has('fotografia') ? 'opacity-100' : 'opacity-0'}`}>
        <span className="inline-block px-4 py-2 rounded-full bg-oro/10 border border-oro text-navy-400 text-xs font-semibold mb-6 tracking-widest uppercase">Servicios</span>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Fotografía</h2>
        <p className="text-xl text-navy/50 leading-relaxed">La fotografía es el punto de partida de nuestro trabajo.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {servicios.map((servicio, index) => (
          <div
            key={index}
            className={`group transition-opacity duration-500 ${visibleSections.has('fotografia') ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: `${index * 100}ms` }}
            onClick={() => openGallery(
              servicio.image.map(src => ({ src, title: servicio.title })) as Photo[],
              0
            )}
          >
            <div className="relative bg-white/5 rounded-3xl overflow-hidden border border-oro/40 shadow-[0_0_10px_#D4AF37,0_0_20px_#D4AF37,inset_0_0_10px_#D4AF37] hover:border-oro hover:shadow-[0_0_25px_#D4AF37,0_0_45px_#D4AF37,inset_0_0_20px_#D4AF37] transition-[box-shadow,border-color] duration-300 cursor-pointer">
              <div className="aspect-video overflow-hidden">
                <img
                  src={servicio.image[0]}
                  alt={servicio.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button
                   onClick={(e) => {
                    e.stopPropagation(); // evita abrir la galería/lightbox
                    addToCart({
                    src: servicio.image[0],
                    title: servicio.title,
                    description: servicio.description,
                    });
                  }}
                    className="absolute bottom-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-oro/90 text-navy shadow-lg hover:bg-oro hover:scale-110 active:scale-95 transition-all duration-200"
                    title="Solicitar encargo similar"
                     >
                     <ShoppingCart size={18} />
                   </button>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4 group-hover:text-navy transition-colors">{servicio.title}</h3>
                <p className="text-navy/50 leading-relaxed">{servicio.description}</p>
                 <div className="mt-4 flex justify-between items-baseline">
                   <span className="text-sm text-navy/60">Desde</span>
                   <span className="text-2xl font-bold text-navy">{servicio.prices.L} €</span>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

      {/* Encargos Section */}
<section id="encargos" className="relative py-32">
  <div className="w-full px-6 lg:px-12">
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className={`text-center max-w-3xl mx-auto mb-16 transition-opacity duration-600 ${visibleSections.has('encargos') ? 'opacity-100' : 'opacity-0'}`}>
        <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-crema-500/10 to-oro-500/10 border border-oro text-navy-400 text-xs font-semibold mb-6 tracking-widest uppercase">Trabajos a medida</span>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Encargos</h2>
        <p className="text-xl text-navy/50 leading-relaxed">Los encargos se realizan de forma limitada...</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {encargos.map((encargo, index) => (
          <div
            key={index}
            className={`group transition-all duration-700 ${visibleSections.has('encargos') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: `${index * 150}ms` }}
            onClick={() => openGallery(
              encargo.image.map(src => ({ src, title: encargo.title })) as Photo[],
              0
            )}
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 border border-oro/40 shadow-[0_0_10px_#D4AF37,0_0_20px_#D4AF37,inset_0_0_10px_#D4AF37] hover:border-oro hover:shadow-[0_0_25px_#D4AF37,0_0_45px_#D4AF37,inset_0_0_20px_#D4AF37] transition-[box-shadow,border-color] duration-300 cursor-pointer">
              
              {/* MINIATURA REAL */}
              <img
                src={encargo.image[0]}
                alt={encargo.title}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <button
                   onClick={(e) => {
                    e.stopPropagation(); // evita abrir la galería/lightbox
                    addToCart({
                    src: encargo.image[0],
                    title: encargo.title,
                    description:encargo.description,
                    });
                  }}
                    className="absolute bottom-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-oro/90 text-navy shadow-lg hover:bg-oro hover:scale-110 active:scale-95 transition-all duration-200"
                    title="Solicitar encargo similar"
                     >
                     <ShoppingCart size={18} />
                   </button>

              {/* Número 01, 02, 03 (mantengo tu diseño) */}
              <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-lg font-bold border border-white/20 z-10">
                0{index + 1}
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-3 group-hover:text-navy-400 transition-colors">{encargo.title}</h3>
            <p className="text-navy/50 leading-relaxed">{encargo.description}</p>
              <div className="mt-4 flex justify-between items-baseline">
               <span className="text-sm text-navy/60">Desde</span>
               <span className="text-2xl font-bold text-navy">{encargo.prices.L} €</span>
              </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

      {/* Nosotros Section */}
      <section id="nosotros" className="relative py-32 bg-crema">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-crema-500/5 to-transparent" />
        
        <div className="relative w-full px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div
                 className={`transition-opacity duration-600 ${
                  visibleSections.has('nosotros') ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <span className="inline-block px-4 py-2 rounded-full bg-oro/10 border border-oro text-navy text-xs font-semibold mb-6 tracking-widest uppercase">
                  Sobre nosotros
                </span>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Imagen convertida{' '}
                  <span className="bg-gradient-to-r from-navy-400 to-navy-400 bg-clip-text">
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

              <div
                className={`relative transition-opacity duration-600 delay-200 ${
                  visibleSections.has('nosotros') ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="relative">
                  <div className="aspect-square rounded-3xl overflow-hidden border border-oro">
                    <img
                      src="/images/logo/1.png"
                      alt="Proceso de trabajo"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-crema to-transparent" />
                  </div>
                  
                  {/* Stats overlay */}
                  <div className="absolute -bottom-8 -left-8 p-6 bg-crema backdrop-blur-xl rounded-2xl border border-oro shadow-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-navy border border-oro flex items-center justify-center">
                        <Layers className="w-6 h-6 text-navy" />
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

      {/* Contacto Section */}
      <section id="contacto" className="relative py-32 bg-crema">
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16">
              <div
                className={`transition-opacity duration-600 ${
                  visibleSections.has('contacto') ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <span className="inline-block px-4 py-2 rounded-full bg-oro/10 border border-oro text-navy text-xs font-semibold mb-6 tracking-widest uppercase">
                  Contacto
                </span>
                <h2 className="text-4xl sm:text-5xl font-bold mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Hablemos de tu proyecto
                </h2>
                <p className="text-xl text-navy/50 mb-12">
                  Estamos en Benidorm, creando piezas fotográficas únicas para todo el mundo.
                </p>

                <div className="space-y-6">
                  <a
                    href="mailto:focusjeb@gmail.com"
                    className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-oro hover:border-oro transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors duration-300">
                      <Mail className="w-5 h-5 text-navy" />
                    </div>
                    <div>
                      <div className="text-sm text-navy/50">Email</div>
                      <div className="font-medium">focusjeb@gmail.com</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-navy/30 ml-auto group-hover:text-navy group-hover:translate-x-1 transition-all duration-300" />
                  </a>

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-oro">
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-sm text-navy/50">Ubicación</div>
                      <div className="font-medium">Benidorm, España</div>
                    </div>
                  </div>

                  <a
                   href="https://www.instagram.com/focus_jeb"
                   target="_blank"
                   rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-oro">
                    <div className="w-12 h-12 rounded-full bg-crema-500/10 flex items-center justify-center">
                      <Instagram className="w-5 h-5 text-navy-400" />
                    </div>
                    <div>
                      <div className="text-sm text-navy/50">Instagram</div>
                      <div className="font-medium">@focusjeb</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-navy/30 ml-auto group-hover:text-navy group-hover:translate-x-1 transition-all duration-300" />
                  </a>
                </div>
              </div>

              <div
                className={`hidden transition-all duration-1000 delay-200 ${
                  visibleSections.has('contacto') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <form
                action="https://api.web3forms.com/submit"
                  method="POST"
                  encType="multipart/form-data"
                className="p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-oro">
                 <input type="hidden" name="access_key" value="732ce6fe-2790-45ea-bef1-245ae1e76878" />
                 <input type="hidden" name="redirect" value="https://focus-jeb.netlify.app" />

                <input type="hidden" name="bot-field" />
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-navy/60 mb-2">
                        Nombre y apellido
                      </label>
                      <input
                        type="text"
                        name= "name"
                        required
                        className="w-full px-4 py-4 bg-navy/5 border border-oro rounded-xl focus:outline-none focus:border-oro/50 focus:ring-1 focus:ring-oro-500/50 transition-all duration-300 text-navy placeholder-navy/30"
                        placeholder="Tu nombre"
                      />
                      <input type="hidden" name="bot-field" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy/60 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-4 py-4 bg-navy/5 border border-oro rounded-xl focus:outline-none focus:border-oro/50 focus:ring-1 focus:ring-oro-500/50 transition-all duration-300 text-navy placeholder-navy/30"
                        placeholder="tu@email.com"
                      />
                      <input type="hidden" name="bot-field" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy/60 mb-2">
                        Telefono
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        className="w-full px-4 py-4 bg-navy/5 border border-oro rounded-xl focus:outline-none focus:border-oro/50 focus:ring-1 focus:ring-oro-500/50 transition-all duration-300 text-navy placeholder-navy/30"
                        placeholder="tu teléfono"
                      />
                      <input type="hidden" name="bot-field" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy/60 mb-2">
                        dirección
                      </label>
                      <input
                        type="text"
                        name="address"
                        required
                        className="w-full px-4 py-4 bg-navy/5 border border-oro rounded-xl focus:outline-none focus:border-oro/50 focus:ring-1 focus:ring-oro-500/50 transition-all duration-300 text-navy placeholder-navy/30"
                        placeholder="tu dirección"
                      />
                      <input type="hidden" name="bot-field" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy/60 mb-2">
                        codigo postal
                      </label>
                      <input
                        type="text"
                        name="postal-code"
                        required
                        className="w-full px-4 py-4 bg-navy/5 border border-oro rounded-xl focus:outline-none focus:border-oro/50 focus:ring-1 focus:ring-oro-500/50 transition-all duration-300 text-navy placeholder-navy/30"
                        placeholder="tu código postal"
                      />
                      <input type="hidden" name="bot-field" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy/60 mb-2">
                        Tu mensaje
                      </label>
                      <textarea
                        name="message"
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-4 py-4 bg-navy/5 border border-oro rounded-xl focus:outline-none focus:border-oro/50 focus:ring-1 focus:ring-oro-500/50 transition-all duration-300 text-navy placeholder-navy/30 resize-none"
                        placeholder="Cuéntanos sobre tu proyecto..."
                      />
                      <div className="flex flex-wrap gap-3 mt-4">
                        <button
                        type="button"
                        onClick={() => addFormatToMessage("Formato L: 100x70")}
                        className="px-4 py-2 border border-oro rounded-full text-sm hover:bg-oro/10 transition"
                        >
                          Formato L: 100x70
                        </button>

                        <button                        
                        type="button"
                        onClick={() => addFormatToMessage("Formato M: 80x60")}
                        className="px-4 py-2 border border-oro rounded-full text-sm hover:bg-oro/10 transition"
                        >
                          Formato M: 80x60
                        </button>

                        <button
                        type="button"
                        onClick={() => addFormatToMessage("Formato S: 60x40")}
                        className="px-4 py-2 border border-oro rounded-full text-sm hover:bg-oro/10 transition"
                        >
                          Formato S: 60x40
                          </button>

                          <button
                        type="button"
                        onClick={() => addFormatToMessage("Formato XS: 50x30")}
                        className="px-4 py-2 border border-oro rounded-full text-sm hover:bg-oro/10 transition"
                        >
                          Formato XS: 50x30
                          </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy/60 mb-2">Sube imágenes de referencia
                      </label>
                            <input
                              type="file"
                              name="attachment"
                              accept="image/*"
                              multiple
                              className="w-full px-4 py-3 bg-crema border border-oro rounded-xl text-navy file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:bg-oro file:text-navy hover:file:bg-oro/90"
                            />
                            <p className="text-xs text-navy/50 mt-2">(máx. 50MB total)
                            </p>
                      </div>

                      <button
                      type="submit"
                      className="w-full py-4 bg-crema rounded-xl font-semibold text-navy border border-oro lg hover:shadow-xl hover:shadow-oro-500/25 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      Enviar mensaje
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-oro/20">
        {/* Manifesto */}
        <div className="w-full px-2 lg:px-3 py-4 text-center border-b border-oro/10">
          <p className="text-3xl sm:text-3xl lg:text-3xl font-light text-navy/70 max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            "Cada imagen merece un cuerpo."
          </p>
          <div className="w-32 h-px bg-oro mx-auto mt-8" />
        </div>
        <div className="w-full px-6 lg:px-12 py-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img
              src="/images/logo/2.png"
              alt="FOCUS JEB"
              className="w-9 h-9 transition-transform duration-300 group-hover:scale-110"
            />
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
        className="fixed bottom-33 right-8 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-oro to-navy text-crema shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-crema/30"
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
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setShowEncargoDrawer(false)} />

   <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#F5F0E8] rounded-t-3xl max-h-[94vh] overflow-y-auto border-t-4 border-oro shadow-2xl transition-transform duration-300">

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
            
        {/* Steps estilo editorial */}
        <div className="hidden sm:flex items-center gap-3 text-xs">
          {(['resumen', 'datos'] as const).map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => cartCount > 0 && selectedFormat && setDrawerStep(step)}
                className="flex items-center gap-2 group"
              >
                <span className={`text-2xl font-light transition-all duration-300 ${drawerStep === step ? 'text-oro' : 'text-navy/20'}`}
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  0{i + 1}
                </span>
                <span className={`text-xs tracking-widest uppercase transition-all duration-300 ${drawerStep === step ? 'text-navy' : 'text-navy/30'}`}>
                  {step === 'resumen' ? 'Formato' : 'Datos'}
                </span>
              </button>
              {i < 1 && <div className="w-8 h-px bg-oro/30" />}
            </div>
          ))}
        </div>

        <button onClick={() => setShowEncargoDrawer(false)} className="text-navy/70 hover:text-navy">
          <X size={28} />
        </button>
      </div>

      {/* FORMULARIO ÚNICO (todo dentro) */}
      <form
        action="https://api.web3forms.com/submit"
        method="POST"
        encType="multipart/form-data"
        className="p-6 space-y-6"
        onSubmit={() => setTimeout(clearCart, 800)}
      >
        <input type="hidden" name="access_key" value="732ce6fe-2790-45ea-bef1-245ae1e76878" />
        <input type="hidden" name="redirect" value="https://focus-jeb.netlify.app" />
        <input type="hidden" name="bot-field" />
        {selectedFormat && (
          <input
            type="hidden"
            name="formato_seleccionado"
            value={`${selectedFormat} — ${selectedFormatPrice.toLocaleString('es-ES')} €/pieza — Total: ${totalPrice.toLocaleString('es-ES')} €`}
          />
        )}
        <input
          type="hidden"
          name="obras_seleccionadas"
          value={JSON.stringify(selectedImages.map(p => ({ title: p.title, description: p.description || '', src: p.src })))}
        />

        {/* PASO 1: RESUMEN + UPLOAD (ahora en la primera pestaña) */}
        {drawerStep === 'resumen' && (
          <>
            {/* Piezas seleccionadas */}
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

            {/* Configurador de precios */}
            <ConfiguradorPrecios onFormatoSelect={handleFormatoSelect} />

            {/* Resumen precio */}
            {selectedFormat && cartCount > 0 && (
              <div className="rounded-2xl border border-oro/30 bg-gradient-to-r from-navy/5 to-oro/5 p-5">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-navy/60 text-sm">
                    {cartCount > 0
                    ? `${cartCount} pieza${cartCount !== 1 ? 's' : ''} × ${selectedFormatPrice.toLocaleString('es-ES')} €`
                    : `Pieza personalizada × ${selectedFormatPrice.toLocaleString('es-ES')} €`
                    }
                  </span>
                  <span className="text-3xl font-bold text-navy">{totalPrice.toLocaleString('es-ES')} €</span>
                </div>
                <p className="text-xs text-navy/40">Formato: {selectedFormat} · IVA incluido</p>
              </div>
            )}

            {/* ← NUEVO: Subir imágenes de referencia (primera pestaña) */}
            <div>
              <label className="block text-sm font-medium text-navy/70 mb-2">
              Sube imágenes de referencia <span className="text-navy/40 font-normal">(opcional si seleccionas obra de la galería)</span>
              </label>
              <input
              type="file" 
              name="attachment"
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
 
        {/* PASO 2: Datos personales */}
        {drawerStep === 'datos' && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-navy/70 mb-2">Nombre y apellido *</label>
                <input type="text" name="name" required className="w-full px-4 py-4 bg-white border border-oro rounded-xl text-navy focus:outline-none focus:ring-1 focus:ring-oro" placeholder="Tu nombre" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy/70 mb-2">Email *</label>
                <input type="email" name="email" required className="w-full px-4 py-4 bg-white border border-oro rounded-xl text-navy focus:outline-none focus:ring-1 focus:ring-oro" placeholder="tu@email.com" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-navy/70 mb-2">Teléfono *</label>
                <input type="tel" name="phone" required className="w-full px-4 py-4 bg-white border border-oro rounded-xl text-navy focus:outline-none focus:ring-1 focus:ring-oro" placeholder="+34 600 000 000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy/70 mb-2">Código postal *</label>
                <input type="text" name="postal_code" required className="w-full px-4 py-4 bg-white border border-oro rounded-xl text-navy focus:outline-none focus:ring-1 focus:ring-oro" placeholder="03500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy/70 mb-2">Dirección de envío *</label>
              <input type="text" name="address" required className="w-full px-4 py-4 bg-white border border-oro rounded-xl text-navy focus:outline-none focus:ring-1 focus:ring-oro" placeholder="Calle, número, piso..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy/70 mb-2">Mensaje / notas adicionales</label>
              <textarea name="message" rows={4} className="w-full px-4 py-4 bg-white border border-oro rounded-xl text-navy resize-none focus:outline-none focus:ring-1 focus:ring-oro" placeholder="Cuéntanos sobre tu proyecto..." />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDrawerStep('resumen')}
                className="py-4 rounded-xl border border-oro text-navy font-semibold hover:bg-oro/10 transition-all duration-300"
              >
                ← Volver
              </button>
              <button
                type="submit"
                className="py-4 bg-gradient-to-r from-oro to-navy text-crema font-semibold rounded-xl hover:shadow-lg hover:shadow-oro/20 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Enviar solicitud
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  </>
)}

      {/* Lightbox Component */}
      {lightboxOpen && activePhotos.length > 0 && (
        <Lightbox
          images={activePhotos}
          currentIndex={currentImageIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onNext={() => setCurrentImageIndex(prev => Math.min(prev + 1, activePhotos.length - 1))}
          onPrev={() => setCurrentImageIndex(prev => Math.max(prev - 1, 0))}

          onAddToCart={(photo) => {
            addToCart(photo);
        }}

      />
      )}
    </div>
  )
}



export default App
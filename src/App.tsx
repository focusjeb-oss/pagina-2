import { useState, useEffect } from 'react'
import { Menu, X, ArrowRight, Mail, MapPin, Instagram, ChevronRight, Sparkles, Layers, Sun, ShoppingCart } from 'lucide-react'
import Lightbox from './components/Lightbox'


function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('inicio')
  const [scrollY, setScrollY] = useState(0)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const [showEncargoDrawer, setShowEncargoDrawer] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Photo[]>([]);
  
  // Estados para el Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activePhotos, setActivePhotos] = useState<Photo[]>([]);
  const [message, setMessage] = useState("")
  const openGallery = (photos: Photo[], index: number = 0) => {
    setActivePhotos(photos);
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const addToCart = (photo: Photo) => {
    setSelectedImages((prev) => {
      if (prev.some((p) => p.src === photo.src)) return prev;
      return [...prev, photo];
    });
    setShowEncargoDrawer(true);
    };
    const removeFromCart = (srcToRemove: string) => {
      setSelectedImages((prev) => prev.filter((p) => p.src !== srcToRemove));
      };
      const clearCart = () => setSelectedImages([]);

    const addFormatToMessage = (format: string) => {
      setMessage(prev => prev + `\nFormato seleccionado: ${format}`)
     };
  
  // Array de imágenes para la galería (ACTUALIZA ESTAS URLs CON TUS IMÁGENES REALES)
  const galleryImages = [
    { 
      src: '/images/1obras/limite01/1.jpg',
      title: "LÍMITE 01", 
      description: "Formato L - Fotografía + Resina + Luz" 
    },
    { 
      src: '/images/1obras/limite02/1.jpg',
      title: "LÍMITE 02", 
      description: "Retrato - Blanco y negro - Resina epoxy" 
    },
    { 
      src: '/images/1obras/limite03/1.jpg',
      title: "LÍMITE 03", 
      description: "Formato L - Pieza única" 
    },
    { 
      src: '/images/origen/1.jpg',
      title: "ORIGEN", 
      description: "Formato L - Naturaleza" 
    },
    { 
      src: '/images/2servicios/retrato/1.jpg',
      title: "Retrato", 
      description: "Retratos construidos desde la presencia y la quietud." 
    },
    { 
      src: '/images/2servicios/editorial/1.jpg',
      title: "Editorial / Conceptual", 
      description: "Imagen conceptual como exploración visual, sin finalidad comercial inmediata." 
    },
    { 
      src: '/images/2servicios/obra/1.jpg',
      title: "Fotografía para obra", 
      description: "Algunas imágenes nacen ya con destino físico.a" 
    },
    { 
      src: '/images/3encargos/imgcliente/1.jpg',
      title: "Imagen del cliente", 
      description: "Retratos construidos desde la presencia y la quietud." 
    },
    { 
      src: '/images/3encargos/sesionFOCUSJEB/1.jpg',
      title: "Sesión fotográfica FOCUS JEB", 
      description: "Imagen esencial como exploración visual, sin finalidad comercial inmediata."
    },
    { 
      src: '/images/3encargos/personalizada/1.jpg',
      title: "Obra personalizada", 
      description: "Cada pieza se desarrolla a partir de una idea, una imagen y un espacio concreto." 
    },
  ]

  useEffect(() => {
    const handleScroll = () => {
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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
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
        '/images/1obras/limite01/1.jpg',
        '/images/1obras/limite01/2.jpg',
        '/images/1obras/limite01/3.jpg',
      ],
    },
    {
      id: 2,
      title: 'LÍMITE 02',
      subtitle: 'Resina epoxy - Luz perimetral',
      description: 'Formato L - Pieza única',
      image: [
        '/images/1obras/limite02/1.jpg',
        '/images/1obras/limite02/2.jpg',
        '/images/1obras/limite02/3.jpg',
      ],
    },
    {
      id: 3,
      title: 'LÍMITE 03',
      subtitle: 'Formato L - Pieza única',
      description: 'Pieza única',
      image: [
        '/images/1obras/limite03/1.jpg',
        '/images/1obras/limite03/2.jpg',
        '/images/1obras/limite03/3.jpg'
      ],
    },
    {
      id: 4,
      title: 'ORIGEN',
      subtitle: 'Formato L',
      description: 'Fotografía - Resina - Luz',
      image: [
        '/images/origen/1.jpg',
        '/images/origen/2.jpg'
      ],
    },
  ]

  const servicios = [
    {
      id: 1,
      title: 'Retrato',
      description: 'Retratos construidos desde la presencia y la quietud.',
      image: [
        '/images/2servicios/retrato/1.jpg',
        '/images/2servicios/retrato/2.jpg'
      ],
    },
    {
      id: 2,
      title: 'Editorial / Conceptual',
      description: 'Imagen conceptual como exploración visual, sin finalidad comercial inmediata.',
      image: [
        '/images/2servicios/editorial/1.jpg',
        '/images/2servicios/editorial/2.jpg'
      ],
    },
    {
      id: 3,
      title: 'Fotografía para obra',
      description: 'Algunas imágenes nacen ya con destino físico.',
      image: [
        '/images/2servicios/obra/1.jpg',
        '/images/2servicios/obra/2.jpg'
      ],
    },
  ]

  const encargos = [
    {
      title: 'Imagen del cliente',
      description: 'Retratos construidos desde la presencia y la quietud.',
      image: [
        '/images/3encargos/imgcliente/1.jpg',
        '/images/3encargos/imgcliente/2.jpg'
      ],
    },
    {
      title: 'Sesión fotográfica FOCUS JEB',
      description: 'Imagen esencial como exploración visual, sin finalidad comercial inmediata.',
      image: [
        '/images/3encargos/sesionFOCUSJEB/1.jpg',
        '/images/3encargos/sesionFOCUSJEB/2.jpg',
        '/images/3encargos/sesionFOCUSJEB/3.jpg'
      ],
    },
    {
      title: 'Obra personalizada',
      description: 'Cada pieza se desarrolla a partir de una idea, una imagen y un espacio concreto.',
      image: [
        '/images/3encargos/personalizada/1.jpg',
        '/images/3encargos/personalizada/2.jpg'
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-crema text-navy border border-oro overflow-x-hidden">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrollY > 50
            ? 'bg-crema/95 backdrop-blur-xl border border-oro py-4 shadow-sm'
            : 'bg-transparent py-6'
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
          <div className="hidden lg:flex items-center gap-1 bg-white/5 backdrop-blur-md rounded-full px-2 py-2 border border-oro">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-oro to-oro text-navy shadow-lg shadow-oro/30'
                    : 'text-navy/60 hover:text-navy hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollToSection('contacto')}
            className="hidden lg:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-oro to-navy border border-oro rounded-full font-medium text-sm hover:shadow-lg hover:shadow-oro/30 transition-all duration-300 hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4" />
            Solicitar encargo
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden absolute top-full left-0 right-0 bg-slate-950/95 backdrop-blur-xl border-b border-navy/10 transition-all duration-500 ${
            isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          <div className="p-6 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="w-full text-left px-4 py-4 rounded-xl text-lg font-medium text-navy/80 hover:text-navy hover:bg-white/10 transition-all duration-300"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('contacto')}
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
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-crema-500/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-navy-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-navy-500/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative w-full px-6 lg:px-12 py-20 lg:py-0">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div
              className={`space-y-8 transition-all duration-1000 ${
                visibleSections.has('inicio') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-oro backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-oro animate-pulse" />
                <span className="text-sm text-navy/60 tracking-wide">
                  Obra fotográfica encapsulada en luz
                </span>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight text-navy">
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
                className={`relative transition-all duration-1000 delay-300 ${
                  visibleSections.has('inicio') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
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
                    className="w-full h-full object-cover transition-transform duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
                  />
                  <button
                   onClick={(e) => {
                    e.stopPropagation(); // evita abrir la galería/lightbox
                    addToCart({
                    src: obras[0].image[0],
                    title: obras[0].title,
                    description: obras[0].subtitle + " - " + obras[0].description,
                    });
                    setShowEncargoDrawer(true);
                  }}
                    className="absolute bottom-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-oro/90 text-navy shadow-lg hover:bg-oro hover:scale-110 active:scale-95 transition-all duration-200"
                    title="Solicitar encargo similar"
                     >
                     <ShoppingCart size={18} />
                   </button>
                <div className="absolute inset-0 bg-gradient-to-t from-crema via-transparent to-transparent" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl" />
                
                {/* Floating badge */}
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
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
      <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${visibleSections.has('obras') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-oro-500/10 to-oro-500/10 border border-oro text-navy text-sm font-medium mb-6">Colección</span>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Obras</h2>
        <p className="text-xl text-navy/50 leading-relaxed">Cada obra es una pieza única. No reproducimos imágenes en serie.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {obras.map((obra, index) => (
          <div
            key={obra.id}
            className={`group transition-all duration-700 ${visibleSections.has('obras') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div 
              className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-oro/40 shadow-[0_0_10px_#D4AF37,0_0_20px_#D4AF37,inset_0_0_10px_#D4AF37] hover:border-oro hover:shadow-[0_0_25px_#D4AF37,0_0_45px_#D4AF37,inset_0_0_20px_#D4AF37] transition-all duration-500 cursor-pointer"
              onClick={() => openGallery(
                obra.image.map(src => ({ src, title: obra.title })) as Photo[],
                0
              )}
            >
              {/* ← ESTA ES LA LÍNEA QUE HACE QUE SE VEA LA FOTO */}
              <img
                src={obra.image[0]}
                alt={obra.title}
                className="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-110"
              />
              
              <button
                   onClick={(e) => {
                    e.stopPropagation(); // evita abrir la galería/lightbox
                    addToCart({
                    src: obra.image[0],
                    title: obra.title,
                    description: obra.subtitle + " - " + obra.description,
                    });
                    setShowEncargoDrawer(true);
                  }}
                    className="absolute bottom-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-oro/90 text-navy shadow-lg hover:bg-oro hover:scale-110 active:scale-95 transition-all duration-200"
                    title="Solicitar encargo similar"
                     >
                     <ShoppingCart size={18} />
                   </button>
               
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl font-bold mb-1">{obra.title}</h3>
                  <p className="text-oro text-sm font-medium mb-2">{obra.subtitle}</p>
                  <p className="text-oro text-sm">{obra.description}</p>
                </div>
              </div>

              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <ArrowRight className="w-5 h-5" />
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
      <div className={`max-w-3xl mb-16 transition-all duration-1000 ${visibleSections.has('fotografia') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <span className="inline-block px-4 py-2 rounded-full bg-oro/10 border border-oro text-navy-400 text-sm font-medium mb-6">Servicios</span>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Fotografía</h2>
        <p className="text-xl text-navy/50 leading-relaxed">La fotografía es el punto de partida de nuestro trabajo.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {servicios.map((servicio, index) => (
          <div
            key={index}
            className={`group transition-all duration-700 ${visibleSections.has('fotografia') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: `${index * 150}ms` }}
            onClick={() => openGallery(
              servicio.image.map(src => ({ src, title: servicio.title })) as Photo[],
              0
            )}
          >
            <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-oro/40 shadow-[0_0_10px_#D4AF37,0_0_20px_#D4AF37,inset_0_0_10px_#D4AF37] hover:border-oro hover:shadow-[0_0_25px_#D4AF37,0_0_45px_#D4AF37,inset_0_0_20px_#D4AF37] transition-all duration-500 cursor-pointer">
              <div className="aspect-video overflow-hidden">
                <img
                  src={servicio.image[0]}
                  alt={servicio.title}
                  className="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-110"
                />
                <button
                   onClick={(e) => {
                    e.stopPropagation(); // evita abrir la galería/lightbox
                    addToCart({
                    src: servicio.image[0],
                    title: servicio.title,
                    description: servicio.description,
                    });
                    setShowEncargoDrawer(true);
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
      <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${visibleSections.has('encargos') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-crema-500/10 to-oro-500/10 border border-oro text-navy-400 text-sm font-medium mb-6">Trabajos a medida</span>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Encargos</h2>
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
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 border border-oro/40 shadow-[0_0_10px_#D4AF37,0_0_20px_#D4AF37,inset_0_0_10px_#D4AF37] hover:border-oro hover:shadow-[0_0_25px_#D4AF37,0_0_45px_#D4AF37,inset_0_0_20px_#D4AF37] transition-all duration-500 cursor-pointer">
              
              {/* MINIATURA REAL */}
              <img
                src={encargo.image[0]}
                alt={encargo.title}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-110"
              />
              <button
                   onClick={(e) => {
                    e.stopPropagation(); // evita abrir la galería/lightbox
                    addToCart({
                    src: encargo.image[0],
                    title: encargo.title,
                    description:encargo.description,
                    });
                    setShowEncargoDrawer(true);
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
                className={`transition-all duration-1000 ${
                  visibleSections.has('nosotros') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                }`}
              >
                <span className="inline-block px-4 py-2 rounded-full bg-oro/10 border border-oro text-navy text-sm font-medium mb-6">
                  Sobre nosotros
                </span>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8">
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
                className={`relative transition-all duration-1000 delay-200 ${
                  visibleSections.has('nosotros') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
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
                className={`transition-all duration-1000 ${
                  visibleSections.has('contacto') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <span className="inline-block px-4 py-2 rounded-full bg-oro/10 border border-oro text-navy text-sm font-medium mb-6">
                  Contacto
                </span>
                <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                  Hablemos de tu proyecto
                </h2>
                <p className="text-xl text-navy/50 mb-12">
                  Estamos en Benidorm, creando piezas fotográficas únicas para todo el mundo.
                </p>

                <div className="space-y-6">
                  <a
                    href="mailto:info@focusjeb.com"
                    className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-oro hover:border-oro transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors duration-300">
                      <Mail className="w-5 h-5 text-navy" />
                    </div>
                    <div>
                      <div className="text-sm text-navy/50">Email</div>
                      <div className="font-medium">info@focusjeb.com</div>
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

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-oro">
                    <div className="w-12 h-12 rounded-full bg-crema-500/10 flex items-center justify-center">
                      <Instagram className="w-5 h-5 text-navy-400" />
                    </div>
                    <div>
                      <div className="text-sm text-navy/50">Instagram</div>
                      <div className="font-medium">@focusjeb</div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`transition-all duration-1000 delay-200 ${
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
      <footer className="relative py-12 border-t border-navy/10">
        <div className="w-full px-6 lg:px-12">
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
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 border border-navy/10 flex items-center justify-center hover:border-oro/50 hover:text-oro transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 border border-navy/10 flex items-center justify-center hover:border-oro/50 hover:text-oro transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>

{/* Botón flotante carrito */}
<button
  onClick={() => setShowEncargoDrawer(true)}
  className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-oro to-navy text-crema shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-crema/30"
>
  🛒
</button>

{/* DRAWER QUE SUBE DESDE ABAJO */}
{showEncargoDrawer && (
  <>
    {/* Fondo oscuro */}
    <div
      className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
      onClick={() => setShowEncargoDrawer(false)}
    />

    {/* Drawer */}
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-crema rounded-t-3xl max-h-[92vh] overflow-y-auto border-t-4 border-oro shadow-2xl transition-transform duration-300">
      
      {/* Header */}
      <div className="sticky top-0 bg-crema border-b border-oro/30 px-6 py-5 flex items-center justify-between z-10">
        <div>
          <h3 className="text-2xl font-bold text-navy">
            Solicitar encargo
          </h3>
          <p className="text-sm text-navy/60">
            {selectedImages.length} pieza{selectedImages.length !== 1 ? 's' : ''} seleccionada{selectedImages.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button 
          onClick={() => {
            setShowEncargoDrawer(false);
            // NO limpiamos aquí, solo al cerrar manualmente
          }}
          className="text-navy/70 hover:text-navy"
        >
          <X size={28} />
        </button>
      </div>

      {/* Formulario */}
      <div className="p-6">
        <form
          action="https://api.web3forms.com/submit"
          method="POST"
          encType="multipart/form-data"
          className="space-y-6"
          onSubmit={() => {
            // Opcional: limpiar después de enviar (el redirect ya recarga)
            setTimeout(clearCart, 800);
          }}
        >
          <input type="hidden" name="access_key" value="732ce6fe-2790-45ea-bef1-245ae1e76878" />
          <input type="hidden" name="redirect" value="https://focus-jeb.netlify.app" />
          <input type="hidden" name="bot-field" />

          {/* CAMPOS NORMALES */}
          <div>
            <label className="block text-sm font-medium text-navy/70 mb-2">Nombre y apellido</label>
            <input type="text" name="name" required className="w-full px-4 py-4 bg-white border border-oro rounded-xl text-navy" placeholder="Tu nombre" />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy/70 mb-2">Email</label>
            <input type="email" name="email" required className="w-full px-4 py-4 bg-white border border-oro rounded-xl text-navy" placeholder="tu@email.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy/70 mb-2">Tu mensaje / descripción</label>
            <textarea name="message" rows={5} required className="w-full px-4 py-4 bg-white border border-oro rounded-xl text-navy resize-none" placeholder="Cuéntanos sobre tu proyecto..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy/70 mb-2">Imágenes de referencia (opcional)</label>
            <input type="file" name="attachment" accept="image/*" multiple className="w-full px-4 py-3 bg-white border border-oro rounded-xl text-navy file:bg-oro file:text-crema file:font-medium" />
          </div>

          {/* === SECCIÓN DE IMÁGENES DEL CARRITO === */}
          {selectedImages.length > 0 && (
            <div className="rounded-2xl border border-oro/30 bg-white/60 p-6">
              <p className="mb-4 font-medium text-navy">Piezas seleccionadas:</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
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
                      <p className="opacity-80 text-[10px] line-clamp-1">{photo.description}</p>
                    </div>

                    {/* Botón eliminar */}
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

              {/* Campo oculto que llega al email (JSON) */}
              <input
                type="hidden"
                name="obras_seleccionadas"
                value={JSON.stringify(
                  selectedImages.map((p) => ({
                    title: p.title,
                    description: p.description || '',
                    src: p.src,
                  }))
                )}
              />
            </div>
          )}

          {selectedImages.length === 0 && (
            <div className="text-center py-8 text-navy/50 text-sm">
              Aún no has seleccionado ninguna pieza.<br />
              Pulsa el carrito en cualquier obra.
            </div>
          )}

          <button
            type="submit"
            disabled={selectedImages.length === 0}
            className="w-full py-4 bg-gradient-to-r from-oro to-navy text-crema font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar solicitud ({selectedImages.length} pieza{selectedImages.length !== 1 ? 's' : ''})
          </button>
        </form>
      </div>
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
            setShowEncargoDrawer(true);
        }}

      />
      )}
    </div>
  )
}

export interface Photo {
  src: string;
  title: string;
  description?: string;
}

export default App
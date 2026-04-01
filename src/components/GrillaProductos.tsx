import { ShoppingCart, Star } from 'lucide-react'
import type { ProductoItem } from './ProductoDetalle'

interface GrillaProductosProps {
  items: ProductoItem[]
  cols?: 2 | 3 | 4
  onVerDetalle: (item: ProductoItem) => void
  onAddToCart: (foto: { src: string; title: string; description?: string }) => void
  isVisible?: boolean
}

export default function GrillaProductos({
  items,
  cols = 4,
  onVerDetalle,
  onAddToCart,
  isVisible = true,
}: GrillaProductosProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4',
  }[cols]

  return (
    <div className={`grid ${gridCols} gap-5 lg:gap-6`}>
      {items.map((item, index) => (
        <div
          key={`${item.id ?? item.title}-${index}`}
          className={`group transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: `${index * 70}ms` }}
        >
          {/* Tarjeta blanca estilo tienda */}
          <div className="bg-white rounded-2xl overflow-hidden border border-oro/20 shadow-sm hover:shadow-[0_4px_24px_#D4AF3725] hover:border-oro/50 transition-all duration-300 h-full flex flex-col">

            {/* Imagen — clickable para ver detalle */}
            <div
              className="relative overflow-hidden bg-navy/5 cursor-pointer"
              style={{ aspectRatio: '1 / 1' }}
              onClick={() => onVerDetalle(item)}
            >
              <img
                src={item.image[0]}
                alt={item.title}
                loading="lazy"
                decoding="async"
                onError={e => { e.currentTarget.style.opacity = '0.3' }}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Overlay sutil en hover */}
              <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/8 transition-colors duration-300" />

              {/* Badge "Pieza única" — esquina superior izquierda */}
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 bg-[#F5F0E8]/90 rounded-full text-[10px] font-semibold text-navy tracking-wider uppercase border border-oro/20 shadow-sm">
                  Pieza única
                </span>
              </div>

              {/* Botón carrito — aparece en hover, esquina inferior derecha */}
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation()
                  onAddToCart({
                    src: item.image[0],
                    title: item.title,
                    // Respeta subtitle si existe (obras), si no usa description (servicios/encargos)
                    description: item.subtitle ?? item.description,
                  })
                }}
                className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-oro text-navy shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 transition-all duration-200"
                title="Añadir al encargo"
              >
                <ShoppingCart size={15} />
              </button>

              {/* Indicador de múltiples imágenes */}
              {item.image.length > 1 && (
                <div className="absolute bottom-3 left-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {item.image.map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-oro' : 'bg-white/70'}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Info debajo de la imagen */}
            <div className="p-4 flex flex-col flex-1">
              {/* Rating decorativo */}
              <div className="flex items-center gap-1 mb-2">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-3 h-3 text-oro fill-oro" />
                ))}
                <span className="text-[10px] text-navy/40 ml-1">Certificada</span>
              </div>

              {/* Título exacto del item — clickable */}
              <h3
                className="font-bold text-navy text-sm leading-snug mb-1 cursor-pointer hover:text-oro transition-colors line-clamp-2"
                onClick={() => onVerDetalle(item)}
              >
                {item.title}
              </h3>

              {/* Subtítulo — solo obras lo tienen; servicios/encargos muestran description */}
              {item.subtitle ? (
                <p className="text-xs text-navy/50 mb-2 line-clamp-1">{item.subtitle}</p>
              ) : (
                <p className="text-xs text-navy/50 mb-2 line-clamp-2">{item.description}</p>
              )}

              {/* Precio desde XS (el mínimo del item) + botón "Ver más" */}
              <div className="flex items-end justify-between mt-auto pt-2">
                <div>
                  <span className="text-[10px] text-navy/40 block">Desde</span>
                  {/* Precio real mínimo del item (XS) */}
                  <span className="text-lg font-bold text-navy leading-tight">
                    {item.prices.XS.toLocaleString('es-ES')} €
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onVerDetalle(item)}
                  className="px-3 py-2 rounded-xl bg-oro/10 hover:bg-oro/20 border border-oro/30 hover:border-oro text-navy text-xs font-semibold transition-all duration-200"
                >
                  Ver más
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { products, categories } from '@/lib/products'
import { Product } from '@/lib/store'
import { ShelfItem } from './shelf-item'
import { ProductModal } from './product-modal'
import { FloatingBasket } from './floating-basket'
import { Sparkles } from 'lucide-react'

export function WarungScene() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [activeCategory, setActiveCategory] = useState('Semua')

  const filteredProducts = activeCategory === 'Semua' 
    ? products 
    : products.filter(p => p.category === activeCategory)

  const getProductsByCategory = (category: string) => 
    products.filter(p => p.category === category)

  const getVariant = (category: string): 'jar' | 'plate' | 'bowl' | 'package' => {
    switch (category) {
      case 'Kerupuk': return 'jar'
      case 'Tekwan': return 'bowl'
      case 'Cuko': return 'package'
      default: return 'plate'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Warung Header / Signboard */}
      <header className="relative overflow-hidden">
        {/* Decorative roof pattern */}
        <div className="h-4 banner-stripes" />
        
        {/* Main signboard */}
        <div className="bg-wood px-4 py-6 text-center relative">
          {/* Hanging decorations */}
          <div className="absolute left-4 top-0 w-8 h-12 bg-accent/60 rounded-b-full" />
          <div className="absolute right-4 top-0 w-8 h-12 bg-primary/60 rounded-b-full" />
          <div className="absolute left-12 top-0 w-6 h-8 bg-leaf/60 rounded-b-full" />
          <div className="absolute right-12 top-0 w-6 h-8 bg-chart-4/60 rounded-b-full" />

          {/* Shop name */}
          <div className="relative">
            <Sparkles className="absolute -left-2 top-0 w-5 h-5 text-cream/60 animate-sparkle" />
            <h1 className="text-3xl sm:text-4xl font-bold text-cream tracking-wide">
              Warung Bicik Pia
            </h1>
            <Sparkles className="absolute -right-2 top-0 w-5 h-5 text-cream/60 animate-sparkle delay-500" />
          </div>
          
          <p className="text-cream/80 text-sm mt-1 handwritten">
            Pempek & Makanan Khas Palembang
          </p>

          {/* Decorative banner */}
          <div className="mt-4 inline-block">
            <div className="bg-cream/90 px-4 py-2 rounded-lg shadow-md transform -rotate-1">
              <p className="handwritten text-wood-dark text-sm">
                &ldquo;Raso Asli Palembang&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Wood shelf edge */}
        <div className="h-3 wood-pattern shelf-shadow" />
      </header>

      {/* Category tabs */}
      <nav className="sticky top-0 z-30 bg-cream/95 backdrop-blur-sm border-b border-border">
        <div className="overflow-x-auto scrollbar-none">
          <div className="flex gap-2 p-3 min-w-max">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  activeCategory === category
                    ? 'bg-primary text-primary-foreground shadow-md scale-105'
                    : 'bg-card text-foreground hover:bg-primary/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main warung scene */}
      <main className="pb-24">
        {activeCategory === 'Semua' ? (
          // Full warung view with shelves
          <div className="space-y-6 py-4">
            {/* Pempek Section - Main display */}
            <section className="px-4">
              <div className="bg-card rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                 <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                    <img
                      src="/icons/iconPempek.png"
                      alt="Pempek"
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <h2 className="font-bold text-foreground">Pempek Frozen</h2>
                  <div className="flex-1 h-0.5 bg-border ml-2" />
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 justify-items-center">
                  {getProductsByCategory('Pempek').map((product) => (
                    <ShelfItem
                      key={product.id}
                      product={product}
                      onClick={() => setSelectedProduct(product)}
                      variant="plate"
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Tekwan Section */}
            <section className="px-4">
              <div className="bg-card rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-chart-4/20 flex items-center justify-center text-lg">
                     <img
                      src="/icons/iconTekwan.png"
                      alt="Tekwan"
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <h2 className="font-bold text-foreground">Tekwan Frozen</h2>
                  <div className="flex-1 h-0.5 bg-border ml-2" />
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 justify-items-center">
                  {getProductsByCategory('Tekwan').map((product) => (
                    <ShelfItem
                      key={product.id}
                      product={product}
                      onClick={() => setSelectedProduct(product)}
                      variant="bowl"
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Kerupuk Jar Section */}
            <section className="px-4">
              <div className="bg-card rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-leaf/20 flex items-center justify-center text-lg">
                    <img
                      src="/icons/iconKerupuk.png"
                      alt="Kerupuk"
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <h2 className="font-bold text-foreground">Kerupuk Renyah</h2>
                  <div className="flex-1 h-0.5 bg-border ml-2" />
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 justify-items-center">
                  {getProductsByCategory('Kerupuk').map((product) => (
                    <ShelfItem
                      key={product.id}
                      product={product}
                      onClick={() => setSelectedProduct(product)}
                      variant="jar"
                    />
                  ))}
                </div>
              </div>
            </section>

          </div>
        ) : (
          // Filtered category view
          <div className="p-4">
            <div className="bg-card rounded-2xl p-4 shadow-sm">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 justify-items-center">
                {filteredProducts.map((product) => (
                  <ShelfItem
                    key={product.id}
                    product={product}
                    onClick={() => setSelectedProduct(product)}
                    variant={getVariant(product.category)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer message */}
        <div className="text-center py-8 px-4">
          <div className="inline-block bg-card rounded-2xl px-6 py-4 shadow-sm">
            <p className="text-muted-foreground text-sm">
              Cita Rasa
            </p>
            <p className="handwritten text-wood text-lg mt-1">
              - Khas Wong Kito
            </p>
          </div>
        </div>
      </main>

      {/* Floating basket */}
      <FloatingBasket />

      {/* Product modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  )
}

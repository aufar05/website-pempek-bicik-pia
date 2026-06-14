'use client'

import { useState } from 'react'
import { Product, useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/products'
import { X, Plus, Minus } from 'lucide-react'

interface ProductModalProps {
  product: Product
  onClose: () => void
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const addItem = useCartStore((state) => state.addItem)

  // Nanti kalau punya banyak foto tinggal tambah di sini
  const images = product.images

  const [selectedImage, setSelectedImage] = useState(images[0])

  const handleAddToCart = () => {
    setIsAdding(true)

    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }

    setTimeout(() => {
      setIsAdding(false)
      onClose()
    }, 500)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-cream rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row">

          {/* LEFT SIDE - IMAGE GALLERY */}
          <div className="md:w-2/5 bg-white p-6">
            <div className="rounded-2xl overflow-hidden shadow-lg border">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-auto object-contain"
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-2 mt-4">
              {images.map((img) => (
                <button
                  key={img}
                  onClick={() => setSelectedImage(img)}
                  className={`border rounded-lg overflow-hidden ${
                    selectedImage === img
                      ? 'border-primary border-2'
                      : 'border-border'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-16 h-16 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE - PRODUCT INFO */}
          <div className="md:w-3/5 p-6">

            {/* Category */}
            <div className="inline-block px-3 py-1 rounded-full bg-accent/20 text-sm font-medium mb-3">
              {product.category}
            </div>

            {/* Product Name */}
            <h2 className="text-3xl font-bold text-foreground mb-3">
              {product.name}
            </h2>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              <span className="ml-2 text-muted-foreground">
                /{product.unit}
              </span>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <div
                className={`w-3 h-3 rounded-full ${
                  product.stock > 10
                    ? 'bg-green-500'
                    : product.stock > 0
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
              />
              <span className="text-sm text-muted-foreground">
                {product.stock > 10
                  ? 'Stok tersedia'
                  : product.stock > 0
                  ? `Sisa ${product.stock} ${product.unit}`
                  : 'Stok habis'}
              </span>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block font-medium mb-2">
                Jumlah
              </label>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    setQuantity(Math.max(1, quantity - 1))
                  }
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <span className="text-xl font-bold min-w-[40px] text-center">
                  {quantity}
                </span>

                <button
                  onClick={() =>
                    setQuantity(
                      Math.min(product.stock, quantity + 1)
                    )
                  }
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center py-4 border-t border-b mb-6">
              <span className="text-muted-foreground">
                Total
              </span>

              <span className="text-3xl font-bold text-primary">
                {formatPrice(product.price * quantity)}
              </span>
            </div>

            {/* Add To Cart */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAdding}
              className={`w-full py-4 rounded-2xl text-lg font-bold transition-all ${
                isAdding
                  ? 'bg-green-600 text-white'
                  : 'bg-primary text-primary-foreground'
              }`}
            >
              {isAdding
                ? 'Ditambahkan!'
                : 'Masukkan ke Keranjang'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
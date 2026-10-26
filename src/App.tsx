/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PRODUCTS } from './data/products';
import { Product, QuoteItem } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Calculator } from './components/Calculator';
import { Catalog } from './components/Catalog';
import { Visualizer } from './components/Visualizer';
import { ProductModal } from './components/ProductModal';
import { QuoteDrawer } from './components/QuoteDrawer';
import { LogisticsAndFaq } from './components/LogisticsAndFaq';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner'; // 1. Importación del banner de cookies

export default function App() {
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>(() => {
    // Initial friendly sample quote item so the user sees immediate value
    return [
      {
        product: PRODUCTS[0], // Piedra Blanca Crystal
        quantity: 12,
        presentation: 'bulto_30kg',
        calculatedArea: 6,
        calculatedDepth: 4
      }
    ];
  });

  const [isQuoteDrawerOpen, setIsQuoteDrawerOpen] = useState<boolean>(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [calculatorProductId, setCalculatorProductId] = useState<string>(PRODUCTS[0].id);

  // Smooth scroll helper
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Add from calculator with specific presentation and area/depth calculation
  const handleAddFromCalculator = (
    product: Product,
    quantity: number,
    presentation: 'bulto_30kg' | 'bulto_40kg' | 'm3_granel' | 'tonelada',
    area: number,
    depth: number
  ) => {
    setQuoteItems(prev =>{
      const existingIdx = prev.findIndex(
        item => item.product.id === product.id && item.presentation === presentation
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        updated[existingIdx].calculatedArea = area;
        updated[existingIdx].calculatedDepth = depth;
        return updated;
      }
      return [
        ...prev,
        {
          product,
          quantity,
          presentation,
          calculatedArea: area,
          calculatedDepth: depth
        }
      ];
    });
  };

  // Quick add from catalog card (default 1 bulto)
  const handleQuickAdd = (product: Product) => {
    setQuoteItems(prev=>{
      const existingIdx = prev.findIndex(
        item => item.product.id === product.id && item.presentation === 'bulto_30kg'
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          presentation: 'bulto_30kg'
        }
      ];
    });
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    setQuoteItems(prev => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setQuoteItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleClearQuote = () => {
    setQuoteItems([]);
  };

  const handleUseInCalculator = (productId: string) => {
    setCalculatorProductId(productId);
    scrollToId('calculadora');
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans">
      
      {/* Strict 1-row, 3-zone Header */}
      <Header
        quoteCount={quoteItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenQuote={() => setIsQuoteDrawerOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onScrollToCalculator={() => scrollToId('calculadora')}
          onScrollToCatalog={() => scrollToId('catalogo')}
        />

        {/* Product Catalog */}
        <Catalog
          products={PRODUCTS}
          onOpenProductDetail={(prod) => setSelectedProductForModal(prod)}
          onUseInCalculator={handleUseInCalculator}
          onQuickAdd={handleQuickAdd}
        />

        {/* Interactive Calculator */}
        <Calculator
          products={PRODUCTS}
          selectedProductId={calculatorProductId}
          onSelectProduct={(id) => setCalculatorProductId(id)}
          onAddToQuote={handleAddFromCalculator}
        />

        {/* Space & Texture Simulator */}
        <Visualizer
          products={PRODUCTS}
          onSelectProductForCalculator={handleUseInCalculator}
        />

        {/* Logistics & Technical FAQ */}
        <LogisticsAndFaq />
      </main>

      {/* Clean Footer */}
      <Footer />

      {/* Technical Spec Modal */}
      <ProductModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onUseInCalculator={handleUseInCalculator}
        onAddToQuote={handleQuickAdd}
      />

      {/* Quote Drawer / Slide-Over */}
      <QuoteDrawer
        isOpen={isQuoteDrawerOpen}
        onClose={() => setIsQuoteDrawerOpen(false)}
        items={quoteItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearQuote={handleClearQuote}
      />

      {/* 2. Componente de Cookies Integrado */}
      <CookieBanner />

    </div>
  );
}

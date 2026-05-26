import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, spring, Img, staticFile } from 'remotion';
import { ShoppingBag } from 'lucide-react';

export const ProductsScene: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  
  const products = [
    { name: 'Lumina Hydrating Serum', price: '$45.00', img: staticFile('images/product-1.jpg') },
    { name: 'Clear Complexion Treatment', price: '$32.00', img: staticFile('images/product-2.jpg') },
    { name: 'Radiance Eye Cream', price: '$55.00', img: staticFile('images/product-3.jpg') }
  ];

  return (
    <div style={{ opacity }} className="flex flex-col min-h-screen p-8 bg-dark text-foreground font-sans items-center justify-center">
      
      <div className="w-[1000px] bg-panel backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl flex flex-col h-[700px] relative overflow-hidden group">

        <h3 className="text-6xl font-bold text-light mb-12 flex items-center">
          <ShoppingBag className="w-10 h-10 mr-4 text-secondary" /> Curated Boutique For You
        </h3>

        <div className="flex-1 flex gap-8 p-4">
          {products.map((product, idx) => {
            const yOffset = interpolate(
              frame - (idx * 30),
              [0, 40],
              [100, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
            const cardOpacity = interpolate(
              frame - (idx * 30),
              [0, 40],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

            return (
              <div 
                key={idx} 
                style={{ transform: `translateY(${yOffset}px)`, opacity: cardOpacity }} 
                className="flex-1 bg-dark/80 border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              >
                <div className="h-64 overflow-hidden bg-white/5">
                  <Img src={product.img} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-4xl font-medium text-light mb-2">{product.name}</p>
                  <p className="text-accent font-bold text-2xl mt-auto">{product.price}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
</div>
  );
};

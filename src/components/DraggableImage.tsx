import { useState, useRef, useEffect } from 'react';
import { CustomImage } from '../types';
import { Trash2 } from 'lucide-react';

interface Props {
  image: CustomImage;
  updateImage: (id: string, updates: Partial<CustomImage>) => void;
  removeImage: (id: string) => void;
}

export default function DraggableImage({ image, updateImage, removeImage }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; initialW: number; initialH: number } | null>(null);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (isDragging && dragRef.current) {
        // Find scale of the preview area
        const container = document.getElementById('document-canvas');
        let scale = 1;
        if (container) {
          const transform = window.getComputedStyle(container).transform;
          if (transform && transform !== 'none') {
            const matrix = new DOMMatrix(transform);
            scale = matrix.a; // get scaleX
          }
        }

        const dx = (e.clientX - dragRef.current.startX) / scale;
        const dy = (e.clientY - dragRef.current.startY) / scale;
        
        updateImage(image.id, { 
          x: dragRef.current.initialX + dx, 
          y: dragRef.current.initialY + dy 
        });
      }
      
      if (isResizing && resizeRef.current) {
        const container = document.getElementById('document-canvas');
        let scale = 1;
        if (container) {
          const transform = window.getComputedStyle(container).transform;
          if (transform && transform !== 'none') {
            const matrix = new DOMMatrix(transform);
            scale = matrix.a;
          }
        }

        const dx = (e.clientX - resizeRef.current.startX) / scale;
        const dy = (e.clientY - resizeRef.current.startY) / scale;
        
        // 가로, 세로 독립적 크기 조절 (비율 고정 해제)
        const newW = Math.max(50, resizeRef.current.initialW + dx);
        const newH = Math.max(50, resizeRef.current.initialH + dy);
        
        updateImage(image.id, { width: newW, height: newH });
      }
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      dragRef.current = null;
      resizeRef.current = null;
    };

    if (isDragging || isResizing) {
      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, isResizing, image.id, updateImage]);

  return (
    <div
      style={{
        position: 'absolute',
        left: image.x,
        top: image.y,
        width: image.width,
        height: image.height,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: 50,
        mixBlendMode: image.removeWhite ? 'multiply' : 'normal'
      }}
      className="draggable-image"
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).dataset.ignoreDrag) return;
        setIsDragging(true);
        dragRef.current = { startX: e.clientX, startY: e.clientY, initialX: image.x, initialY: image.y };
        e.stopPropagation();
        e.preventDefault(); // prevent native image drag
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%', border: isDragging || isResizing ? '2px solid #3b82f6' : 'none' }}>
        <img 
          src={image.dataUrl} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'fill', 
            pointerEvents: 'none', 
            backgroundColor: image.backgroundColor || 'transparent'
          }} 
          alt="custom" 
        />
        
        {/* Delete button (top right) - ignored by html2canvas */}
        <button 
          data-html2canvas-ignore="true"
          data-ignore-drag="true"
          onClick={(e) => {
            e.stopPropagation();
            removeImage(image.id);
          }}
          style={{
            position: 'absolute', top: -12, right: -12, width: 24, height: 24, borderRadius: '50%',
            backgroundColor: '#ef4444', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10
          }}
          title="이미지 삭제"
        >
          <Trash2 size={14} pointerEvents="none" />
        </button>

        {/* Resize handle (bottom right) - ignored by html2canvas */}
        <div
          data-html2canvas-ignore="true"
          data-ignore-drag="true"
          onPointerDown={(e) => {
            setIsResizing(true);
            resizeRef.current = { startX: e.clientX, startY: e.clientY, initialW: image.width, initialH: image.height };
            e.stopPropagation();
            e.preventDefault();
          }}
          style={{
            position: 'absolute', right: -8, bottom: -8, width: 16, height: 16, backgroundColor: '#3b82f6', borderRadius: '50%', cursor: 'nwse-resize', zIndex: 10,
            border: '2px solid white'
          }}
        />
      </div>
    </div>
  );
}

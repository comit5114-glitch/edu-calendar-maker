import React, { useEffect, useRef, useState } from 'react';
import { BasicInfo, Course, CustomImage } from '../types';
import ScheduleTable from './ScheduleTable';
import Calendar from './Calendar';
import DraggableImage from './DraggableImage';

interface PreviewProps {
  activeTab: 'schedule' | 'calendar';
  basicInfo: BasicInfo;
  courses: Course[];
  holidays: string[];
  setHolidays: React.Dispatch<React.SetStateAction<string[]>>;
  customImages: CustomImage[];
  setCustomImages: React.Dispatch<React.SetStateAction<CustomImage[]>>;
}

export default function Preview({ activeTab, basicInfo, courses, holidays, setHolidays, customImages, setCustomImages }: PreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // The actual document sizes
  const docWidth = basicInfo.orientation === 'portrait' ? 2480 : 3508;

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        // We want the document to fit within the container's width (minus some padding)
        const containerWidth = containerRef.current.clientWidth - 64; // 32px padding on each side
        const newScale = containerWidth / docWidth;
        setScale(newScale);
      }
    };
    
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [docWidth, activeTab]);

  return (
    <div ref={containerRef} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div 
        className="document-wrapper" 
        style={{ 
          transform: `scale(${scale})`, 
          width: docWidth,
          marginBottom: `-${docWidth * (basicInfo.orientation === 'portrait' ? 3508/2480 : 2480/3508) * (1 - scale)}px` // Fix height collapse due to scale
        }}
      >
        <div id="document-canvas" className={`document-canvas ${basicInfo.orientation}`} style={{ position: 'relative' }}>
          {activeTab === 'schedule' ? (
            <ScheduleTable basicInfo={basicInfo} courses={courses} />
          ) : (
            <Calendar 
              basicInfo={basicInfo} 
              courses={courses} 
              holidays={holidays}
              setHolidays={setHolidays}
            />
          )}

          {/* Render Custom Draggable Images */}
          {customImages.map(img => (
            <DraggableImage 
              key={img.id}
              image={img}
              updateImage={(id, updates) => setCustomImages(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))}
              removeImage={(id) => setCustomImages(prev => prev.filter(p => p.id !== id))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

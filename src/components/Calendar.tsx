import React from 'react';
import { BasicInfo, Course } from '../types';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { MapPin, Clock, CalendarDays } from 'lucide-react';

interface CalendarProps {
  basicInfo: BasicInfo;
  courses: Course[];
  holidays: string[];
  setHolidays: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function Calendar({ basicInfo, courses, holidays, setHolidays }: CalendarProps) {
  const monthDate = new Date(basicInfo.year, basicInfo.month - 1, 1);
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const toggleHoliday = (dateString: string) => {
    if (holidays.includes(dateString)) {
      setHolidays(holidays.filter(d => d !== dateString));
    } else {
      setHolidays([...holidays, dateString]);
    }
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* TOP HEADER ROW: Title + Badges (Left) & Mascot (Right) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', width: '100%' }}>
        
        {/* Left: Title & Badges */}
        <div className="doc-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '60px' }}>
          <h1 className="doc-title" style={{ fontSize: '120px', textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: 0, lineHeight: 1.1, fontFamily: basicInfo.titleStyle?.fontFamily, whiteSpace: 'nowrap' }}>
            <span style={{ color: '#0f172a', fontWeight: 900 }}>{basicInfo.year} AI디지털배움터</span>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '-10px' }}>
              <span className="month" style={{ fontSize: '200px', color: '#ea580c', fontWeight: 900, marginRight: '24px' }}>{basicInfo.month}월</span>
              <span style={{ color: '#1e3a8a', fontWeight: 900, fontSize: '130px' }}>교육 캘린더</span>
            </div>
          </h1>
          
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px', alignItems: 'center' }}>
            {basicInfo.addressDetail && (
              <div style={{ backgroundColor: '#1e40af', color: '#fff', padding: '12px 32px', borderRadius: '999px', fontSize: '32px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                <div style={{ backgroundColor: '#fff', color: '#1e40af', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={24} strokeWidth={3} />
                </div>
                {basicInfo.addressDetail}
              </div>
            )}
            {basicInfo.time && (
              <div style={{ backgroundColor: '#1e40af', color: '#fff', padding: '12px 32px', borderRadius: '999px', fontSize: '32px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                <div style={{ backgroundColor: '#fff', color: '#1e40af', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={24} strokeWidth={3} />
                </div>
                {basicInfo.time}
              </div>
            )}
            <div style={{ backgroundColor: '#16a34a', color: '#fff', padding: '12px 32px', borderRadius: '999px', fontSize: '32px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <CalendarDays size={32} strokeWidth={2.5} /> 일자별 교육 안내
            </div>
          </div>
        </div>

        {/* Right: Mascot */}
        <div style={{ width: '380px', flexShrink: 0, marginTop: '-20px' }}>
          <img 
            src="/mascot.png" 
            alt="마스코트" 
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML += '<div style="width: 100%; height: 380px; background: #e2e8f0; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #64748b; font-weight: bold; border: 4px dashed #cbd5e1; text-align: center; line-height: 1.4;">public 폴더에<br/>mascot.png<br/>저장해주세요</div>';
            }}
          />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginBottom: '40px' }}>
        <table className="calendar-grid">
          <thead>
            <tr style={{ backgroundColor: '#1e3a8a', color: '#ffffff', fontSize: '48px', fontWeight: 'bold' }}>
              <th style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '16px' }}>일</th>
              <th style={{ padding: '16px' }}>월</th>
              <th style={{ padding: '16px' }}>화</th>
              <th style={{ padding: '16px' }}>수</th>
              <th style={{ padding: '16px' }}>목</th>
              <th style={{ padding: '16px' }}>금</th>
              <th style={{ padding: '16px' }}>토</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.ceil(days.length / 7) }).map((_, weekIndex) => (
              <tr key={weekIndex}>
                {days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => {
                  const dayStr = format(day, 'yyyy-MM-dd');
                  const isCurrentMonth = isSameMonth(day, monthStart);
                  const isSun = dayIndex === 0;
                  const isSat = dayIndex === 6;
                  const isHoliday = holidays.includes(dayStr);
                  
                  // Find courses for this day
                  const dayCourses = courses.filter(c => {
                    if (!c.startDate || !c.endDate) return false;
                    const start = parseISO(c.startDate);
                    const end = parseISO(c.endDate);
                    return day >= start && day <= end;
                  });

                  return (
                    <td key={day.toISOString()} style={{ opacity: isCurrentMonth ? 1 : 0.3, color: '#000' }}>
                      <div 
                        className={`calendar-date ${isSun ? 'sunday' : ''} ${isSat ? 'saturday' : ''} ${isHoliday ? 'holiday' : ''}`}
                        onClick={() => toggleHoliday(dayStr)}
                        title="클릭하여 공휴일 지정/해제"
                      >
                        {format(day, 'd')}
                      </div>
                      
                      <div className="pill-container">
                        {dayCourses.map(course => {
                          const start = parseISO(course.startDate);
                          const end = parseISO(course.endDate);
                          const isStart = isSameDay(day, start);
                          const isEnd = isSameDay(day, end);
                          const isSunInMiddle = dayIndex === 0 && !isStart;
                          const isSatInMiddle = dayIndex === 6 && !isEnd;
                          
                          let pillClass = 'calendar-pill ';
                          if (isStart && isEnd) {
                            pillClass += '';
                          } else if (isStart || isSunInMiddle) {
                            pillClass += 'pill-start';
                          } else if (isEnd || isSatInMiddle) {
                            pillClass += 'pill-end';
                          } else {
                            pillClass += 'pill-mid';
                          }

                          let label = course.name;
                          if (!isStart && !isSunInMiddle) label = `← ${label}`;
                          if (!isEnd && !isSatInMiddle) label = `${label} →`;

                          return (
                            <div 
                              key={course.id} 
                              className={pillClass} 
                              style={{ backgroundColor: course.color, ...basicInfo.courseNameStyle, ...(basicInfo.courseNameStyle?.color ? {} : { color: '#000' }) }}
                              title={`${course.name} (${course.time})`}
                            >
                              {label}
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

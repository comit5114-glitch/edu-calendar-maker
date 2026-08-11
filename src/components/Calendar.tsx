import React from 'react';
import { BasicInfo, Course } from '../types';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, parseISO, differenceInDays } from 'date-fns';
import { MapPin, Clock, CalendarDays } from 'lucide-react';
import { isKoreanHoliday } from '../utils/holidays';

const ArrowLeft = ({ color }: { color: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '12px' }}>
    <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 7L0 0V14L10 7Z" fill={color}/>
    </svg>
  </div>
);

const ArrowRight = ({ color }: { color: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', paddingRight: '12px' }}>
    <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 7L10 14V0L0 7Z" fill={color}/>
    </svg>
  </div>
);

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

  const pastelColors = [
    { bg: '#e0f2fe', border: '#7dd3fc' }, // blue
    { bg: '#fef9c3', border: '#fde047' }, // yellow
    { bg: '#f3e8ff', border: '#d8b4fe' }, // purple
    { bg: '#dcfce7', border: '#86efac' }, // green
    { bg: '#fee2e2', border: '#fca5a5' }, // pink
    { bg: '#ffedd5', border: '#fdba74' }, // orange
  ];

  const toggleHoliday = (dateString: string) => {
    if (holidays.includes(dateString)) {
      setHolidays(holidays.filter(d => d !== dateString));
    } else {
      setHolidays([...holidays, dateString]);
    }
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* TOP HEADER ROW: Title + Badges */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', width: '100%', paddingTop: '40px' }}>
        
        {/* Left: Title & Badges */}
        <div className="doc-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '60px' }}>
          <h1 className="doc-title" style={{ fontSize: '140px', textAlign: 'left', margin: 0, lineHeight: 1.2, fontFamily: basicInfo.titleStyle?.fontFamily, whiteSpace: 'nowrap' }}>
            <span style={{ color: '#0f172a' }}>{basicInfo.year}</span> <span style={{ color: 'rgb(0, 67, 250)' }}>AI디지털배움터</span><br />
            <span className="month" style={{ fontSize: '210px', color: '#dc2626', marginRight: '24px' }}>{basicInfo.month}월</span>
            <span style={{ color: '#0f172a' }}>교육 캘린더</span>
          </h1>
          
          <div style={{ display: 'flex', gap: '20px', marginTop: '60px', alignItems: 'center' }}>
            {basicInfo.addressDetail && (
              <div style={{ backgroundColor: '#1e40af', color: '#fff', padding: '16px 40px', borderRadius: '999px', fontSize: '38px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                <div style={{ backgroundColor: '#fff', color: '#1e40af', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={32} strokeWidth={3} />
                </div>
                영도구청 4층 정보화교육장
              </div>
            )}
            {basicInfo.time && (
              <div style={{ backgroundColor: '#1e40af', color: '#fff', padding: '16px 40px', borderRadius: '999px', fontSize: '38px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                <div style={{ backgroundColor: '#fff', color: '#1e40af', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={32} strokeWidth={3} />
                </div>
                {basicInfo.time}
              </div>
            )}
            <div style={{ backgroundColor: '#16a34a', color: '#fff', padding: '16px 40px', borderRadius: '999px', fontSize: '38px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <CalendarDays size={40} strokeWidth={2.5} /> 일자별 교육 안내
            </div>
          </div>
        </div>


      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginBottom: '40px' }}>
        <table className="calendar-grid">
          <thead>
            <tr>
              <th style={{ backgroundColor: '#dc2626', color: '#ffffff', borderTopLeftRadius: '16px' }}>일</th>
              <th style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}>월</th>
              <th style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}>화</th>
              <th style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}>수</th>
              <th style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}>목</th>
              <th style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}>금</th>
              <th style={{ backgroundColor: '#1e3a8a', color: '#ffffff', borderTopRightRadius: '16px' }}>토</th>
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
                  const isHoliday = holidays.includes(dayStr) || isKoreanHoliday(dayStr);
                  
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
                        style={{ color: (isHoliday || isSun) ? '#dc2626' : isSat ? '#2563eb' : 'inherit' }}
                      >
                        {format(day, 'd')}
                      </div>
                      
                      <div className="pill-container">
                        {dayCourses.map((course) => {
                          const start = parseISO(course.startDate);
                          const end = parseISO(course.endDate);
                          const isStart = isSameDay(day, start);
                          const dayIndex = day.getDay();
                          const isSunInMiddle = dayIndex === 0 && day > start && day <= end;
                          
                          // Use the global index of the course to ensure distinct colors even if IDs are similar
                          const globalIndex = courses.findIndex(c => c.id === course.id);
                          const palette = pastelColors[globalIndex % pastelColors.length];

                          const rowEndDay = endOfWeek(day, { weekStartsOn: 0 });
                          const actualEnd = end < rowEndDay ? end : rowEndDay;
                          const spanCols = differenceInDays(actualEnd, day) + 1;
                          
                          const showPill = isStart || isSunInMiddle;
                          const isGlobalSingleDay = start.getTime() === end.getTime();
                          const isTrueStart = isStart && !isGlobalSingleDay;
                          const isTrueEnd = (end.getTime() === actualEnd.getTime()) && !isGlobalSingleDay;

                          return (
                            <div key={course.id} style={{ position: 'relative', height: '100px', marginBottom: '12px', zIndex: 100 - dayIndex }}>
                              {showPill && (
                                <div style={{
                                  position: 'absolute',
                                  top: 0, 
                                  left: '4px',
                                  bottom: 0,
                                  width: `calc(100% * ${spanCols} - 8px)`,
                                  backgroundColor: palette.bg, 
                                  border: `2px solid ${palette.border}`,
                                  borderRadius: '999px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  zIndex: 20,
                                  ...basicInfo.courseNameStyle
                                }} title={`${course.name} (${course.time})`}>
                                  {isTrueStart ? <ArrowLeft color={palette.border} /> : <div style={{ flex: 1 }} />}
                                  <span style={{ 
                                    flexShrink: 1, 
                                    textAlign: 'center', 
                                    wordBreak: 'keep-all',
                                    padding: '0 16px',
                                    color: '#000000',
                                    fontWeight: 'bold',
                                    fontSize: '36px',
                                    lineHeight: '1.2',
                                    fontFamily: '"Malgun Gothic", "맑은 고딕", "Noto Sans KR", sans-serif'
                                  }}>
                                    {course.name}
                                  </span>
                                  {isTrueEnd ? <ArrowRight color={palette.border} /> : <div style={{ flex: 1 }} />}
                                </div>
                              )}
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

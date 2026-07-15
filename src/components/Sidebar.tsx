import React, { useState, useRef, useEffect } from 'react';
import { BasicInfo, Course, CustomImage } from '../types';
import { Plus, Trash2, Wand2, ChevronUp, ChevronDown, Copy, RotateCcw, Save, Upload, ImagePlus } from 'lucide-react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

// -------------------------------------------------------------
// ContentEditableInput Component (커서 유지 및 Rich Text 입력)
// -------------------------------------------------------------
const ContentEditableInput = ({ value, onChange, onRecommend }: { value: string, onChange: (val: string) => void, onRecommend: (val: string) => void }) => {
  const contentEditable = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (contentEditable.current && contentEditable.current.innerHTML !== value) {
      contentEditable.current.innerHTML = value;
    }
  }, [value]);

  return (
    <div
      ref={contentEditable}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => {
        onChange(e.currentTarget.innerHTML);
      }}
      onInput={(e) => {
        const val = e.currentTarget.innerHTML;
        const rawText = e.currentTarget.innerText;
        onChange(val);
        onRecommend(rawText);
      }}
      style={{ flex: 1, border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px', minHeight: '38px', backgroundColor: '#fff', outline: 'none' }}
    />
  );
};

interface SidebarProps {
  basicInfo: BasicInfo;
  setBasicInfo: React.Dispatch<React.SetStateAction<BasicInfo>>;
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  holidays: string[];
  setHolidays: React.Dispatch<React.SetStateAction<string[]>>;
  customImages: CustomImage[];
  setCustomImages: React.Dispatch<React.SetStateAction<CustomImage[]>>;
  onReset: () => void;
}

const mockRecommendations: Record<string, string[]> = {
  '스마트폰': ['스마트폰 기본 화면 알아보기', '홈화면과 앱스화면 사용하기', '문자와 카카오톡 사용하기', '스마트폰 설정 변경하기'],
  '윈도우': ['윈도우11 화면 구성 익히기', '마우스와 키보드 기본 조작 익히기', '파일과 폴더 관리하기', '화면 캡처 방법 익히기'],
  '유튜브': ['유튜브 앱 설치 및 로그인', '관심 채널 구독 및 좋아요', '유튜브로 음악 듣기', '나만의 재생목록 만들기'],
  '한글': ['한글 프로그램 화면 구성 알아보기', '문자 입력과 수정하기', '글자 모양과 문단 모양 설정하기', '문서 저장과 불러오기'],
  '엑셀': ['엑셀 화면 구성 이해하기', '데이터 입력 및 자동 채우기', '간단한 수식(합계, 평균) 사용', '표 서식 및 인쇄 설정'],
  '키오스크': ['키오스크 개념 이해하기', '음식점 무인주문기 사용법', '병원 무인수납기 사용법', 'KTX/영화관 예매하기'],
  '인공지능': ['챗GPT 가입 및 시작하기', '인공지능과 대화하는 방법', '그림 그려주는 AI 활용하기', 'AI 비서로 일정 관리하기'],
};

const colors = ['#bfdbfe', '#bbf7d0', '#fef08a', '#fbcfe8', '#e9d5ff', '#fed7aa', '#99f6e4'];

export default function Sidebar({ basicInfo, setBasicInfo, courses, setCourses, holidays, setHolidays, customImages, setCustomImages, onReset }: SidebarProps) {
  const [miniCalDate, setMiniCalDate] = useState(new Date(basicInfo.year, basicInfo.month - 1, 1));
  const [isExporting, setIsExporting] = useState(false);

  // Mini calendar logic
  const monthStart = startOfMonth(miniCalDate);
  const monthEnd = endOfMonth(miniCalDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const miniCalDays = eachDayOfInterval({ start: startDate, end: endDate });

  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBasicInfo(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'month') {
        next.dateText = next.dateText.replace(/\d+월/, `${value}월`);
      }
      return next;
    });
  };

  const handleExport = () => {
    const data = JSON.stringify({ basicInfo, courses, holidays, customImages }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `시간표_데이터_${basicInfo.year}년${basicInfo.month}월.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.basicInfo) setBasicInfo(parsed.basicInfo);
        if (parsed.courses) setCourses(parsed.courses);
        if (parsed.holidays) setHolidays(parsed.holidays);
        if (parsed.customImages) setCustomImages(parsed.customImages);
        alert('데이터를 성공적으로 불러왔습니다!');
      } catch (err) {
        alert('잘못된 파일 형식입니다.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleStyleChange = (field: keyof BasicInfo, prop: 'color' | 'fontFamily' | 'backgroundColor' | 'fontSize', value: string) => {
    setBasicInfo(prev => ({
      ...prev,
      [field]: {
        ...(prev[field] as any),
        [prop]: value
      }
    }));
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (customImages.length >= 5) {
      alert('이미지는 최대 5개까지만 추가할 수 있습니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const newImg: CustomImage = {
        id: Date.now().toString(),
        dataUrl,
        x: 1200, // 화면 중간 우측쯤에 배치 (전체 너비 2480 기준)
        y: 200,
        width: 400,
        height: 400,
        backgroundColor: 'transparent'
      };
      setCustomImages(prev => [...prev, newImg]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleExportToGoogleSheets = async () => {
    if (!basicInfo.googleScriptUrl) {
      alert("구글 Apps Script Web App URL을 먼저 입력해주세요.");
      return;
    }

    try {
      setIsExporting(true);
      const title = `${basicInfo.month}월 ${basicInfo.time.includes('오전') ? '오전반' : '오후반'} 교육과정 안내`;
      
      const payload = {
        title,
        courses: courses.map(c => ({
          name: c.name,
          schedule: `${c.startDate} ~ ${c.endDate}`,
          contents: c.contents.join('\n')
        }))
      };

      const response = await fetch(basicInfo.googleScriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.status === 'success') {
        alert("성공적으로 구글 시트에 전송되었습니다!");
      } else {
        alert("전송 중 오류가 발생했습니다: " + result.message);
      }
    } catch (error) {
      alert("전송 실패. URL이나 네트워크 상태를 확인해주세요. (CORS 문제일 수 있습니다)");
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleRemoveCustomImage = (id: string) => {
    setCustomImages(prev => prev.filter(img => img.id !== id));
  };

  const renderStyleControl = (label: string, field: keyof BasicInfo) => {
    const style = basicInfo[field] as any;
    if (!style) return null;
    return (
      <div className="form-group" style={{ marginBottom: '12px' }}>
        <label>{label}</label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select 
            value={style.fontFamily} 
            onChange={(e) => handleStyleChange(field, 'fontFamily', e.target.value)}
            style={{ flex: 1 }}
          >
            <option value="Pretendard">기본 폰트 (Pretendard)</option>
            <option value="'Nanum Gothic', sans-serif">나눔고딕</option>
            <option value="'Nanum Myeongjo', serif">나눔명조</option>
            <option value="'Noto Sans KR', sans-serif">본고딕 (Noto Sans KR)</option>
            <option value="'Gowun Dodum', sans-serif">고운돋움</option>
          </select>
          <input 
            type="color" 
            value={style.color} 
            onChange={(e) => handleStyleChange(field, 'color', e.target.value)}
            style={{ width: '40px', height: '36px', padding: '2px', cursor: 'pointer' }}
            title="글자색"
          />
          {style.backgroundColor !== undefined && (
            <input 
              type="color" 
              value={style.backgroundColor} 
              onChange={(e) => handleStyleChange(field, 'backgroundColor', e.target.value)}
              style={{ width: '40px', height: '36px', padding: '2px', cursor: 'pointer' }}
              title="배경색"
            />
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="number"
              value={style.fontSize ? parseInt(style.fontSize) : 24}
              onChange={(e) => handleStyleChange(field, 'fontSize', `${e.target.value}px`)}
              style={{ width: '60px', padding: '4px', height: '36px' }}
              title="글자 크기 (px)"
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>px</span>
          </div>
        </div>
      </div>
    );
  };

  const handleAddCourse = () => {
    const newCourse: Course = {
      id: Date.now().toString(),
      name: '새 교육과정',
      startDate: `${basicInfo.year}-${String(basicInfo.month).padStart(2, '0')}-01`,
      endDate: `${basicInfo.year}-${String(basicInfo.month).padStart(2, '0')}-01`,
      contents: ['교육 내용을 입력하세요'],
      color: colors[courses.length % colors.length],
      time: '10:00~12:00',
    };
    setCourses([...courses, newCourse]);
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses(courses.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const removeCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const copyCourse = (course: Course) => {
    const newCourse = { ...course, id: Date.now().toString() };
    setCourses([...courses, newCourse]);
  };

  const moveCourse = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newCourses = [...courses];
      [newCourses[index - 1], newCourses[index]] = [newCourses[index], newCourses[index - 1]];
      setCourses(newCourses);
    } else if (direction === 'down' && index < courses.length - 1) {
      const newCourses = [...courses];
      [newCourses[index + 1], newCourses[index]] = [newCourses[index], newCourses[index + 1]];
      setCourses(newCourses);
    }
  };

  const recommendContent = async (courseId: string, courseName: string) => {
    // 1. AI API를 통한 자동 추천 시도 (Gemini 또는 OpenAI)
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const openApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (geminiApiKey) {
      try {
        updateCourse(courseId, { contents: ['AI가 추천 중입니다... 잠시만 기다려주세요.'] });
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `당신은 디지털 배움터 강사입니다. 주어진 교육명에 맞는 4~5줄의 실습 위주 교육 내용을 추천해주세요. 각 줄은 간결하게 작성하고, 숫자나 불릿 기호 없이 텍스트만 나열해주세요.\n\n교육명: ${courseName}\n위 교육명에 맞는 커리큘럼(내용)을 4~5줄로 작성해줘.`
              }]
            }],
            generationConfig: { temperature: 0.7 }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const contentStr = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const newContents = contentStr.split('\n').map((s: string) => s.replace(/^[-*•\d.]\s*/, '').trim()).filter(Boolean);
          updateCourse(courseId, { contents: newContents.slice(0, 5) });
          return;
        } else {
          const errorData = await response.json().catch(() => ({}));
          alert("제미나이 API 응답 에러: " + JSON.stringify(errorData));
        }
      } catch (error: any) {
        console.error('Gemini API Error:', error);
        alert("제미나이 API 네트워크 에러: " + error.message);
      }
    } else if (openApiKey) {
      try {
        updateCourse(courseId, { contents: ['AI가 추천 중입니다... 잠시만 기다려주세요.'] });
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openApiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: '당신은 디지털 배움터 강사입니다. 주어진 교육명에 맞는 4~5줄의 실습 위주 교육 내용을 추천해주세요. 각 줄은 간결하게 작성하고, 숫자나 불릿 기호 없이 텍스트만 나열해주세요.' },
              { role: 'user', content: `교육명: ${courseName}\n위 교육명에 맞는 커리큘럼(내용)을 4~5줄로 작성해줘.` }
            ],
            temperature: 0.7
          })
        });

        if (response.ok) {
          const data = await response.json();
          const contentStr = data.choices[0].message.content;
          const newContents = contentStr.split('\n').map((s: string) => s.replace(/^[-*•\d.]\s*/, '').trim()).filter(Boolean);
          updateCourse(courseId, { contents: newContents.slice(0, 5) });
          return;
        }
      } catch (error) {
        console.error('OpenAI API Error:', error);
      }
    }

    // 2. 하드코딩된 키워드 기반 추천 (Fallback)
    let found = false;
    const lowerName = courseName.toLowerCase();
    
    for (const [key, contents] of Object.entries(mockRecommendations)) {
      if (lowerName.includes(key.toLowerCase())) {
        updateCourse(courseId, { contents });
        found = true;
        break;
      }
    }
    
    // 추가 키워드 매칭
    if (!found) {
      if (lowerName.includes('ai') || courseName.includes('생성형')) {
        updateCourse(courseId, { contents: ['생성형 AI의 개념과 활용 분야', '챗GPT로 텍스트 생성하기', '미드저니/달리로 이미지 생성', '나만의 AI 디자인 콘텐츠 완성'] });
        found = true;
      } else if (courseName.includes('디자인') || courseName.includes('캔바') || courseName.includes('미리캔버스')) {
        updateCourse(courseId, { contents: ['디자인 툴 기본 화면 이해하기', '템플릿을 활용한 디자인 수정', '텍스트와 이미지 배치하기', '완성된 디자인 저장 및 공유'] });
        found = true;
      } else if (courseName.includes('영상') || courseName.includes('유튜브') || courseName.includes('캡컷') || courseName.includes('동영상')) {
        updateCourse(courseId, { contents: ['영상 편집 기초 이해하기', '컷 편집과 자막 넣기', '배경음악과 효과음 추가하기', '완성된 영상 추출하고 공유하기'] });
        found = true;
      }
    }

    if (!found) {
      updateCourse(courseId, { contents: ['저장된 템플릿이 없습니다. 직접 입력해주세요.'] });
      if (!geminiApiKey && !openApiKey) {
        alert("버셀(Vercel) 환경 변수에 VITE_GEMINI_API_KEY 또는 VITE_OPENAI_API_KEY를 등록하시면 AI가 어떤 교육명이든 자동으로 내용을 만들어줍니다!");
      }
    }
  };

  const updateContent = (courseId: string, contentIndex: number, value: string) => {
    setCourses(courses.map(c => {
      if (c.id === courseId) {
        const newContents = [...c.contents];
        newContents[contentIndex] = value;
        return { ...c, contents: newContents };
      }
      return c;
    }));
  };

  const addContent = (courseId: string) => {
    setCourses(courses.map(c => {
      if (c.id === courseId) {
        return { ...c, contents: [...c.contents, '새 내용'] };
      }
      return c;
    }));
  };

  const removeContent = (courseId: string, contentIndex: number) => {
    setCourses(courses.map(c => {
      if (c.id === courseId) {
        const newContents = c.contents.filter((_, i) => i !== contentIndex);
        return { ...c, contents: newContents };
      }
      return c;
    }));
  };

  return (
    <div className="sidebar">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* ACTION BUTTONS */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn btn-outline" style={{ flex: 1, padding: '8px' }} onClick={handleExport} title="현재 설정된 모든 데이터를 파일로 저장합니다.">
            <Save size={16} /> 데이터 저장
          </button>
          <label className="btn btn-outline" style={{ flex: 1, padding: '8px', cursor: 'pointer', textAlign: 'center' }} title="저장했던 데이터 파일을 다시 불러옵니다.">
            <Upload size={16} style={{ marginRight: '8px' }} /> 불러오기
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </label>
          <button className="btn btn-outline" style={{ padding: '8px 16px', borderColor: '#ef4444', color: '#ef4444' }} onClick={onReset} title="모든 데이터를 초기화합니다.">
            <RotateCcw size={16} /> 초기화
          </button>
        </div>

        {/* Mini Calendar Moved from Bottom */}
        <div style={{ border: '2px solid var(--primary-light)', borderRadius: '12px', padding: '16px', backgroundColor: '#f0f9ff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <button className="btn btn-outline" style={{ padding: '4px 8px' }} onClick={() => setMiniCalDate(subMonths(miniCalDate, 1))}>&lt;</button>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary)' }}>{format(miniCalDate, 'yyyy년 M월')}</div>
            <button className="btn btn-outline" style={{ padding: '4px 8px' }} onClick={() => setMiniCalDate(addMonths(miniCalDate, 1))}>&gt;</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '0.85rem' }}>
            {['일', '월', '화', '수', '목', '금', '토'].map(d => <div key={d} style={{ fontWeight: 600, color: d==='일'?'#ef4444':d==='토'?'#3b82f6':'' }}>{d}</div>)}
            {miniCalDays.map(day => (
              <div key={day.toISOString()} 
                   onClick={() => {
                     const newDateText = `${format(day, 'M월 d일')}부터 (첫 교육 시 회원가입 필요)`;
                     setBasicInfo(prev => ({ ...prev, dateText: newDateText }));
                   }}
                   style={{ 
                padding: '6px 0', 
                opacity: isSameMonth(day, miniCalDate) ? 1 : 0.3,
                color: day.getDay() === 0 ? '#ef4444' : day.getDay() === 6 ? '#3b82f6' : 'var(--text-main)',
                backgroundColor: courses.some(c => c.startDate <= format(day, 'yyyy-MM-dd') && c.endDate >= format(day, 'yyyy-MM-dd')) ? '#bae6fd' : 'transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: isSameDay(day, new Date()) ? 700 : 400,
                border: isSameDay(day, new Date()) ? '1px solid #3b82f6' : '1px solid transparent'
              }}
              title="클릭하여 교육일자 안내 텍스트 변경">
                {format(day, 'd')}
              </div>
            ))}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '12px', textAlign: 'center', lineHeight: 1.5 }}>
            * 파란 배경은 <strong>일정이 등록된 날짜</strong>입니다.<br/>
            * 날짜를 클릭하면 <strong>[교육일자 안내]</strong>가 자동 변경됩니다.
          </div>
        </div>

      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
        <h2 style={{ marginBottom: 0 }}>기본 정보 입력</h2>
      </div>

      <div className="form-group">
        <label>용지 방향</label>
        <select name="orientation" value={basicInfo.orientation} onChange={handleBasicChange}>
          <option value="portrait">A4 세로형 (안내표 권장)</option>
          <option value="landscape">A4 가로형 (캘린더 권장)</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>연도</label>
          <input type="number" name="year" value={basicInfo.year} onChange={handleBasicChange} />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>월</label>
          <input type="number" name="month" min="1" max="12" value={basicInfo.month} onChange={handleBasicChange} />
        </div>
      </div>
      <div className="form-group">
        <label>메인 제목</label>
        <input type="text" name="title" value={basicInfo.title} onChange={handleBasicChange} />
      </div>
      <div className="form-group">
        <label>부제목</label>
        <textarea name="subtitle" value={basicInfo.subtitle} onChange={handleBasicChange} rows={2} />
      </div>
      <div className="form-group">
        <label>교육장소</label>
        <input type="text" name="location" value={basicInfo.location} onChange={handleBasicChange} />
      </div>
      <div className="form-group">
        <label>상세주소</label>
        <input type="text" name="addressDetail" value={basicInfo.addressDetail} onChange={handleBasicChange} />
      </div>
      <div className="form-group">
        <label>전체 교육시간</label>
        <input type="text" name="time" value={basicInfo.time} onChange={handleBasicChange} />
      </div>
      <div className="form-group">
        <label>교육일자 안내</label>
        <input type="text" name="dateText" value={basicInfo.dateText} onChange={handleBasicChange} />
      </div>
      <div className="form-group">
        <label>교육대상</label>
        <input type="text" name="targetAudience" value={basicInfo.targetAudience} onChange={handleBasicChange} />
      </div>
      <div className="form-group">
        <label>문의전화 / 비고</label>
        <input type="text" name="phone" value={basicInfo.phone} onChange={handleBasicChange} />
      </div>

      <hr style={{ borderColor: 'var(--border-color)', opacity: 0.5 }} />

      <div>
        <h2>글꼴 및 색상 설정</h2>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>각 영역별로 원하는 글꼴과 색상을 지정할 수 있습니다.</div>
        
        {renderStyleControl('메인 제목', 'titleStyle')}
        {renderStyleControl('부제목', 'subtitleStyle')}
        {renderStyleControl('교육정보 라벨 (파란색 배경 텍스트)', 'infoLabelStyle')}
        {renderStyleControl('교육정보 내용', 'infoValueStyle')}
        {renderStyleControl('표 머리글 (교육명, 일정, 내용 등)', 'tableHeaderStyle')}
        {renderStyleControl('표 안의 교육명', 'courseNameStyle')}
        {renderStyleControl('표 안의 교육일정', 'courseScheduleStyle')}
        {renderStyleControl('표 안의 교육내용', 'courseContentStyle')}
        {renderStyleControl('QR 안내문구', 'qrTextStyle')}
        {renderStyleControl('하단 로고', 'footerBrandStyle')}
      </div>

      <hr style={{ borderColor: 'var(--border-color)', opacity: 0.5 }} />

      <div>
        <h2>QR코드 설정</h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <div className="form-group">
              <label>신청 URL 1 (고정)</label>
              <input type="text" name="url" value="https://디지털배움터.kr" readOnly style={{ backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'not-allowed' }} title="기본 고정 주소입니다." />
            </div>
            <div className="form-group">
              <label>QR 안내문구 1 (고정)</label>
              <input type="text" name="qrText" value="디지털배움터" readOnly style={{ backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'not-allowed' }} title="기본 고정 문구입니다." />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div className="form-group">
              <label>신청 URL 2 (입력 시 생성됨)</label>
              <input type="text" name="url2" value={basicInfo.url2} onChange={handleBasicChange} placeholder="추가 URL을 입력하세요" />
            </div>
            <div className="form-group">
              <label>QR 안내문구 2 (고정)</label>
              <input type="text" name="qrText2" value="오전반수강신청" readOnly style={{ backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'not-allowed' }} title="기본 고정 문구입니다." />
            </div>
          </div>
        </div>
      </div>

      <hr style={{ borderColor: 'var(--border-color)', opacity: 0.5 }} />

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ marginBottom: 0 }}>교육과정 관리</h2>
          <button className="btn btn-outline" style={{ padding: '6px 12px' }} onClick={handleAddCourse}>
            <Plus size={16} /> 추가
          </button>
        </div>

        {courses.map((course, index) => (
          <div key={course.id} className="course-card">
            <div className="course-card-header">
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <button 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} 
                  onClick={() => moveCourse(index, 'up')}
                >
                  <ChevronUp size={18} />
                </button>
                <button 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} 
                  onClick={() => moveCourse(index, 'down')}
                >
                  <ChevronDown size={18} />
                </button>
              </div>
              <input 
                type="color" 
                value={course.color} 
                onChange={(e) => updateCourse(course.id, { color: e.target.value })}
                style={{ width: '24px', height: '24px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                title="교육명 글자색상 변경"
              />
              <div style={{ display: 'flex', gap: '4px' }}>
                <button className="btn btn-outline" style={{ padding: '4px 8px' }} onClick={() => copyCourse(course)} title="복사">
                  <Copy size={16} />
                </button>
                <button className="btn btn-danger" style={{ padding: '4px 8px' }} onClick={() => removeCourse(course.id)} title="삭제">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label>교육명 (텍스트 드래그 후 색상 변경 가능)</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <ContentEditableInput 
                    value={course.name} 
                    onChange={(newName) => updateCourse(course.id, { name: newName })}
                    onRecommend={(rawText) => {
                      const isDefault = course.contents.length === 1 && course.contents[0] === '교육 내용을 입력하세요';
                      const isEmpty = course.contents.length === 0 || (course.contents.length === 1 && course.contents[0] === '');
                      let newContents = course.contents;
                      
                      if (isDefault || isEmpty) {
                        for (const [key, contents] of Object.entries(mockRecommendations)) {
                          if (rawText.includes(key)) {
                            newContents = contents;
                            break;
                          }
                        }
                        updateCourse(course.id, { contents: newContents });
                      }
                    }}
                  />
                  <input 
                    type="color" 
                    title="부분 글자색 변경 (단어를 드래그하고 색상을 선택하세요)"
                    onMouseDown={(e) => e.preventDefault()} 
                    onChange={(e) => {
                      document.execCommand('foreColor', false, e.target.value);
                    }}
                    style={{ position: 'absolute', right: '8px', width: '24px', height: '24px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer', zIndex: 10 }}
                  />
                </div>
                <button 
                  className="btn btn-primary" 
                  style={{ padding: '8px', flexShrink: 0 }} 
                  onClick={() => recommendContent(course.id, course.name.replace(/<[^>]+>/g, ''))}
                  title="내용 추천"
                >
                  <Wand2 size={16} /> 추천
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>시작일</label>
                <input type="date" value={course.startDate} onChange={(e) => updateCourse(course.id, { startDate: e.target.value })} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>종료일</label>
                <input type="date" value={course.endDate} onChange={(e) => updateCourse(course.id, { endDate: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label>교육내용</label>
              {course.contents.map((content, cIndex) => (
                <div key={cIndex} className="content-item">
                  <input type="text" value={content} onChange={(e) => updateContent(course.id, cIndex, e.target.value)} />
                  <button className="btn btn-outline" style={{ padding: '8px', color: '#ef4444', borderColor: '#fee2e2' }} onClick={() => removeContent(course.id, cIndex)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button className="btn btn-outline" style={{ width: '100%', marginTop: '4px', borderStyle: 'dashed' }} onClick={() => addContent(course.id)}>
                + 내용 추가
              </button>
            </div>

            <div className="form-group">
              <label>비고</label>
              <input type="text" value={course.note || ''} onChange={(e) => updateCourse(course.id, { note: e.target.value })} />
            </div>

          </div>
        ))}
      </div>

      <hr style={{ borderColor: 'var(--border-color)', opacity: 0.5 }} />

      <div>
        <h2>자유 이미지 배치 (최대 5개)</h2>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>내 컴퓨터에 있는 이미지를 불러와서 문서의 원하는 곳에 자유롭게 배치하고 크기를 조절할 수 있습니다.</div>
        
        {customImages.length < 5 && (
          <label className="btn btn-outline" style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer', padding: '12px' }}>
            <ImagePlus size={18} style={{ marginRight: '8px' }} />
            이미지 추가하기 ({customImages.length}/5)
            <input type="file" accept="image/*" onChange={handleCustomImageUpload} style={{ display: 'none' }} />
          </label>
        )}

        {customImages.length > 0 && (
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {customImages.map((img, i) => (
              <div key={img.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={img.dataUrl} alt="custom" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', backgroundColor: img.backgroundColor || 'transparent' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>추가 이미지 {i + 1}</span>
                  </div>
                  <button className="btn btn-outline" style={{ padding: '6px', color: '#ef4444', borderColor: '#fca5a5' }} onClick={() => handleRemoveCustomImage(img.id)} title="이미지 삭제">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>배경색:</span>
                  <input 
                    type="color" 
                    value={img.backgroundColor && img.backgroundColor !== 'transparent' ? img.backgroundColor : '#ffffff'} 
                    onChange={(e) => setCustomImages(prev => prev.map(p => p.id === img.id ? { ...p, backgroundColor: e.target.value } : p))}
                    style={{ width: '24px', height: '24px', padding: 0, border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                    title="배경 색상 선택"
                  />
                  <button 
                    className="btn btn-outline" 
                    style={{ padding: '4px 8px', fontSize: '0.75rem', backgroundColor: img.backgroundColor === 'transparent' ? '#e2e8f0' : 'transparent' }} 
                    onClick={() => setCustomImages(prev => prev.map(p => p.id === img.id ? { ...p, backgroundColor: 'transparent' } : p))}
                  >
                    투명하게
                  </button>
                  <label style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', marginLeft: 'auto' }} title="이미지의 흰색 배경을 투명하게 만듭니다 (로고 이미지에 유용)">
                    <input 
                      type="checkbox" 
                      checked={!!img.removeWhite} 
                      onChange={(e) => setCustomImages(prev => prev.map(p => p.id === img.id ? { ...p, removeWhite: e.target.checked } : p))}
                    />
                    흰색 배경 없애기
                  </label>
                </div>
              </div>
            ))}
            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '8px' }}>
              * 우측 미리보기 화면에서 이미지를 드래그하여 이동하고, 우측 하단을 당겨 크기를 조절하세요.
            </div>
          </div>
        )}
      </div>

      <hr style={{ borderColor: 'var(--border-color)', opacity: 0.5 }} />

      <div>
        <h2>구글 시트 연동 설정</h2>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Apps Script Web App URL을 입력하고 현재 데이터를 구글 시트로 내보내세요.</div>
        
        <div className="form-group">
          <label>Apps Script Web App URL</label>
          <input 
            type="text" 
            name="googleScriptUrl" 
            value={basicInfo.googleScriptUrl || ''} 
            onChange={handleBasicChange} 
            placeholder="https://script.google.com/macros/s/.../exec" 
          />
        </div>
        
        <button 
          className="btn btn-outline" 
          style={{ width: '100%', marginTop: '8px', padding: '12px', borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: 'bold' }} 
          onClick={handleExportToGoogleSheets}
          disabled={isExporting}
        >
          {isExporting ? '전송 중...' : '구글 시트로 데이터 내보내기'}
        </button>
      </div>

    </div>
  );
}

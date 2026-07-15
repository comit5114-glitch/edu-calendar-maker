import { useState, useEffect } from 'react';
import { Course, BasicInfo, CustomImage } from './types';
import Sidebar from './components/Sidebar';
import Preview from './components/Preview';
import { Download, Printer, FileDown } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const initialBasicInfo: BasicInfo = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  title: 'AI디지털배움터',
  subtitle: '스마트폰, AI, 컴퓨터를 쉽고 재미있게 배우는 디지털 기초 교육',
  location: '영도구청 4층 정보화교육장',
  addressDetail: '부산 영도구 태종로423',
  dateText: '해당월 3일부터 (첫 교육 시 회원가입 필요)',
  time: '월~금 10:00~12:00 (오전반)',
  targetAudience: '교육희망자 누구나 신청 가능',
  phone: '파견교육 기간에 요청사항이 있으신 경우 담당자에게 문의바랍니다.',
  url: 'https://디지털배움터.kr',
  qrText: '디지털배움터',
  url2: '',
  qrText2: '오전반수강신청',
  orientation: 'portrait',
  
  titleStyle: { color: '#1e3a8a', fontFamily: 'Pretendard' },
  subtitleStyle: { color: '#0f172a', fontFamily: 'Pretendard' },
  infoLabelStyle: { color: '#ffffff', fontFamily: 'Pretendard' },
  infoValueStyle: { color: '#0f172a', fontFamily: 'Pretendard' },
  tableHeaderStyle: { color: '#0f172a', fontFamily: 'Pretendard', backgroundColor: '#fff0e6' },
  courseNameStyle: { color: '#1e40af', fontFamily: 'Pretendard', fontSize: '12px' },
  courseScheduleStyle: { color: '#0f172a', fontFamily: 'Pretendard', fontSize: '12px' },
  courseContentStyle: { color: '#0f172a', fontFamily: 'Pretendard', fontSize: '12px' },
  qrTextStyle: { color: '#dc2626', fontFamily: 'Pretendard' },
  footerBrandStyle: { color: '#1e3a8a', fontFamily: 'Pretendard' },
};

const defaultCourses: Course[] = [
  {
    id: '1',
    name: '스마트폰 기초',
    startDate: `${initialBasicInfo.year}-${String(initialBasicInfo.month).padStart(2, '0')}-03`,
    endDate: `${initialBasicInfo.year}-${String(initialBasicInfo.month).padStart(2, '0')}-04`,
    contents: ['스마트폰 기본 설정', '와이파이 연결하기', '앱 설치 및 삭제'],
    color: '#bfdbfe',
    time: '10:00~12:00',
  }
];

export default function App() {
  const [basicInfo, setBasicInfo] = useState<BasicInfo>(initialBasicInfo);
  const [courses, setCourses] = useState<Course[]>(defaultCourses);
  const [holidays, setHolidays] = useState<string[]>([]);
  const [customImages, setCustomImages] = useState<CustomImage[]>([]);
  const [activeTab, setActiveTab] = useState<'schedule' | 'calendar'>('schedule');

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('ai-edu-schedule-data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.basicInfo) {
          // 호환성 유지: 새로 추가된 스타일 속성이 없을 경우 기본값 병합
          setBasicInfo({ 
            ...initialBasicInfo, 
            ...parsed.basicInfo,
            courseNameStyle: { ...initialBasicInfo.courseNameStyle, ...parsed.basicInfo.courseNameStyle },
            courseScheduleStyle: { ...initialBasicInfo.courseScheduleStyle, ...parsed.basicInfo.courseScheduleStyle },
            courseContentStyle: { ...initialBasicInfo.courseContentStyle, ...parsed.basicInfo.courseContentStyle }
          });
        }
        if (parsed.courses) setCourses(parsed.courses);
        if (parsed.holidays) setHolidays(parsed.holidays);
        if (parsed.customImages) setCustomImages(parsed.customImages);
      } catch (e) {
        console.error("Failed to load data", e);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('ai-edu-schedule-data', JSON.stringify({ basicInfo, courses, holidays, customImages }));
  }, [basicInfo, courses, holidays, customImages]);

  const handleReset = () => {
    if (window.confirm("모든 데이터를 초기화하시겠습니까?")) {
      setBasicInfo(initialBasicInfo);
      setCourses(defaultCourses);
      setHolidays([]);
      setCustomImages([]);
      localStorage.removeItem('ai-edu-schedule-data');
    }
  };

  const captureCanvas = async () => {
    const el = document.getElementById('document-canvas');
    if (!el) return null;
    // For 300dpi, we scale 1 because our CSS layout is already huge (2480x3508 or 3508x2480)
    const canvas = await html2canvas(el, { scale: 1, useCORS: true });
    return canvas;
  };

  const handleExportPNG = async () => {
    const canvas = await captureCanvas();
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${basicInfo.year}년_${basicInfo.month}월_교육일정.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  const handleExportPDF = async () => {
    const canvas = await captureCanvas();
    if (!canvas) return;
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: basicInfo.orientation,
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${basicInfo.year}년_${basicInfo.month}월_교육일정.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="app-container">
      <Sidebar 
        basicInfo={basicInfo} 
        setBasicInfo={setBasicInfo}
        courses={courses}
        setCourses={setCourses}
        holidays={holidays}
        setHolidays={setHolidays}
        customImages={customImages}
        setCustomImages={setCustomImages}
        onReset={handleReset}
      />
      <div className="preview-area">
        <div className="preview-header">
          <div className="preview-tabs">
            <button 
              className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
              onClick={() => setActiveTab('schedule')}
            >
              교육과정 안내표 (세로 권장)
            </button>
            <button 
              className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
              onClick={() => setActiveTab('calendar')}
            >
              월간 캘린더 (가로 권장)
            </button>
          </div>
          <div className="preview-actions">
            <button className="btn btn-outline" onClick={handleExportPNG}>
              <Download size={18} /> PNG 저장
            </button>
            <button className="btn btn-outline" onClick={handleExportPDF}>
              <FileDown size={18} /> PDF 저장
            </button>
            <button className="btn btn-primary" onClick={handlePrint}>
              <Printer size={18} /> 인쇄
            </button>
          </div>
        </div>
        <div className="preview-content">
          <Preview 
            activeTab={activeTab} 
            basicInfo={basicInfo} 
            courses={courses} 
            holidays={holidays}
            setHolidays={setHolidays}
            customImages={customImages}
            setCustomImages={setCustomImages}
          />
        </div>
      </div>
    </div>
  );
}

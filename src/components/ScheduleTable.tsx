import { BasicInfo, Course } from '../types';
import { QRCodeSVG } from 'qrcode.react';

interface ScheduleTableProps {
  basicInfo: BasicInfo;
  courses: Course[];
}

function formatDateRange(start: string, end: string) {
  if (!start || !end) return '';
  const d1 = new Date(start);
  const d2 = new Date(end);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  
  const m1 = String(d1.getMonth() + 1).padStart(2, '0');
  const dd1 = String(d1.getDate()).padStart(2, '0');
  const w1 = days[d1.getDay()];
  
  if (start === end) {
    return `${m1}.${dd1}(${w1})`;
  }
  
  const m2 = String(d2.getMonth() + 1).padStart(2, '0');
  const dd2 = String(d2.getDate()).padStart(2, '0');
  const w2 = days[d2.getDay()];
  
  return `${m1}.${dd1}(${w1}) ~ ${m2}.${dd2}(${w2})`;
}

export default function ScheduleTable({ basicInfo, courses }: ScheduleTableProps) {
  // 왼쪽부터 아래로 최소 5줄 채우기
  const rowCount = Math.max(5, Math.ceil(courses.length / 2));
  const leftCourses = courses.slice(0, rowCount);
  const rightCourses = courses.slice(rowCount, rowCount * 2);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* TOP HEADER ROW: Title + Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px', width: '100%' }}>
        
        {/* Left Mascot */}
        <div style={{ width: '380px', flexShrink: 0, marginTop: '-30px', marginLeft: '-10px' }}>
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

        {/* Center Title */}
        <div className="doc-header" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '60px', marginTop: '20px' }}>
          <h1 className="doc-title" style={{ fontSize: '120px', textAlign: 'left', margin: 0, lineHeight: 1.2, fontFamily: basicInfo.titleStyle?.fontFamily, whiteSpace: 'nowrap' }}>
            <span style={{ color: '#0f172a' }}>{basicInfo.year}</span> <span style={{ color: 'rgb(0, 67, 250)' }}>AI디지털배움터</span><br />
            <span className="month" style={{ fontSize: '180px', color: '#dc2626', marginRight: '24px' }}>{basicInfo.month}월</span>
            <span style={{ color: '#0f172a' }}>교육과정 안내</span>
          </h1>
        </div>
        <div style={{ border: '4px solid #bfdbfe', borderRadius: '999px', padding: '16px 48px', color: '#1e3a8a', fontWeight: 800, fontSize: '36px', backgroundColor: 'white', alignSelf: 'flex-start', marginTop: '20px' }}>
          ✨ {basicInfo.targetAudience}
        </div>
      </div>

      {/* MIDDLE SECTION: 2-Column Layout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', gap: '40px' }}>
        
        {/* Left Column: Subtitle, Info Box, Notes */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', alignSelf: 'flex-start', marginLeft: '12px', marginTop: '-20px' }}>
            <div className="doc-subtitle-box" style={{ ...basicInfo.subtitleStyle }}>
              {basicInfo.subtitle}
            </div>

            <div className="doc-info-section" style={{ border: '6px solid var(--primary)', borderRadius: '40px', padding: '28px 36px', display: 'flex', flexDirection: 'column', gap: '32px', marginTop: '40px' }}>
              <div className="info-row">
                <div className="info-label" style={basicInfo.infoLabelStyle}>교육장소</div>
                <div className="info-value" style={basicInfo.infoValueStyle}>
                  {basicInfo.addressDetail}
                </div>
              </div>
              <div className="info-row">
                <div className="info-label" style={basicInfo.infoLabelStyle}>교육일자</div>
                <div className="info-value" style={{ textDecoration: 'underline wavy #ef4444 6px', textUnderlineOffset: '16px', position: 'relative', ...basicInfo.infoValueStyle }}>
                  {basicInfo.dateText}
                </div>
              </div>
              <div className="info-row">
                <div className="info-label" style={basicInfo.infoLabelStyle}>교육시간</div>
                <div className="info-value" style={{ textDecoration: 'underline wavy #ef4444 6px', textUnderlineOffset: '16px', position: 'relative', ...basicInfo.infoValueStyle }}>
                  {basicInfo.time}
                </div>
              </div>
            </div>
          </div>

          <div style={{ color: '#475569', fontWeight: 600, fontSize: 'var(--f-content)', lineHeight: 1.8, marginTop: '-12px', marginLeft: '12px' }}>
            * 파견교육 기간에 요청사항이 있으신 경우, 담당자에게 문의해 주시기 바랍니다.<br />
            * 모든 교육과정은 사정에 따라 일부 변경될 수 있는 점 양해 부탁드립니다.
          </div>
        </div>
        
        {/* Right Column: Empty spacer to preserve left column layout */}
        <div style={{ position: 'relative', width: '1000px', flexShrink: 0, display: 'flex', justifyContent: 'flex-end', marginTop: '-350px', marginRight: '-40px' }}>
        </div>

      </div>

      {/* TABLE SECTION */}
      <div className="schedule-table-wrapper" style={{ marginBottom: '40px' }}>
        <table className="schedule-table" style={{ width: '100%', tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ backgroundColor: basicInfo.tableHeaderStyle?.backgroundColor || '#fff0e6' }}>
              <th style={{ width: '15%', ...basicInfo.tableHeaderStyle }}>교육명</th>
              <th style={{ width: '15%', ...basicInfo.tableHeaderStyle }}>교육일정</th>
              <th style={{ width: '20%', ...basicInfo.tableHeaderStyle }}>교육내용</th>
              <th style={{ width: '15%', borderLeft: '3px solid #475569', ...basicInfo.tableHeaderStyle }}>교육명</th>
              <th style={{ width: '15%', ...basicInfo.tableHeaderStyle }}>교육일정</th>
              <th style={{ width: '20%', ...basicInfo.tableHeaderStyle }}>교육내용</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rowCount }).map((_, i) => {
              const leftCourse = leftCourses[i];
              const rightCourse = rightCourses[i];
              return (
                <tr key={i}>
                  {/* Left Side */}
                  {leftCourse ? (
                    <>
                      <td className="course-name" style={{ fontWeight: 800, ...basicInfo.courseNameStyle, ...(leftCourse.color ? { color: leftCourse.color } : {}) }}>
                        <span dangerouslySetInnerHTML={{ __html: leftCourse.name }} />
                      </td>
                      <td className="course-schedule" style={{ ...basicInfo.courseScheduleStyle }}>
                        {formatDateRange(leftCourse.startDate, leftCourse.endDate)}
                      </td>
                      <td className="course-content" style={{ textAlign: 'left', paddingLeft: '24px', ...basicInfo.courseContentStyle }}>
                        <ul style={{ margin: 0, paddingLeft: '24px', listStyleType: 'disc' }}>
                          {leftCourse.contents.map((c, j) => <li key={j} style={{ marginBottom: '8px' }}>{c}</li>)}
                        </ul>
                      </td>
                    </>
                  ) : (
                    <><td /><td /><td /></>
                  )}
                  {/* Right Side */}
                  {rightCourse ? (
                    <>
                      <td className="course-name" style={{ fontWeight: 800, borderLeft: '3px solid #475569', ...basicInfo.courseNameStyle, ...(rightCourse.color ? { color: rightCourse.color } : {}) }}>
                        <span dangerouslySetInnerHTML={{ __html: rightCourse.name }} />
                      </td>
                      <td className="course-schedule" style={{ ...basicInfo.courseScheduleStyle }}>
                        {formatDateRange(rightCourse.startDate, rightCourse.endDate)}
                      </td>
                      <td className="course-content" style={{ textAlign: 'left', paddingLeft: '24px', ...basicInfo.courseContentStyle }}>
                        <ul style={{ margin: 0, paddingLeft: '24px', listStyleType: 'disc' }}>
                          {rightCourse.contents.map((c, j) => <li key={j} style={{ marginBottom: '8px' }}>{c}</li>)}
                        </ul>
                      </td>
                    </>
                  ) : (
                    <><td style={{ borderLeft: '3px solid #475569' }} /><td /><td /></>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* FOOTER SECTION */}
      <div className="doc-footer" style={{ marginTop: 'auto', border: 'none', padding: '0', backgroundColor: 'transparent', display: 'flex', justifyContent: 'flex-start', alignItems: 'stretch', gap: '80px' }}>
        
        {/* QR codes & Text inside a blue border box on the left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', border: '6px solid var(--primary)', borderRadius: '24px', padding: '32px', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', gap: '32px' }}>
            {/* 고정된 첫 번째 QR 코드 */}
            <div className="footer-qr" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div className="qr-wrapper" style={{ border: '4px solid #bfdbfe' }}>
                <QRCodeSVG 
                  value="https://디지털배움터.kr" 
                  size={basicInfo.orientation === 'portrait' ? 200 : 200} 
                  level="M" 
                  includeMargin={false}
                />
              </div>
              <div style={{ fontSize: '36px', fontWeight: 800, ...basicInfo.qrTextStyle }}>
                디지털배움터
              </div>
            </div>

            {/* 선택적인 두 번째 QR 코드 자리 (비어있어도 공간 유지) */}
            {basicInfo.url2 ? (
              <div className="footer-qr" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div className="qr-wrapper" style={{ border: '4px solid #bfdbfe' }}>
                  <QRCodeSVG 
                    value={basicInfo.url2} 
                    size={basicInfo.orientation === 'portrait' ? 200 : 200} 
                    level="M" 
                    includeMargin={false}
                  />
                </div>
                <div style={{ fontSize: '36px', fontWeight: 800, ...basicInfo.qrTextStyle }}>
                  오전반수강신청
                </div>
              </div>
            ) : (
              <div className="footer-qr empty-qr" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', opacity: 0 }}>
                <div className="qr-wrapper" style={{ border: '4px solid #bfdbfe', width: '208px', height: '208px' }}></div>
                <div style={{ fontSize: '36px', fontWeight: 800, ...basicInfo.qrTextStyle }}>
                  오전반수강신청
                </div>
              </div>
            )}
          </div>

        </div>


      </div>
    </div>
  );
}

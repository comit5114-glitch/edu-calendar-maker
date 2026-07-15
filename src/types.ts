export interface TextStyle {
  color: string;
  fontFamily: string;
  backgroundColor?: string;
  fontSize?: string;
}

export interface Course {
  id: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  contents: string[];
  color: string;
  time: string; // Course specific time
  note?: string;
}

export interface BasicInfo {
  year: number;
  month: number;
  title: string;
  subtitle: string;
  location: string;
  addressDetail: string;
  dateText: string;
  time: string; // Overall time
  targetAudience: string;
  phone: string;
  url: string;
  qrText: string;
  url2: string;
  qrText2: string;
  orientation: 'portrait' | 'landscape';
  googleScriptUrl?: string; // Apps Script Web App URL

  // Styles
  titleStyle: TextStyle;
  subtitleStyle: TextStyle;
  infoLabelStyle: TextStyle;
  infoValueStyle: TextStyle;
  tableHeaderStyle: TextStyle;
  courseNameStyle: TextStyle;
  courseScheduleStyle: TextStyle;
  courseContentStyle: TextStyle;
  qrTextStyle: TextStyle;
  footerBrandStyle: TextStyle;
}

export interface CustomImage {
  id: string;
  dataUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
  backgroundColor?: string;
  removeWhite?: boolean;
}

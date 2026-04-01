import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

interface ReportData {
  wasteReduced: number;
  moneySaved: number;
  co2Reduced: number;
  peopleFed: number;
  weeklyWaste: number[];
  userName: string;
  date: string;
}

export const generateAndDownloadPDF = async (data: ReportData) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>MessOptimize - Impact Report</title>
      <style>
        body {
          font-family: 'Helvetica', Arial, sans-serif;
          padding: 40px;
          color: #233D4D;
          line-height: 1.6;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #FE7F2D;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 32px;
          font-weight: bold;
          color: #FE7F2D;
        }
        .title {
          font-size: 24px;
          color: #233D4D;
          margin-top: 10px;
        }
        .date {
          color: #6B7280;
          font-size: 12px;
          margin-top: 5px;
        }
        .greeting {
          margin-bottom: 30px;
          font-size: 16px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }
        .stat-card {
          background: #F8F9FA;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          border: 1px solid #E9ECEF;
        }
        .stat-value {
          font-size: 32px;
          font-weight: bold;
          color: #FE7F2D;
          margin: 10px 0;
        }
        .stat-label {
          color: #6B7280;
          font-size: 14px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          margin: 20px 0 15px;
          color: #233D4D;
          border-left: 4px solid #FE7F2D;
          padding-left: 12px;
        }
        .chart-container {
          background: #F8F9FA;
          padding: 15px;
          border-radius: 8px;
          margin: 15px 0;
        }
        .chart-row {
          display: flex;
          align-items: center;
          margin: 8px 0;
        }
        .chart-label {
          width: 60px;
          font-size: 12px;
        }
        .chart-bar {
          flex: 1;
          height: 30px;
          background: #FE7F2D;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 10px;
          color: white;
          font-size: 12px;
          font-weight: bold;
        }
        .impact-card {
          background: #A1C18120;
          border: 1px solid #A1C181;
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
          text-align: center;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #E9ECEF;
          font-size: 12px;
          color: #6B7280;
        }
        @media print {
          body { margin: 0; padding: 20px; }
          .stat-card { break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">♻️ MessOptimize</div>
        <div class="title">Impact Report</div>
        <div class="date">Generated on ${data.date}</div>
      </div>
      
      <div class="greeting">
        Hello <strong>${data.userName}</strong>,<br>
        Here's your waste reduction impact summary.
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div>🍽️</div>
          <div class="stat-value">${data.wasteReduced} kg</div>
          <div class="stat-label">Food Waste Reduced</div>
        </div>
        <div class="stat-card">
          <div>💰</div>
          <div class="stat-value">₹${data.moneySaved.toLocaleString()}</div>
          <div class="stat-label">Money Saved</div>
        </div>
        <div class="stat-card">
          <div>🌱</div>
          <div class="stat-value">${data.co2Reduced} kg</div>
          <div class="stat-label">CO₂ Emissions Saved</div>
        </div>
        <div class="stat-card">
          <div>👥</div>
          <div class="stat-value">${data.peopleFed}</div>
          <div class="stat-label">Extra People Fed</div>
        </div>
      </div>
      
      <div class="section-title">Weekly Waste Reduction</div>
      <div class="chart-container">
        ${data.weeklyWaste.map((value, index) => `
          <div class="chart-row">
            <div class="chart-label">Week ${index + 1}</div>
            <div class="chart-bar" style="width: ${(value / 150) * 100}%; max-width: 100%;">
              ${value} kg
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="section-title">Environmental Impact</div>
      <div class="impact-card">
        🌳 Equivalent to planting ${Math.floor(data.wasteReduced / 10)} trees<br>
        💧 Water saved: ${(data.wasteReduced * 250).toLocaleString()} liters<br>
        🚗 Carbon offset: ${Math.floor(data.co2Reduced / 9)} cars off road for a day
      </div>
      
      <div class="footer">
        Made with 💚 for a waste-free campus<br>
        MessOptimize - Stop Food Waste, Start Saving
      </div>
    </body>
    </html>
  `;

  try {
    // Generate PDF
    const { uri } = await Print.printToFileAsync({ html });
    
    // Share/Download PDF
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Save Impact Report',
        UTI: 'com.adobe.pdf',
      });
    } else {
      // For web - create download link
      if (Platform.OS === 'web') {
        const link = document.createElement('a');
        link.href = uri;
        link.download = `MessOptimize_Report_${data.date}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('PDF generation error:', error);
    return { success: false, error: 'Failed to generate PDF' };
  }
};
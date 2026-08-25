/**
 * Professional Report Exporter & File Downloader Utility for ConstructIQ
 */

/**
 * Downloads data as a CSV file
 * @param {string} filename 
 * @param {string[]} headers 
 * @param {Array<Array<any>>} rows 
 */
export const downloadCSV = (filename, headers, rows) => {
  const escapeCell = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvContent = [
    headers.map(escapeCell).join(','),
    ...rows.map(row => row.map(escapeCell).join(','))
  ].join('\r\n');

  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Downloads a structured text/document report file
 * @param {string} filename 
 * @param {string} content 
 */
export const downloadTextDocument = (filename, content, mimeType = 'text/plain;charset=utf-8') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Opens a styled printable executive report window (Print / Save as PDF)
 * @param {Object} options 
 */
export const printExecutiveReport = ({ title, subtitle, date, sections = [], metadata = {} }) => {
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) {
    alert('Please allow popups to generate and print PDF reports.');
    return;
  }

  const currentDate = date || new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const metadataHtml = Object.entries(metadata).map(([key, val]) => `
    <div class="meta-item">
      <span class="meta-label">${key}:</span>
      <span class="meta-value">${val}</span>
    </div>
  `).join('');

  const sectionsHtml = sections.map(sec => `
    <div class="section">
      <h3 class="section-title">${sec.title}</h3>
      ${sec.description ? `<p class="section-desc">${sec.description}</p>` : ''}
      ${sec.table ? `
        <table class="report-table">
          <thead>
            <tr>
              ${sec.table.headers.map(h => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${sec.table.rows.map(row => `
              <tr>
                ${row.map(cell => `<td>${cell !== null && cell !== undefined ? cell : '—'}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : ''}
      ${sec.metrics ? `
        <div class="metrics-grid">
          ${sec.metrics.map(m => `
            <div class="metric-card">
              <span class="metric-val">${m.value}</span>
              <span class="metric-lbl">${m.label}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} - ConstructIQ Report</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1a1a1a;
            margin: 0;
            padding: 30px;
            background: #ffffff;
          }
          .header {
            border-bottom: 2px solid #d4af37;
            padding-bottom: 16px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .brand {
            font-size: 22px;
            font-weight: 800;
            color: #111827;
            letter-spacing: -0.5px;
          }
          .brand span {
            color: #d4af37;
          }
          .report-title {
            font-size: 20px;
            font-weight: 700;
            margin: 8px 0 4px 0;
            color: #111827;
          }
          .report-sub {
            font-size: 12px;
            color: #6b7280;
            margin: 0;
          }
          .meta-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 24px;
            font-size: 12px;
          }
          .meta-label {
            font-weight: 600;
            color: #4b5563;
          }
          .meta-value {
            font-weight: 700;
            color: #111827;
          }
          .section {
            margin-bottom: 28px;
          }
          .section-title {
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #374151;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 6px;
            margin-bottom: 10px;
          }
          .section-desc {
            font-size: 12px;
            color: #6b7280;
            margin: 0 0 10px 0;
          }
          .report-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            margin-top: 8px;
          }
          .report-table th {
            background: #f3f4f6;
            color: #374151;
            font-weight: 700;
            text-align: left;
            padding: 8px 10px;
            border: 1px solid #e5e7eb;
          }
          .report-table td {
            padding: 8px 10px;
            border: 1px solid #e5e7eb;
            color: #1f2937;
          }
          .report-table tr:nth-child(even) {
            background: #fafafa;
          }
          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-top: 10px;
          }
          .metric-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 12px;
            text-align: center;
          }
          .metric-val {
            display: block;
            font-size: 18px;
            font-weight: 800;
            color: #0f172a;
          }
          .metric-lbl {
            font-size: 11px;
            color: #64748b;
            font-weight: 600;
            text-transform: uppercase;
          }
          .footer {
            margin-top: 40px;
            border-top: 1px solid #e5e7eb;
            padding-top: 12px;
            font-size: 10px;
            color: #9ca3af;
            display: flex;
            justify-content: space-between;
          }
          @media print {
            body { padding: 15px; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">Construct<span>IQ</span></div>
            <h1 class="report-title">${title}</h1>
            <p class="report-sub">${subtitle || 'Official Construction & Site Management Report'}</p>
          </div>
          <div style="text-align: right; font-size: 11px; color: #6b7280;">
            <div><strong>Generated:</strong> ${currentDate}</div>
            <div><strong>Status:</strong> Verified & Certified</div>
          </div>
        </div>

        ${metadataHtml ? `<div class="meta-grid">${metadataHtml}</div>` : ''}

        ${sectionsHtml}

        <div class="footer">
          <span>ConstructIQ Smart Construction Platform</span>
          <span>Confidential • Internal Site Record</span>
          <span>Page 1 of 1</span>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
};

const fs = require('fs');
const path = require('path');

// 列出要转换的 CSV 文件及其标题
const csvFiles = [
  { file: '袁总家产品比较2万5年缴.csv', title: '产品比较（2万/5年缴）' },
  { file: '袁总家产品比较1万10年缴.csv', title: '产品比较（1万/10年缴）' },
];

const projectRoot = path.join(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');

// 确保 public 目录存在
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

let html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>保险产品现金价值对比</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 20px; }
    h1 { text-align: center; }
    table { border-collapse: collapse; margin: 40px 0; width: 100%; }
    caption { caption-side: top; font-weight: bold; font-size: 1.2rem; margin-bottom: 8px; }
    th, td { border: 1px solid #ddd; padding: 4px 8px; text-align: right; }
    th { background-color: #f6f6f6; }
    tr:nth-child(even) { background-color: #fbfbfb; }
  </style>
</head>
<body>
  <h1>保险产品现金价值对比</h1>
`;

csvFiles.forEach(({ file, title }) => {
  const csvPath = path.join(projectRoot, file);
  if (!fs.existsSync(csvPath)) {
    console.warn(`[WARN] 找不到文件: ${csvPath}`);
    return;
  }

  const content = fs.readFileSync(csvPath, 'utf8').trim();
  const lines = content.split(/\r?\n/);
  const headers = lines[0].split(',');

  html += `<table>\n  <caption>${title}</caption>\n  <thead>\n    <tr>\n      ${headers.map(h => `<th>${h}</th>`).join('')}\n    </tr>\n  </thead>\n  <tbody>`;

  lines.slice(1).forEach(line => {
    if (!line.trim()) return; // 跳过空行
    const cols = line.split(',');
    html += `\n    <tr>${cols.map(c => `<td>${c}</td>`).join('')}</tr>`;
  });

  html += `\n  </tbody>\n</table>\n`;
});

html += '\n</body>\n</html>';

const outputPath = path.join(publicDir, 'csv-compare.html');
fs.writeFileSync(outputPath, html, 'utf8');
console.log(`✅ 已生成静态页面: ${path.relative(projectRoot, outputPath)}`); 
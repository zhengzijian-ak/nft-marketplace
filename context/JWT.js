const fs = require('fs');
const path = require('path');

try {
    // 获取项目根目录下 .pinata 文件的完整路径
    const filePath = path.join(__dirname, '..', '.pinata');
    const JWT = fs.readFileSync(filePath, 'utf8').trim();
    module.exports = { JWT };
} catch (error) {
    console.error('loading .pinata file error:', error);
    module.exports = { JWT: '' };
} 
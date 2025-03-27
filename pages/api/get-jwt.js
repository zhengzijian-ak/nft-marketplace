const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
    try {
        const filePath = path.join(process.cwd(), '.pinata');
        const JWT = fs.readFileSync(filePath, 'utf8').trim();
        res.status(200).json({ JWT });
    } catch (error) {
        res.status(500).json({ error: 'Failed to read JWT file' });
    }
}
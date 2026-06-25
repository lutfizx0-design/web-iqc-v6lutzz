import express from 'express';
import { render } from './iqc.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/generate-style2', async (req, res) => {
    try {
        const { text, time, bubbleColor, background } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        // Panggil render dengan opsi tambahan
        const outputPath = await render(
            text,
            time || '22.54',
            null,
            {
                bubbleColor: bubbleColor || '#ffc5d5',
                background: background || 'light'
            }
        );

        res.sendFile(outputPath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).json({ error: 'Failed to send image' });
            }
        });
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

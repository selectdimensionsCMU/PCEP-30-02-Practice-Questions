const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const resultsFile = path.join(__dirname, 'results.json');

app.post('/save-results', async (req, res) => {
    try {
        const result = req.body;
        let results = [];
        
        try {
            const data = await fs.readFile(resultsFile, 'utf8');
            results = JSON.parse(data);
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }

        results.push(result);
        await fs.writeFile(resultsFile, JSON.stringify(results, null, 2));
        res.json({ message: 'Results saved successfully' });
    } catch (error) {
        console.error('Error saving results:', error);
        res.status(500).json({ error: 'Failed to save results' });
    }
});

app.get('/get-results', async (req, res) => {
    try {
        const data = await fs.readFile(resultsFile, 'utf8');
        const results = JSON.parse(data);
        res.json(results);
    } catch (error) {
        if (error.code === 'ENOENT') {
            res.json([]);
        } else {
            console.error('Error reading results:', error);
            res.status(500).json({ error: 'Failed to read results' });
        }
    }
});

app.use(express.static(__dirname));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
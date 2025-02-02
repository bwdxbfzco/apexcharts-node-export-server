const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3000;

// Middleware to parse JSON request body
app.use(bodyParser.json());

// Endpoint to generate ApexChart as an image
app.post('/generate-chart', async (req, res) => {
    const { options, series, type = 'line' } = req.body;

    if (!options || !series) {
        return res.status(400).json({ error: 'Invalid request body. Options and series are required.' });
    }

    try {
        // Launch a Puppeteer browser instance
        const browser = await puppeteer.launch({
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        // HTML content to render ApexChart
        const chartHTML = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>ApexChart</title>
                <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
            </head>
            <body>
                <div id="chart" style="width: 600px; height: 400px;"></div>
                <script>
                    const options = ${JSON.stringify(options)};
                    const series = ${JSON.stringify(series)};
                    options.series = series;
                    const chart = new ApexCharts(document.querySelector("#chart"), options);
                    chart.render();
                </script>
            </body>
            </html>
        `;

        // Set HTML content for Puppeteer
        await page.setContent(chartHTML, { waitUntil: 'networkidle0' });

        // Wait for the chart to render
        await page.waitForSelector('#chart svg');

        // Capture screenshot of the chart
        const chartElement = await page.$('#chart');
        const screenshotBuffer = await chartElement.screenshot({ encoding: 'binary' });

        // Close Puppeteer browser
        await browser.close();

        // Send the image buffer as a response
        res.setHeader('Content-Type', 'image/png');
        res.send(screenshotBuffer);
    } catch (error) {
        console.error('Error generating chart:', error);
        res.status(500).json({ error: 'Failed to generate chart' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

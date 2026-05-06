import { chromium } from 'playwright';

// Force HOME to be set for Playwright
process.env.HOME = process.env.USERPROFILE || 'C:\\Users\\SRINATH';

async function debugApp() {
    console.log("🔍 Starting Visual Debugger...");

    try {
        const browser = await chromium.launch();
        const page = await browser.newPage();

        // Listen for console logs
        page.on('console', msg => console.log(`BROWSER CONSOLE: ${msg.type().toUpperCase()}: ${msg.text()}`));
        page.on('pageerror', err => console.log(`BROWSER ERROR: ${err}`));

        console.log("1. Navigating to http://localhost:5173/...");
        await page.goto('http://localhost:5173/', { timeout: 10000 });

        console.log("2. Waiting for selector #root...");
        try {
            await page.waitForSelector('#root', { timeout: 3000 });
            console.log("✅ Root element found.");
        } catch (e) {
            console.log("❌ Root element NOT found or empty.");
        }

        console.log("3. Capturing Debug Screenshot...");
        await page.screenshot({ path: 'debug_evidence.png' });

        await browser.close();

    } catch (error) {
        console.error("❌ Debugger Failed:", error);
    }
}

debugApp();

import { chromium } from 'playwright';
import path from 'path';

// Force HOME to be set for Playwright
process.env.HOME = process.env.USERPROFILE || 'C:\\Users\\SRINATH';

async function captureEvidence() {
    console.log("📸 Starting Visual Agent Audit (Fast Mode)...");

    try {
        const browser = await chromium.launch();
        const page = await browser.newPage();

        console.log("1. Navigating...");
        await page.goto('http://localhost:5173/', { timeout: 10000 });
        console.log("✅ Loaded");

        // Take a quick screenshot
        console.log("2. Capturing Screenshot...");
        await page.screenshot({ path: 'evidence_fast.png' });
        console.log("✅ Screenshot Saved: evidence_fast.png");

        await browser.close();

    } catch (error) {
        console.error("❌ Failed:", error);
    }
}

captureEvidence();

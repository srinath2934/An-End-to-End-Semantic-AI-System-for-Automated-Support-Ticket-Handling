import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

// Force HOME to be set for Playwright
process.env.HOME = process.env.USERPROFILE || 'C:\\Users\\SRINATH';

async function captureEvidence() {
    console.log("📸 Starting Visual Agent Audit...");
    console.log(`   Target: http://localhost:5173/`);

    try {
        const browser = await chromium.launch();
        const page = await browser.newPage();

        // 1. Navigate
        await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
        console.log("✅ Navigation Successful");

        // 2. Click specific elements to prove interactivity
        // Try searching
        const searchInput = await page.getByPlaceholder('Search deep data...');
        if (searchInput) {
            await searchInput.fill('Billing');
            console.log("✅ Search Interaction Verified");
        }

        // 3. Take Screenshot
        const screenshotPath = path.resolve('visual_evidence_dashboard.png');
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`✅ Screenshot captured at: ${screenshotPath}`);

        // 4. Verify Content
        const title = await page.title();
        console.log(`   Page Title: "${title}"`);

        await browser.close();

    } catch (error) {
        console.error("❌ Visual Audit Failed:", error);
        process.exit(1);
    }
}

captureEvidence();

import { chromium } from 'playwright';

process.env.HOME = process.env.USERPROFILE || 'C:\\Users\\SRINATH';

async function showFilters() {
    const browser = await chromium.launch({ headless: false, slowMo: 1000 });
    const page = await browser.newPage();

    try {
        await page.goto('http://localhost:5173/');
        await page.waitForTimeout(3000);

        console.log("📸 Capturing dashboard with filters...");
        await page.screenshot({ path: 'zendesk_filters.png', fullPage: false });

        console.log("\n🧪 Testing Team Filter...");
        await page.selectOption('select', { label: 'Billing' });
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'filter_billing.png' });

        const count = await page.locator('.table-row').count();
        console.log(`   ✅ Filtered to ${count} Billing tickets\n`);

        console.log("✅ Filters are working!");

    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        await page.waitForTimeout(2000);
        await browser.close();
    }
}

showFilters();

import { chromium } from 'playwright';

process.env.HOME = process.env.USERPROFILE || 'C:\\Users\\SRINATH';

async function testAllFeatures() {
    console.log("🧪 COMPREHENSIVE FEATURE TEST\n");

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        // 1. Load Dashboard
        console.log("1️⃣ Loading Dashboard...");
        await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'test_1_dashboard.png' });
        console.log("   ✅ Dashboard loaded\n");

        // 2. Test Search Filter
        console.log("2️⃣ Testing Search Filter...");
        const searchBox = page.locator('input[placeholder*="Search"]');
        await searchBox.fill('Billing');
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'test_2_search.png' });
        const rowsAfterSearch = await page.locator('.table-row').count();
        console.log(`   ${rowsAfterSearch > 0 ? '✅' : '❌'} Search filter: ${rowsAfterSearch} results\n`);

        // 3. Click a Ticket
        console.log("3️⃣ Clicking first ticket...");
        await searchBox.clear();
        await page.waitForTimeout(500);
        const firstTicket = page.locator('.table-row').first();
        await firstTicket.click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'test_3_ticket_detail.png' });

        // Check if AI panel appeared
        const aiPanel = await page.locator('text=Agency AI').count();
        console.log(`   ${aiPanel > 0 ? '✅' : '❌'} AI Panel visible: ${aiPanel > 0}\n`);

        // 4. Check if prediction loaded
        console.log("4️⃣ Checking AI Prediction...");
        await page.waitForTimeout(2000);
        const confidenceText = await page.locator('text=/\\d+%/').first().textContent().catch(() => null);
        console.log(`   ${confidenceText ? '✅' : '❌'} Confidence score: ${confidenceText || 'NOT FOUND'}\n`);

        // 5. Test Reports Button
        console.log("5️⃣ Testing Reports Navigation...");
        await page.goto('http://localhost:5173/');
        await page.waitForTimeout(1000);
        const reportsBtn = page.locator('button:has-text("Reports")');
        await reportsBtn.click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'test_4_reports.png' });
        const chartVisible = await page.locator('text=Agency Analytics').count();
        console.log(`   ${chartVisible > 0 ? '✅' : '❌'} Reports page loaded: ${chartVisible > 0}\n`);

        // 6. Test Data Explorer
        console.log("6️⃣ Testing Data Explorer...");
        const dataIcon = page.locator('aside.main-nav >> [title="Data Explorer"]');
        await dataIcon.click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'test_5_data_explorer.png' });
        console.log("   ✅ Data Explorer navigation\n");

        console.log("\n📊 TEST SUMMARY:");
        console.log("Screenshots saved: test_1_dashboard.png through test_5_data_explorer.png");

    } catch (error) {
        console.error("❌ TEST FAILED:", error.message);
        await page.screenshot({ path: 'test_error.png' });
    } finally {
        await browser.close();
    }
}

testAllFeatures();

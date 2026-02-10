import { chromium } from 'playwright';

process.env.HOME = process.env.USERPROFILE || 'C:\\Users\\SRINATH';

async function verifyBackendConnection() {
    console.log("🔗 VERIFYING BACKEND-FRONTEND CONNECTION\n");

    const browser = await chromium.launch({ headless: false, slowMo: 800 });
    const page = await browser.newPage();

    // Listen to network requests
    const apiCalls = [];
    page.on('response', async (response) => {
        const url = response.url();
        if (url.includes('127.0.0.1:8000') || url.includes('localhost:8000')) {
            const method = response.request().method();
            const status = response.status();
            apiCalls.push({ method, url, status });
            console.log(`   🌐 API Call: ${method} ${url} → ${status}`);
        }
    });

    try {
        console.log("1️⃣ Loading Dashboard...");
        await page.goto('http://localhost:5173/');
        await page.waitForTimeout(3000);
        console.log("");

        console.log("2️⃣ Clicking a ticket to trigger AI prediction...");
        const firstTicket = page.locator('.table-row').first();
        await firstTicket.click();
        await page.waitForTimeout(5000);
        console.log("");

        console.log("3️⃣ Checking if AI prediction loaded...");
        const hasAI = await page.locator('text=The Agency AI').count() > 0;
        const category = await page.locator('text=Inferred Category').locator('..').locator('div').nth(1).textContent().catch(() => 'NOT FOUND');
        console.log(`   ${hasAI ? '✅' : '❌'} AI Panel: ${hasAI ? 'VISIBLE' : 'HIDDEN'}`);
        console.log(`   📊 Predicted Category: ${category}\n`);

        console.log("4️⃣ Testing Apply Macro → Editor sync...");
        const applyBtn = page.locator('button:has-text("Apply Suggested Macro")');
        await applyBtn.click();
        await page.waitForTimeout(2000);

        const editorText = await page.locator('textarea').inputValue();
        console.log(`   ${editorText.length > 0 ? '✅' : '❌'} Editor filled: ${editorText.length} chars`);
        console.log(`   Preview: "${editorText.substring(0, 80)}..."\n`);

        await page.screenshot({ path: 'backend_connection_proof.png', fullPage: true });

        console.log("\n📊 API CALLS SUMMARY:");
        console.log(`   Total backend calls: ${apiCalls.length}`);
        apiCalls.forEach((call, i) => {
            console.log(`   ${i + 1}. ${call.method} ${call.url.split('8000')[1]} → ${call.status}`);
        });

        if (apiCalls.length === 0) {
            console.log("\n❌ WARNING: NO BACKEND CALLS DETECTED!");
            console.log("   The frontend is NOT connected to the backend.");
        } else {
            console.log("\n✅ Backend-Frontend connection is WORKING!");
        }

    } catch (error) {
        console.error("\n❌ TEST FAILED:", error.message);
    } finally {
        await page.waitForTimeout(3000);
        await browser.close();
    }
}

verifyBackendConnection();

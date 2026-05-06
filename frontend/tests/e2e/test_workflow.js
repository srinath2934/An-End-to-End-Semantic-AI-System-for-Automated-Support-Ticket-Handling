import { chromium } from 'playwright';

process.env.HOME = process.env.USERPROFILE || 'C:\\Users\\SRINATH';

async function testCompleteWorkflow() {
    console.log("🎯 TESTING COMPLETE AI WORKFLOW\n");

    const browser = await chromium.launch({ headless: false, slowMo: 500 });
    const page = await browser.newPage();

    try {
        // 1. Go to dashboard
        await page.goto('http://localhost:5173/');
        await page.waitForTimeout(2000);
        console.log("✅ Dashboard loaded\n");

        // 2. Click first ticket
        console.log("📋 Clicking first ticket...");
        const firstTicket = page.locator('.table-row').first();
        await firstTicket.click();
        await page.waitForTimeout(3000);
        await page.screenshot({ path: 'workflow_1_ticket_opened.png' });
        console.log("✅ Ticket detail opened\n");

        // 3. Wait for AI prediction
        console.log("🤖 Waiting for AI prediction...");
        await page.waitForSelector('text=The Agency AI', { timeout: 5000 });
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'workflow_2_ai_loaded.png' });

        const confidence = await page.locator('text=/\\d+%/').first().textContent();
        console.log(`✅ AI Confidence: ${confidence}\n`);

        // 4. Click "Apply Suggested Macro"
        console.log("⚡ Clicking 'Apply Suggested Macro'...");
        const applyButton = page.locator('button:has-text("Apply Suggested Macro")');
        await applyButton.click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'workflow_3_macro_applied.png' });
        console.log("✅ Macro applied to editor\n");

        // 5. Check if textarea has content
        const textareaContent = await page.locator('textarea').inputValue();
        console.log(`📝 Editor content length: ${textareaContent.length} characters`);
        console.log(`   Preview: "${textareaContent.substring(0, 50)}..."\n`);

        // 6. Click Submit
        console.log("📤 Clicking 'Submit as Solved'...");
        const submitButton = page.locator('button:has-text("Submit as Solved")');
        await submitButton.click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'workflow_4_submitted.png' });
        console.log("✅ Ticket submitted\n");

        console.log("\n🎉 COMPLETE WORKFLOW TEST PASSED!");

    } catch (error) {
        console.error("\n❌ WORKFLOW FAILED:", error.message);
        await page.screenshot({ path: 'workflow_error.png' });
    } finally {
        await page.waitForTimeout(2000);
        await browser.close();
    }
}

testCompleteWorkflow();

import { chromium } from "playwright";

export async function scrapeIPO(symbol: string) {
  const url = `https://www.nseindia.com/market-data/issue-information?symbol=${symbol}&series=EQ&type=Active`;

  console.log(`Launching browser for ${symbol}...`);
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    extraHTTPHeaders: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    }
  });
  const page = await context.newPage();

  page.on('console', msg => console.log('BROWSER:', msg.text()));

  console.log('Visiting NSE homepage to set cookies...');
  await page.goto('https://www.nseindia.com', { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2000);

  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

  console.log("Waiting for IPO data to load...");
  await page.waitForTimeout(5000);
  
  console.log("Clicking on 'Issue Information' tab...");
  try {
    const issueInfoTab = await page.locator('button:has-text("Issue Information"), a:has-text("Issue Information"), [role="tab"]:has-text("Issue Information")').first();
    await issueInfoTab.click();
    await page.waitForSelector('table', { timeout: 5000 });
    await page.waitForTimeout(3000); 
    console.log("Issue Information tab clicked, table is visible");
    
    await page.screenshot({ path: 'issue-info-screenshot.png', fullPage: true });
    console.log("Issue Info screenshot saved to issue-info-screenshot.png");
  } catch (error) {
    console.log("Could not click Issue Information tab or find table:", error);
  }
  
  console.log("Extracting Issue Information data...");
  const issueInfoData = await page.evaluate(() => {
    const issueInfo: Record<string, string> = {};
    
    const tables = document.querySelectorAll('table');
    console.log(`Found ${tables.length} tables on Issue Information tab`);
    
    tables.forEach((table, tableIdx) => {
      const allRows = Array.from(table.querySelectorAll('tr'));
      console.log(`  Table ${tableIdx} has ${allRows.length} rows`);
      
      allRows.slice(0, 10).forEach((row, rowIdx) => {
        const cells = Array.from(row.querySelectorAll('td, th'));
        if (cells.length >= 2) {
          const key = cells[0]?.textContent?.trim().substring(0, 30) || '';
          const value = cells[1]?.textContent?.trim().substring(0, 50) || '';
          console.log(`    Row ${rowIdx}: [${key}] = [${value}]`);
        }
      });
      
      allRows.forEach((row) => {
        const cells = Array.from(row.querySelectorAll('td, th'));
        if (cells.length >= 2) {
          const key = cells[0]?.textContent?.trim() || '';
          const value = cells[1]?.textContent?.trim() || '';
          
          const issueInfoFields = ['Symbol', 'Issue Period', 'Issue Size', 'Issue Type', 
                                   'Price Range', 'Face Value', 'Discount', 
                                   'Cut-off time for UPI Mandate Confirmation', 
                                   'Minimum Investment'];
          
          if (key && value && key.length < 50 && value.length > 0) {  
            console.log(`    Testing key: "${key}" (length: ${key.length})`);
            
            if (issueInfoFields.includes(key)) {
              issueInfo[key] = value;
              console.log(`  ✓ MATCHED and Extracted: ${key} = ${value.substring(0, 50)}`);
            } else if (key.includes('Symbol') || key.includes('Issue')) {
              console.log(`    Near-match but not exact: "${key}"`);
            }
          }
        }
      });
    });
    
    return issueInfo;
  });
  
  console.log(`Found ${Object.keys(issueInfoData).length} issue info fields from Issue Information tab`);

  console.log("Clicking on 'Bid Details' tab...");
  try {
    const bidDetailsTab = page.locator('text="Bid Details"').first();
    await bidDetailsTab.click();
    await page.waitForTimeout(2000);
    console.log("Bid Details tab clicked");
  } catch (error) {
    console.log("Could not click Bid Details tab");
  }
  
  await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
  console.log("Screenshot saved to debug-screenshot.png");

  console.log("Extracting subscription data from Bid Details...");
  const bidDetailsData = await page.evaluate(() => {
    let lastUpdated = null;
    const allDivs = Array.from(document.querySelectorAll('div'));
    const updatedDiv = allDivs.find(div => div.textContent?.includes('Updated as on'));
    if (updatedDiv) {
      const lastUpdatedMatch = updatedDiv.textContent?.match(/Updated as on ([\d-]+ [\d:]+)/);
      lastUpdated = lastUpdatedMatch ? lastUpdatedMatch[1] : null;
    }

    const issueInfo: Record<string, string> = {};
    const subscriptions: any[] = [];
    const lotDistributions: any[] = [];
    const applicationBreakups: any[] = [];

    const tables = document.querySelectorAll('table');
    
    let foundSubscriptionTable = false;
    
    tables.forEach((table) => {
      const rows = Array.from(table.querySelectorAll('tbody tr'));
      const headers = Array.from(table.querySelectorAll('thead th')).map(h => h.textContent?.trim() || '');
      const hasOfferedApplied = headers.some(h => h.includes('OFFERED')) && headers.some(h => h.includes('BID FOR'));
      const hasLotQty = headers.some(h => h.includes('Lot')) && headers.some(h => h.includes('Qty'));
      const hasReservedApplied = headers.some(h => h.includes('Reserved') || h.includes('RESERVED')) && 
                                 headers.some(h => h.includes('Applied') || h.includes('APPLIED'));
      
      if (hasOfferedApplied && foundSubscriptionTable) {
        return;
      }
      
      rows.forEach((row) => {
        const cells = Array.from(row.querySelectorAll('td'));
        if (cells.length < 2) return;

        const serialNumber = cells[0]?.textContent?.trim() || '';
        const category = cells[1]?.textContent?.trim() || '';
        if (!category || category === '-') return;

        if (hasOfferedApplied) {
          const offered = cells[2]?.textContent?.trim().replace(/,/g, '') || '0';
          const applied = cells[3]?.textContent?.trim().replace(/,/g, '') || '0';
          const times = cells[4]?.textContent?.trim().replace(/,/g, '') || '0';
          
          subscriptions.push({
            serialNumber,
            category,
            offered: parseFloat(offered) || 0,
            applied: parseFloat(applied) || 0,
            times: parseFloat(times) || 0
          });
        } else if (hasLotQty) {
          const lots = cells[1]?.textContent?.trim().replace(/,/g, '') || '0';
          const qty = cells[2]?.textContent?.trim().replace(/,/g, '') || '0';
          const amount = cells[3]?.textContent?.trim().replace(/,/g, '') || '0';
          const reserved = cells[4]?.textContent?.trim().replace(/,/g, '') || '0';
          
          lotDistributions.push({
            category: cells[0]?.textContent?.trim() || '',
            lots: parseInt(lots) || 0,
            qty: parseInt(qty) || 0,
            amount: parseFloat(amount) || 0,
            reserved: parseInt(reserved) || 0
          });
        } else if (hasReservedApplied) {
          const reserved = cells[1]?.textContent?.trim().replace(/,/g, '').replace(/-/g, '0') || '0';
          const applied = cells[2]?.textContent?.trim().replace(/,/g, '').replace(/-/g, '0') || '0';
          const times = cells[3]?.textContent?.trim().replace(/,/g, '').replace(/-/g, '0') || '0';
          
          applicationBreakups.push({
            category,
            reserved: parseInt(reserved) || 0,
            applied: parseInt(applied) || 0,
            times: parseFloat(times) || 0
          });
        }
      });
      
      if (hasOfferedApplied && subscriptions.length > 0) {
        foundSubscriptionTable = true;
      }
    });

    return { 
      issueInfo,
      lastUpdated,
      subscriptions, 
      lotDistributions,
      applicationBreakups
    };
  });

  await browser.close();
  console.log("Browser closed");

  const mergedData = {
    ...bidDetailsData,
    issueInfo: issueInfoData
  };

  console.log(`Found ${Object.keys(mergedData.issueInfo).length} issue info fields`);
  console.log(`Found ${mergedData.subscriptions.length} subscription entries`);
  console.log(`Found ${mergedData.lotDistributions.length} lot distribution entries`);
  console.log(`Found ${mergedData.applicationBreakups.length} application breakup entries`);

  return { symbol, ...mergedData };
}

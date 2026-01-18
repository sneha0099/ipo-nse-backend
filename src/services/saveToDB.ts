import prisma from "../db";

export async function saveIPO(data: any) {
  console.log("Saving IPO data...");

  if (data.issueInfo && Object.keys(data.issueInfo).length > 0) {
    await prisma.ipoDetails.upsert({
      where: { symbol: data.symbol },
      update: {
        issueSize: data.issueInfo['Issue Size'] || null,
        issuePeriod: data.issueInfo['Issue Period'] || null,
        issueType: data.issueInfo['Issue Type'] || null,
        priceRange: data.issueInfo['Price Range'] || null,
        faceValue: data.issueInfo['Face Value'] || null,
        discount: data.issueInfo['Discount'] || null,
        cutOffTime: data.issueInfo['Cut-off time for UPI Mandate Confirmation'] || null,
        minInvestment: data.issueInfo['Minimum Investment'] || null,
        lastUpdated: data.lastUpdated ? new Date(data.lastUpdated) : null,
      },
      create: {
        symbol: data.symbol,
        issueSize: data.issueInfo['Issue Size'] || null,
        issuePeriod: data.issueInfo['Issue Period'] || null,
        issueType: data.issueInfo['Issue Type'] || null,
        priceRange: data.issueInfo['Price Range'] || null,
        faceValue: data.issueInfo['Face Value'] || null,
        discount: data.issueInfo['Discount'] || null,
        cutOffTime: data.issueInfo['Cut-off time for UPI Mandate Confirmation'] || null,
        minInvestment: data.issueInfo['Minimum Investment'] || null,
        lastUpdated: data.lastUpdated ? new Date(data.lastUpdated) : null,
      },
    });
    console.log(`✅ Saved IPO details for ${data.symbol}`);
  }

  if (data.subscriptions && data.subscriptions.length > 0) {
    for (const sub of data.subscriptions) {
      await prisma.ipoSubscription.create({
        data: {
          symbol: data.symbol,
          serialNumber: sub.serialNumber || null,
          category: sub.category,
          offered: sub.offered,
          applied: sub.applied,
          times: sub.times,
        },
      });
    }
    console.log(`✅ Saved ${data.subscriptions.length} subscription entries`);
  } else {
    console.warn("⚠️  No subscription data found to save");
  }

}

import { scrapeIPO } from "./scrapeIpo";
import { saveIPO } from "../services/saveToDB";

(async () => {
  try {
    console.log("Starting IPO scraper for BHARATCOAL...");
    
    const data = await scrapeIPO("BHARATCOAL");
    console.log("Scraped data:", JSON.stringify(data, null, 2));
    
    console.log("Saving to database...");
    await saveIPO(data);
    console.log("✅ IPO data saved successfully");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
})();

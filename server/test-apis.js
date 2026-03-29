// Test script for CLIST and Devpost APIs
import { fetchClist } from "./src/services/clist.js";
import { fetchDevpostEvents } from "./src/services/devpost.service.js";
import { fetchMLHEvents } from "./src/services/mlhService.js";

console.log("🧪 Testing Event Source APIs...\n");

async function testAPIs() {
    // Test CLIST
    console.log("1️⃣ Testing CLIST API...");
    try {
        const clistEvents = await fetchClist();
        console.log(`✅ CLIST: ${clistEvents.length} events fetched`);
        if (clistEvents.length > 0) {
            console.log(`   Sample: ${clistEvents[0].title}`);
            console.log(`   Platform: ${clistEvents[0].platform}`);
            console.log(`   Source: ${clistEvents[0].source}`);
        }
    } catch (err) {
        console.error(`❌ CLIST failed: ${err.message}`);
    }

    console.log("\n2️⃣ Testing Devpost API...");
    try {
        const devpostEvents = await fetchDevpostEvents();
        console.log(`✅ Devpost: ${devpostEvents.length} events fetched`);
        if (devpostEvents.length > 0) {
            console.log(`   Sample: ${devpostEvents[0].title}`);
            console.log(`   Platform: ${devpostEvents[0].platform}`);
            console.log(`   Source: ${devpostEvents[0].source}`);
        }
    } catch (err) {
        console.error(`❌ Devpost failed: ${err.message}`);
    }

    console.log("\n3️⃣ Testing MLH API...");
    try {
        const mlhEvents = await fetchMLHEvents();
        console.log(`✅ MLH: ${mlhEvents.length} events fetched`);
        if (mlhEvents.length > 0) {
            console.log(`   Sample: ${mlhEvents[0].name || mlhEvents[0].title}`);
        }
    } catch (err) {
        console.error(`❌ MLH failed: ${err.message}`);
    }

    console.log("\n✅ API Test Complete!");
    process.exit(0);
}

testAPIs().catch(err => {
    console.error("❌ Test failed:", err);
    process.exit(1);
});

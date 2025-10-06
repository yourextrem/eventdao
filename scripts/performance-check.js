const { performance } = require('perf_hooks');

async function checkPerformance() {
  console.log("🚀 EventDAO Performance Check");
  console.log("=============================");
  
  const startTime = performance.now();
  
  try {
    // Test server response time
    const response = await fetch('http://localhost:3000');
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    console.log(`✅ Server Response Time: ${responseTime.toFixed(2)}ms`);
    
    if (responseTime < 1000) {
      console.log("🟢 Excellent performance!");
    } else if (responseTime < 3000) {
      console.log("🟡 Good performance");
    } else {
      console.log("🔴 Slow performance - needs optimization");
    }
    
    // Check if page loads without errors
    const html = await response.text();
    if (html.includes('EventDAO')) {
      console.log("✅ Page loads correctly");
    } else {
      console.log("❌ Page content issue");
    }
    
    console.log("\n📊 Performance Tips:");
    console.log("1. Use browser dev tools to check network tab");
    console.log("2. Monitor memory usage in task manager");
    console.log("3. Check for JavaScript errors in console");
    console.log("4. Use React DevTools for component performance");
    
  } catch (error) {
    console.error("❌ Performance check failed:", error.message);
  }
}

// Run performance check
checkPerformance();

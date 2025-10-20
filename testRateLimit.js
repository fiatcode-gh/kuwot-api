async function testRateLimit() {
  const url = 'http://localhost:8080/quotes/random';

  console.log('Testing burst limiter (50 requests in 10 seconds)...\n');

  for (let i = 1; i <= 60; i++) {
    try {
      const response = await fetch(url);
      const status = response.status;
      const remaining = response.headers.get('RateLimit-Remaining');
      const limit = response.headers.get('RateLimit-Limit');

      if (status === 429) {
        console.log(`❌ Request ${i}: RATE LIMITED!`);
        const data = await response.text();
        console.log(`   Message: ${data}\n`);
      } else {
        console.log(`✓ Request ${i}: OK (${remaining}/${limit} remaining)`);
      }
    } catch (error) {
      console.log(`❌ Request ${i}: Error - ${error.message}`);
    }

    // Small delay to see output clearly
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

testRateLimit();

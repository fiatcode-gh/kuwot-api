// Stress test script for Kuwot API
// Usage: node testLoad.js

const ENDPOINTS = [
  'http://localhost:8080/quotes/random',
  'http://localhost:8080/translations',
];

// Test configurations
const TESTS = [
  { name: 'Light Load', concurrent: 10, duration: 10 },
  { name: 'Medium Load', concurrent: 50, duration: 10 },
  { name: 'Heavy Load', concurrent: 100, duration: 10 },
  { name: 'Extreme Load', concurrent: 200, duration: 10 },
];

class StressTest {
  constructor(endpoint, concurrent, duration) {
    this.endpoint = endpoint;
    this.concurrent = concurrent;
    this.duration = duration;
    this.results = {
      total: 0,
      success: 0,
      failed: 0,
      rateLimited: 0,
      totalTime: 0,
      responseTimes: [],
    };
  }

  async makeRequest() {
    const start = Date.now();
    try {
      const response = await fetch(this.endpoint);
      const elapsed = Date.now() - start;

      this.results.total++;
      this.results.totalTime += elapsed;
      this.results.responseTimes.push(elapsed);

      if (response.status === 429) {
        this.results.rateLimited++;
      } else if (response.ok) {
        this.results.success++;
      } else {
        this.results.failed++;
      }
    } catch (error) {
      this.results.total++;
      this.results.failed++;
    }
  }

  async runWorker(stopTime) {
    while (Date.now() < stopTime) {
      await this.makeRequest();
    }
  }

  async run() {
    console.log(
      `\n🚀 Starting test: ${this.concurrent} concurrent requests for ${this.duration}s`
    );
    console.log(`   Endpoint: ${this.endpoint}`);

    const startTime = Date.now();
    const stopTime = startTime + this.duration * 1000;

    // Launch concurrent workers
    const workers = [];
    for (let i = 0; i < this.concurrent; i++) {
      workers.push(this.runWorker(stopTime));
    }

    await Promise.all(workers);

    const actualDuration = (Date.now() - startTime) / 1000;
    return this.calculateStats(actualDuration);
  }

  calculateStats(duration) {
    const { total, success, failed, rateLimited, responseTimes } = this.results;

    // Sort response times for percentile calculations
    responseTimes.sort((a, b) => a - b);

    const getPercentile = (p) => {
      const index = Math.ceil((p / 100) * responseTimes.length) - 1;
      return responseTimes[index] || 0;
    };

    return {
      requestsPerSecond: (total / duration).toFixed(2),
      totalRequests: total,
      successful: success,
      failed: failed,
      rateLimited: rateLimited,
      successRate: ((success / total) * 100).toFixed(2) + '%',
      avgResponseTime: (this.results.totalTime / total).toFixed(2) + 'ms',
      minResponseTime: Math.min(...responseTimes) + 'ms',
      maxResponseTime: Math.max(...responseTimes) + 'ms',
      p50: getPercentile(50) + 'ms',
      p95: getPercentile(95) + 'ms',
      p99: getPercentile(99) + 'ms',
    };
  }

  printResults(stats) {
    console.log('\n📊 Results:');
    console.log(`   Requests/sec:     ${stats.requestsPerSecond}`);
    console.log(`   Total requests:   ${stats.totalRequests}`);
    console.log(`   Successful:       ${stats.successful}`);
    console.log(`   Failed:           ${stats.failed}`);
    console.log(`   Rate limited:     ${stats.rateLimited}`);
    console.log(`   Success rate:     ${stats.successRate}`);
    console.log(`\n⏱️  Response Times:`);
    console.log(`   Average:          ${stats.avgResponseTime}`);
    console.log(`   Min:              ${stats.minResponseTime}`);
    console.log(`   Max:              ${stats.maxResponseTime}`);
    console.log(`   50th percentile:  ${stats.p50}`);
    console.log(`   95th percentile:  ${stats.p95}`);
    console.log(`   99th percentile:  ${stats.p99}`);
  }
}

async function runAllTests() {
  console.log('═══════════════════════════════════════════');
  console.log('     API STRESS TEST');
  console.log('═══════════════════════════════════════════');

  const endpoint = ENDPOINTS[0]; // Test random quotes endpoint
  const allResults = [];

  for (const testConfig of TESTS) {
    const test = new StressTest(
      endpoint,
      testConfig.concurrent,
      testConfig.duration
    );

    console.log(`\n\n▶️  ${testConfig.name.toUpperCase()}`);
    const stats = await test.run();
    test.printResults(stats);

    allResults.push({
      name: testConfig.name,
      ...stats,
    });

    // Cool down period between tests
    if (testConfig !== TESTS[TESTS.length - 1]) {
      console.log('\n\n⏳ Cooling down for 5 seconds...');
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  // Print summary
  console.log('\n\n═══════════════════════════════════════════');
  console.log('     SUMMARY');
  console.log('═══════════════════════════════════════════\n');

  console.log('Test Name          | Req/s  | Success Rate | Avg Response');
  console.log('-------------------|--------|--------------|-------------');
  allResults.forEach((result) => {
    const name = result.name.padEnd(18);
    const rps = result.requestsPerSecond.padEnd(6);
    const successRate = result.successRate.padEnd(12);
    const avgTime = result.avgResponseTime.padEnd(12);
    console.log(`${name} | ${rps} | ${successRate} | ${avgTime}`);
  });

  console.log('\n✅ All tests completed!');
}

// Check if endpoint is reachable before starting
async function checkEndpoint() {
  try {
    const response = await fetch(ENDPOINTS[0]);
    if (!response.ok && response.status !== 429) {
      console.error('❌ Server not responding correctly. Is it running?');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Cannot reach server. Please start your server first.');
    console.error(`   URL: ${ENDPOINTS[0]}`);
    process.exit(1);
  }
}

// Run the tests
(async () => {
  await checkEndpoint();
  await runAllTests();
})();

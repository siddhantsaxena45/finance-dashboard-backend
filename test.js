async function runTests() {
  console.log("Starting tests...\n");

  try {
    console.log("0. Admin logs in to get JWT");
    let loginRes = await fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin" })
    });
    let adminAuth = await loginRes.json();
    console.log("Admin token generated.");
    let adminToken = adminAuth.token;

    console.log("0. Analyst logs in to get JWT");
    loginRes = await fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "analyst" })
    });
    let analystAuth = await loginRes.json();
    console.log("Analyst token generated.");
    let analystToken = analystAuth.token;

    console.log("\n1. Admin fetches dashboard summary");
    let res = await fetch("http://localhost:3000/api/dashboard/summary", {
      headers: { "Authorization": `Bearer ${adminToken}` }
    });
    console.log("Status:", res.status);
    console.log(await res.text(), "\n");

    console.log("2. Analyst fetches records with pagination");
    res = await fetch("http://localhost:3000/api/records?limit=2&page=1", {
      headers: { "Authorization": `Bearer ${analystToken}` }
    });
    console.log("Status:", res.status);
    console.log(await res.text(), "\n");

    console.log("3. Viewer tries to fetch users without auth");
    res = await fetch("http://localhost:3000/api/users", {
      headers: { "Authorization": "Bearer fake_token_123" }
    });
    console.log("Status:", res.status);
    console.log(await res.text(), "\n");

    console.log("4. Analyst tries to create record without Admin role");
    res = await fetch("http://localhost:3000/api/records", {
      method: "POST",
      headers: { "Authorization": `Bearer ${analystToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 100, type: "expense", category: "Test" })
    });
    console.log("Status:", res.status);
    console.log(await res.text(), "\n");
    
  } catch(e) {
    console.error("Test Error:", e.message);
  }
}

runTests();

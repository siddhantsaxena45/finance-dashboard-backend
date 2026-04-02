async function runTests() {
  console.log("Starting tests...\n");

  try {
    console.log("1. Admin fetches dashboard summary (Expected 200)");
    let res = await fetch("http://localhost:3000/api/dashboard/summary", {
      headers: { "x-user-id": "1" }
    });
    console.log("Status:", res.status);
    console.log(await res.text(), "\n");

    console.log("2. Analyst fetches records (Expected 200)");
    res = await fetch("http://localhost:3000/api/records", {
      headers: { "x-user-id": "2" }
    });
    console.log("Status:", res.status);
    console.log(await res.text(), "\n");

    console.log("3. Viewer tries to fetch users (Expected 403)");
    res = await fetch("http://localhost:3000/api/users", {
      headers: { "x-user-id": "3" }
    });
    console.log("Status:", res.status);
    console.log(await res.text(), "\n");

    console.log("4. Analyst tries to create record (Expected 403)");
    res = await fetch("http://localhost:3000/api/records", {
      method: "POST",
      headers: { "x-user-id": "2", "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 100, type: "expense", category: "Test" })
    });
    console.log("Status:", res.status);
    console.log(await res.text(), "\n");

    console.log("5. Admin creates record (Expected 201)");
    res = await fetch("http://localhost:3000/api/records", {
      method: "POST",
      headers: { "x-user-id": "1", "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 1000, type: "income", category: "Bonus", notes: "Test" })
    });
    console.log("Status:", res.status);
    console.log(await res.text(), "\n");
    
  } catch(e) {
    console.error("Test Error:", e.message);
  }
}

runTests();

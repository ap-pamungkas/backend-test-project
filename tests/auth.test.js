// tests/auth.test.js

import { request } from "./helpers/request.js";
import { connectDB, disconnectDB, getDB } from "../src/config/db.js";

const authData = {
  name: "Test User",
  email: "test@test.com",
  password: "123456",
};

beforeAll(async () => {
  // connect to DB
  await connectDB();

  // clean up database before each test
  const db = getDB();
  await db.collection("users").deleteMany({ email: authData.email });
});

afterAll(async () => {
  // clean up database after each test
  const db = getDB();
  await db.collection("users").deleteMany({ email: authData.email });
  await disconnectDB();
});

describe("Auth Endpoints", () => {
  it("POST /api/auth/register - Success (201)", async () => {
    const res = await request.post("/api/auth/register").send(authData);

    expect(res.status).toBe(201);

    expect(res.body.email).toBe(authData.email);
    expect(res.body).toHaveProperty("id");
  });

  it("POST /api/auth/register - Conflict (409)", async () => {
    const res = await request.post("/api/auth/register").send(authData);

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Email exists");
  });

  it("POST /api/auth/login - Success (200)", async () => {
    const res = await request.post("/api/auth/login").send({
      email: authData.email,
      password: authData.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(authData.email);
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("POST /api/auth/login - Wrong Password (401)", async () => {
    const res = await request.post("/api/auth/login").send({
      email: authData.email,
      password: "wrong_password",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/invalid credentials/i);
  });

  it("GET /api/auth/me - Unauthorized (401)", async () => {
    const res = await request.get("/api/auth/me");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });

  it("POST /api/auth/logout - Clears cookie (200)", async () => {
    const loginRes = await request.post("/api/auth/login").send(authData);
    const cookie = loginRes.headers["set-cookie"]
      .find((c) => c.startsWith("token="))
      .split(";")[0];
    const res = await request.post("/api/auth/logout").set("Cookie", cookie);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Logged out");
    expect(res.headers["set-cookie"][0]).toMatch(/token=;.*Expires=/i);
  });
});

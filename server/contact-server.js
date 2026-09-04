import http from "node:http";
import net from "node:net";
import tls from "node:tls";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");

await loadEnvFile(path.join(rootDir, ".env"));

const port = Number(process.env.CONTACT_PORT || 8787);
const mailTo = process.env.MAIL_TO || "prathikshajain0007@gmail.com";
const allowedOrigins = new Set(
  (process.env.CONTACT_ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

const server = http.createServer(async (request, response) => {
  try {
    applyCors(request, response);

    if (request.method === "OPTIONS") {
      response.writeHead(204);
      response.end();
      return;
    }

    const requestUrl = new URL(
      request.url || "/",
      `http://${request.headers.host || "127.0.0.1"}`
    );

    if (request.method === "GET" && requestUrl.pathname === "/api/health") {
      sendJson(response, 200, { ok: true });
      return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/contact") {
      await handleContact(request, response);
      return;
    }

    if (request.method === "GET" || request.method === "HEAD") {
      await serveStatic(request, response, requestUrl);
      return;
    }

    sendJson(response, 405, { error: "Method not allowed" });
  } catch (error) {
    const isPublicError = error instanceof PublicError;

    if (!isPublicError) {
      console.error(error);
    }

    if (!response.headersSent) {
      sendJson(response, isPublicError ? error.status : 500, {
        error: isPublicError ? error.message : "Server error",
      });
    } else {
      response.end();
    }
  }
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.log(
      `Contact server is already running at http://127.0.0.1:${port}`
    );
    process.exit(0);
  }

  console.error(error);
  process.exit(1);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Contact server running at http://127.0.0.1:${port}`);
});

async function handleContact(request, response) {
  const body = await readJsonBody(request);
  const name = cleanText(body.name, 90);
  const email = cleanText(body.email, 140);
  const message = cleanText(body.message, 3000);
  const website = cleanText(body.website, 180);

  if (website) {
    sendJson(response, 200, { ok: true });
    return;
  }

  if (!name || !email || !message) {
    sendJson(response, 400, { error: "Please fill all fields" });
    return;
  }

  if (!isValidEmail(email)) {
    sendJson(response, 400, { error: "Please enter a valid email" });
    return;
  }

  assertSmtpConfig();

  await sendSmtpMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    replyTo: email,
    subject: `Portfolio enquiry from ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      "Message:",
      message,
    ].join("\n"),
    to: mailTo,
  });

  sendJson(response, 200, { ok: true });
}

function assertSmtpConfig() {
  const required = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length) {
    console.error(`Missing SMTP config: ${missing.join(", ")}`);
    throw new PublicError(500, "SMTP is not configured yet");
  }
}

class PublicError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function sendSmtpMail({ from, replyTo, subject, text, to }) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);
  const secure = String(process.env.SMTP_SECURE || "").toLowerCase() === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const clientName = process.env.SMTP_CLIENT_NAME || "portfolio.local";

  const smtp = new SmtpConnection({ host, port, secure });

  await smtp.connect();
  await smtp.expect(220);
  await smtp.command(`EHLO ${clientName}`, 250);

  if (!secure && process.env.SMTP_STARTTLS !== "false") {
    await smtp.command("STARTTLS", 220);
    await smtp.upgradeToTls();
    await smtp.command(`EHLO ${clientName}`, 250);
  }

  const auth = Buffer.from(`\u0000${user}\u0000${pass}`).toString("base64");
  await smtp.command(`AUTH PLAIN ${auth}`, 235);
  await smtp.command(`MAIL FROM:<${from}>`, 250);
  await smtp.command(`RCPT TO:<${to}>`, [250, 251]);
  await smtp.command("DATA", 354);
  await smtp.writeData(createMessage({ from, replyTo, subject, text, to }));
  await smtp.expect(250);
  await smtp.command("QUIT", 221).catch(() => {});
  smtp.close();
}

function createMessage({ from, replyTo, subject, text, to }) {
  const messageId = `${Date.now()}.${Math.random().toString(16).slice(2)}@portfolio.local`;
  const headers = [
    `From: ${headerAddress("Portfolio Contact", from)}`,
    `To: ${headerAddress("Prathiksha Jain", to)}`,
    `Reply-To: ${headerAddress("", replyTo)}`,
    `Subject: ${encodedHeader(subject)}`,
    `Message-ID: <${messageId}>`,
    `Date: ${new Date().toUTCString()}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: 8bit",
  ];

  return `${headers.join("\r\n")}\r\n\r\n${text}\r\n`;
}

class SmtpConnection {
  constructor({ host, port, secure }) {
    this.host = host;
    this.port = port;
    this.secure = secure;
    this.buffer = "";
    this.waiters = [];
    this.socket = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      const onError = (error) => reject(error);
      const onConnect = () => {
        this.socket.off("error", onError);
        this.socket.on("error", (error) => this.rejectAll(error));
        this.socket.on("data", (chunk) => this.handleData(chunk));
        resolve();
      };

      this.socket = this.secure
        ? tls.connect({
            host: this.host,
            port: this.port,
            servername: this.host,
          })
        : net.createConnection({
            host: this.host,
            port: this.port,
          });

      this.socket.once("error", onError);
      this.socket.once(this.secure ? "secureConnect" : "connect", onConnect);
    });
  }

  async upgradeToTls() {
    this.socket.removeAllListeners("data");
    this.socket.removeAllListeners("error");

    await new Promise((resolve, reject) => {
      const tlsSocket = tls.connect({
        socket: this.socket,
        servername: this.host,
      });

      tlsSocket.once("secureConnect", resolve);
      tlsSocket.once("error", reject);
      this.socket = tlsSocket;
    });

    this.buffer = "";
    this.socket.on("error", (error) => this.rejectAll(error));
    this.socket.on("data", (chunk) => this.handleData(chunk));
  }

  command(line, expected) {
    this.socket.write(`${line}\r\n`);
    return this.expect(expected);
  }

  writeData(message) {
    const dotSafe = message.replace(/^\./gm, "..");
    this.socket.write(`${dotSafe}\r\n.\r\n`);
  }

  expect(expected) {
    const expectedCodes = Array.isArray(expected) ? expected : [expected];

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("SMTP response timed out"));
      }, 20000);

      this.waiters.push({
        expectedCodes,
        reject,
        resolve: (reply) => {
          clearTimeout(timer);
          resolve(reply);
        },
      });

      this.flushReplies();
    });
  }

  handleData(chunk) {
    this.buffer += chunk.toString("utf8");
    this.flushReplies();
  }

  flushReplies() {
    while (this.waiters.length) {
      const reply = this.readReply();

      if (!reply) return;

      const waiter = this.waiters.shift();

      if (waiter.expectedCodes.includes(reply.code)) {
        waiter.resolve(reply);
      } else {
        waiter.reject(
          new Error(`SMTP ${reply.code}: ${reply.lines.join(" ")}`)
        );
      }
    }
  }

  readReply() {
    const lineEnd = this.buffer.indexOf("\r\n");

    if (lineEnd === -1) return null;

    const lines = [];
    let offset = 0;
    let code = null;

    while (true) {
      const end = this.buffer.indexOf("\r\n", offset);

      if (end === -1) return null;

      const line = this.buffer.slice(offset, end);
      const match = line.match(/^(\d{3})([\s-])(.*)$/);

      if (!match) {
        this.buffer = this.buffer.slice(end + 2);
        return { code: 0, lines: [line] };
      }

      code = Number(match[1]);
      lines.push(match[3]);
      offset = end + 2;

      if (match[2] === " ") {
        this.buffer = this.buffer.slice(offset);
        return { code, lines };
      }
    }
  }

  close() {
    this.socket?.end();
  }

  rejectAll(error) {
    for (const waiter of this.waiters.splice(0)) {
      waiter.reject(error);
    }
  }
}

async function serveStatic(request, response, requestUrl) {
  const normalizedPath =
    requestUrl.pathname === "/portfolio_new/"
      ? "/portfolio_new/index.html"
      : requestUrl.pathname;

  const withoutBase = normalizedPath.startsWith("/portfolio_new/")
    ? normalizedPath.slice("/portfolio_new/".length)
    : normalizedPath.slice(1);

  const relativePath = withoutBase || "index.html";
  const safePath = path.normalize(relativePath).replace(/^(\.\.[/\\])+/, "");
  let filePath = path.join(distDir, safePath);

  try {
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }
  } catch {
    filePath = path.join(distDir, "index.html");
  }

  try {
    const data = await fs.readFile(filePath);
    const type = mimeTypes[path.extname(filePath)] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": type });

    if (request.method !== "HEAD") {
      response.end(data);
    } else {
      response.end();
    }
  } catch {
    sendJson(response, 404, { error: "Not found" });
  }
}

function applyCors(request, response) {
  const origin = request.headers.origin;

  if (
    origin &&
    (!allowedOrigins.size || allowedOrigins.has(origin))
  ) {
    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Vary", "Origin");
  }

  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function sendJson(response, status, data) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(data));
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;

      if (body.length > 16_384) {
        request.destroy();
        reject(new PublicError(413, "Message is too large"));
      }
    });

    request.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new PublicError(400, "Invalid request"));
      }
    });

    request.on("error", reject);
  });
}

async function loadEnvFile(filePath) {
  try {
    const contents = await fs.readFile(filePath, "utf8");

    for (const rawLine of contents.split(/\r?\n/)) {
      const line = rawLine.trim();

      if (!line || line.startsWith("#")) continue;

      const index = line.indexOf("=");

      if (index === -1) continue;

      const key = line.slice(0, index).trim();
      let value = line.slice(index + 1).trim();

      if (
        (value.startsWith("\"") && value.endsWith("\"")) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // No local .env yet.
  }
}

function cleanText(value, maxLength) {
  return String(value || "")
    .replace(/\r/g, "")
    .trim()
    .slice(0, maxLength);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function encodedHeader(value) {
  const safe = String(value || "").replace(/[\r\n]+/g, " ").trim();

  if (/^[\x20-\x7e]*$/.test(safe)) return safe;

  return `=?UTF-8?B?${Buffer.from(safe).toString("base64")}?=`;
}

function headerAddress(name, email) {
  const safeEmail = String(email || "").replace(/[<>\r\n]/g, "").trim();
  const safeName = String(name || "").replace(/["\r\n]/g, "").trim();

  if (!safeName) return `<${safeEmail}>`;

  return `"${safeName}" <${safeEmail}>`;
}

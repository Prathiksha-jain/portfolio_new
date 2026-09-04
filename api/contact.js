import net from "node:net";
import tls from "node:tls";

const DEFAULT_MAIL_TO = "prathikshajain0007@gmail.com";

export default {
  async fetch(request) {
    try {
      if (request.method === "OPTIONS") {
        return json({}, 204);
      }

      if (request.method !== "POST") {
        return json({ error: "Method not allowed" }, 405);
      }

      const body = await readBody(request);
      const name = cleanText(body.name, 90);
      const email = cleanText(body.email, 140);
      const message = cleanText(body.message, 3000);
      const website = cleanText(body.website, 180);

      if (website) {
        return json({ ok: true });
      }

      if (!name || !email || !message) {
        return json({ error: "Please fill all fields" }, 400);
      }

      if (!isValidEmail(email)) {
        return json({ error: "Please enter a valid email" }, 400);
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
        to: process.env.MAIL_TO || DEFAULT_MAIL_TO,
      });

      return json({ ok: true });
    } catch (error) {
      const isPublicError = error instanceof PublicError;

      if (!isPublicError) {
        console.error(error);
      }

      return json(
        { error: isPublicError ? error.message : "Server error" },
        isPublicError ? error.status : 500
      );
    }
  },
};

async function readBody(request) {
  const rawBody = await request.text();

  if (rawBody.length > 16_384) {
    throw new PublicError(413, "Message is too large");
  }

  try {
    return JSON.parse(rawBody || "{}");
  } catch {
    throw new PublicError(400, "Invalid request");
  }
}

function assertSmtpConfig() {
  const required = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length) {
    console.error(`Missing SMTP config: ${missing.join(", ")}`);
    throw new PublicError(500, "SMTP is not configured yet");
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
  const messageId = `${Date.now()}.${Math.random()
    .toString(16)
    .slice(2)}@portfolio.local`;

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
    return new Promise((resolve, reject) => {
      const dotSafe = message.replace(/^\./gm, "..");

      this.socket.write(`${dotSafe}\r\n.\r\n`, (error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
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

class PublicError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
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

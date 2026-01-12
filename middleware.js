const AUTH_REQUIRED_RESPONSE = new Response("Authentication required.", {
  status: 401,
  headers: {
    "WWW-Authenticate": 'Basic realm="Secure Area"',
  },
});

const AUTH_NOT_CONFIGURED_RESPONSE = new Response(
  "Basic auth is enabled but BASIC_AUTH_USER or BASIC_AUTH_PASS is missing.",
  {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  },
);

const parseBasicAuth = (header) => {
  if (!header || !header.startsWith("Basic ")) {
    return null;
  }

  const decoded = atob(header.replace("Basic ", ""));
  const separatorIndex = decoded.indexOf(":");

  if (separatorIndex === -1) {
    return null;
  }

  return {
    username: decoded.slice(0, separatorIndex),
    password: decoded.slice(separatorIndex + 1),
  };
};

export const config = {
  matcher: "/:path*",
};

export default function middleware(request) {
  const isPreview = process.env.VERCEL_ENV === "preview";
  const isEnabled =
    process.env.BASIC_AUTH_ENABLED?.toLowerCase() === "true" || isPreview;

  if (!isEnabled) {
    return;
  }

  const expectedUsername = process.env.BASIC_AUTH_USER;
  const expectedPassword = process.env.BASIC_AUTH_PASS;

  if (!expectedUsername || !expectedPassword) {
    return AUTH_NOT_CONFIGURED_RESPONSE;
  }

  const credentials = parseBasicAuth(request.headers.get("authorization"));

  if (
    !credentials ||
    credentials.username !== expectedUsername ||
    credentials.password !== expectedPassword
  ) {
    return AUTH_REQUIRED_RESPONSE;
  }
}

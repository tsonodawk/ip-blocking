import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { blockedIp } from "@lib/rules/ip";
import { NextApiRequest } from "next";
// import getIP from "@lib/get-ip";

const getIP = (request: Request | NextApiRequest) => {
  const xff =
    request instanceof Request
      ? request.headers.get("x-forwarded-for")
      : request.headers["x-forwarded-for"];

  return xff ? (Array.isArray(xff) ? xff[0] : xff.split(",")[0]) : "127.0.0.1";
};

export const config = {
  matcher: ["/blocked", "/am-i-blocked"],
};

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const blockIpList = ["124.215.13.29", , "127.0.0.1"];

  console.log(`URLは：${url}`);
  const reqIp = getIP(req);
  console.log(`IPは：${reqIp}`);

  if (blockIpList.includes(reqIp)) {
    url.pathname = "/blocked";
    return NextResponse.rewrite(url);
  }

  // Rewrite to /blocked if the IP is blocked
  // if (url.pathname === "/am-i-blocked") {
  // if (await blockedIp(req)) {
  //   url.pathname = "/blocked";
  //   return NextResponse.rewrite(url);
  // }
  //   return;
  // }

  // Trying to access the /blocked page manually is disallowed
  if (url.pathname === "/blocked") {
    url.pathname = `/404`;
    return NextResponse.rewrite(url);
  }
}

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { blockedIp } from "@lib/rules/ip";
import getIP from "@lib/get-ip";

export const config = {
  matcher: ["/blocked", "/am-i-blocked"],
};

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const blockIpList = ["153.127.197.219"];

  console.log(`URLは：${url}`);
  const reqIp = getIP(req);
  console.log(`IPは：${url}`);

  if (blockIpList.includes(reqIp)) {
    url.pathname = "/blocked";
    return NextResponse.rewrite(url);
  }

  // Rewrite to /blocked if the IP is blocked
  if (url.pathname === "/am-i-blocked") {
    if (await blockedIp(req)) {
      url.pathname = "/blocked";
      return NextResponse.rewrite(url);
    }
    return;
  }

  // Trying to access the /blocked page manually is disallowed
  if (url.pathname === "/blocked") {
    url.pathname = `/404`;
    return NextResponse.rewrite(url);
  }
}

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute=createRouteMatcher([
  "/dashboard(.*)",
  "/groups(.*)",
  "/contacts(.*)",
  "/settlements(.*)",
  "/persons(.*)",
  "/expenses(.*)",
]);

export default clerkMiddleware(async(auth,req)=>{
  const {userId}=await auth();
  if(!userId && isProtectedRoute(req)){
    const {redirectToSignIn}=await auth();
    return redirectToSignIn();
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match all routes except static files, images, and api webhooks
    "/((?!_next|.*\\..*|favicon.ico).*)",
  ],
};

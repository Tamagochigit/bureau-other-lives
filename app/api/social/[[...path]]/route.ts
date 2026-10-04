import { env } from 'cloudflare:workers';
import { handleSocialRequest } from '../../../../server/social.mjs';
export const dynamic = 'force-dynamic';
export function GET(request: Request) { return handleSocialRequest(request, env); }
export function POST(request: Request) { return handleSocialRequest(request, env); }

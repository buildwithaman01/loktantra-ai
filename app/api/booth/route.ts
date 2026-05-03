import { NextRequest, NextResponse } from "next/server";
import { BoothInputSchema } from "@/lib/schemas";
import { rateLimit } from "@/lib/rateLimiter";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(`booth-${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = BoothInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid PIN code" }, { status: 400 });
  }

  const { pinCode } = parsed.data;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Maps service unavailable" }, { status: 503 });
  }

  try {
    // Use Places API text search to find government schools (common polling venues)
    const query = encodeURIComponent(`government school near ${pinCode} India`);
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json() as {
      results: Array<{ name: string; geometry: { location: { lat: number; lng: number } }; formatted_address: string }>;
    };

    const booths = data.results.slice(0, 3).map((place) => ({
      name: place.name,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      address: place.formatted_address,
    }));

    return NextResponse.json({ booths });
  } catch (error) {
    console.error("Maps API error:", error);
    return NextResponse.json({ error: "Could not fetch booth locations" }, { status: 500 });
  }
}

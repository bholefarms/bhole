import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const file = await prisma.uploadedFile.findUnique({ where: { id } });
  if (!file) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(file.data, {
    headers: {
      "Content-Type": file.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Length": String(file.data.length),
    },
  });
}

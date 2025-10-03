import { type NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

const SUPPORTED_FORMATS = ["jpeg", "png", "webp", "avif", "gif"] as const;
type SupportedFormat = (typeof SUPPORTED_FORMATS)[number];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const format = formData.get("format") as SupportedFormat;
    const quality =
      Number.parseInt(formData.get("quality") as string, 10) || 80;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!SUPPORTED_FORMATS.includes(format)) {
      return NextResponse.json(
        { error: "Unsupported format" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let sharpInstance = sharp(buffer);

    // Apply format conversion with quality settings
    switch (format) {
      case "jpeg":
        sharpInstance = sharpInstance.jpeg({ quality });
        break;
      case "png":
        sharpInstance = sharpInstance.png({ quality });
        break;
      case "webp":
        sharpInstance = sharpInstance.webp({ quality });
        break;
      case "avif":
        sharpInstance = sharpInstance.avif({ quality });
        break;
      case "gif":
        sharpInstance = sharpInstance.gif();
        break;
      default:
        throw new Error("Unsupported format");
    }

    const outputBuffer = await sharpInstance.toBuffer();

    return new NextResponse(new Uint8Array(outputBuffer), {
      headers: {
        "Content-Type": `image/${format}`,
        "Content-Disposition": `attachment; filename="converted.${format}"`,
      },
    });
  } catch (error) {
    console.error("Image conversion error:", error);
    return NextResponse.json(
      { error: "Failed to convert image" },
      { status: 500 }
    );
  }
}

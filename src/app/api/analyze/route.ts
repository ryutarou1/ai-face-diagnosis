import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "画像が必要です" }, { status: 400 });
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `あなたは顔診断の専門家です。この顔写真を分析して、以下の形式で日本語で診断結果を返してください。

【あなたの顔タイプ】
（動物に例えると何タイプか：犬顔、猫顔、うさぎ顔、きつね顔、たぬき顔、など）

【似ている有名人】
（日本の有名人で似ている人を1-2人挙げてください）

【顔の特徴】
- 目：（特徴を一言で）
- 鼻：（特徴を一言で）
- 口：（特徴を一言で）
- 輪郭：（特徴を一言で）

【第一印象】
（この顔を見た人が抱く第一印象を2-3文で）

【モテ度】
★☆☆☆☆ から ★★★★★ の5段階で

【アドバイス】
（魅力をさらに引き出すためのアドバイスを一言）

楽しく、ポジティブな診断をお願いします！`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "診断中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeFace = async () => {
    if (!image) return;

    setLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });

      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else {
        setResult(data.result);
      }
    } catch (error) {
      alert("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(
      "AI顔診断やってみた！あなたもやってみて👀\n#AI顔診断 #顔診断"
    );
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank"
    );
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">
      <div className="container mx-auto px-4 py-8 max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            AI顔診断
          </h1>
          <p className="text-white/90 text-lg">
            あなたの顔をAIが徹底分析！
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6">
          {!result ? (
            <>
              {/* Upload Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  image
                    ? "border-pink-400 bg-pink-50"
                    : "border-gray-300 hover:border-pink-400 hover:bg-pink-50"
                }`}
              >
                {image ? (
                  <img
                    src={image}
                    alt="Uploaded"
                    className="max-h-64 mx-auto rounded-xl"
                  />
                ) : (
                  <div className="text-gray-500">
                    <div className="text-5xl mb-4">📸</div>
                    <p className="text-lg font-medium">
                      タップして顔写真を選択
                    </p>
                    <p className="text-sm mt-2 text-gray-400">
                      正面から撮った写真がおすすめ
                    </p>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Analyze Button */}
              {image && (
                <button
                  onClick={analyzeFace}
                  disabled={loading}
                  className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-2xl text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      診断中...
                    </span>
                  ) : (
                    "🔮 診断する"
                  )}
                </button>
              )}
            </>
          ) : (
            <>
              {/* Result */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                  診断結果
                </h2>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5">
                  <pre className="whitespace-pre-wrap text-gray-700 font-sans text-sm leading-relaxed">
                    {result}
                  </pre>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={shareToTwitter}
                  className="w-full bg-black text-white font-bold py-4 px-6 rounded-2xl text-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  結果をシェア
                </button>
                <button
                  onClick={reset}
                  className="w-full bg-gray-100 text-gray-700 font-bold py-4 px-6 rounded-2xl text-lg hover:bg-gray-200 transition-colors"
                >
                  もう一度診断する
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-white/70 text-sm">
          ※ 診断結果はAIによる予測です。お楽しみください！
        </p>
      </div>
    </main>
  );
}

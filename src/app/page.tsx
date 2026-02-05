"use client";

import { useState, useRef, useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("分析中");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ローディングテキストアニメーション
  useEffect(() => {
    if (!loading) return;
    const texts = [
      "顔面スキャン中",
      "容赦なく分析中",
      "厳しめに採点中",
      "ダメ出し生成中",
      "現実を突きつけ中",
    ];
    let i = 0;
    const interval = setInterval(() => {
      setLoadingText(texts[i % texts.length]);
      i++;
    }, 800);
    return () => clearInterval(interval);
  }, [loading]);

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

  // ガチ辛口診断結果（基本40以下、MAX60、100は神）
  const diagnosisResults = [
    {
      score: 12,
      grade: "F",
      verdict: "壊滅的",
      roasts: [
        "正直に言う。これはヤバい。",
        "マッチングアプリじゃなくて、お化け屋敷の応募写真？",
        "右スワイプしてくれる人、多分間違えてタップしただけ。",
      ],
      details: [
        { category: "表情", score: -25, comment: "葬式？笑って。頼むから。" },
        { category: "照明", score: -20, comment: "洞窟で撮った？暗すぎて顔見えない" },
        { category: "背景", score: -18, comment: "散らかった部屋晒すな。片付けろ。" },
        { category: "角度", score: -15, comment: "下からのアングル、あご3つに見える" },
        { category: "服装", score: -10, comment: "そのヨレヨレTシャツ捨てろ" },
      ],
      advice: "悪いこと言わないから、友達に撮ってもらえ。自撮りはお前には早い。",
      matchRate: "2%",
    },
    {
      score: 23,
      grade: "F",
      verdict: "厳しい",
      roasts: [
        "うーん...これでマッチしようとしてるの？",
        "「会いたい」より「大丈夫？」って心配されるタイプの写真。",
        "努力は認めるけど、方向性が完全に間違ってる。",
      ],
      details: [
        { category: "表情", score: -20, comment: "作り笑いが不気味。自然に笑え。" },
        { category: "照明", score: -15, comment: "蛍光灯の下で撮るな。顔色最悪。" },
        { category: "背景", score: -12, comment: "トイレで自撮りはナシ。絶対ナシ。" },
        { category: "構図", score: -15, comment: "顔アップすぎ。圧が強くて怖い。" },
        { category: "加工", score: -15, comment: "加工しすぎ。誰？ってなる。" },
      ],
      advice: "まず場所を変えろ。カフェか公園。話はそれからだ。",
      matchRate: "5%",
    },
    {
      score: 31,
      grade: "E",
      verdict: "微妙",
      roasts: [
        "可もなく不可もなく...いや、不可寄りかな。",
        "100人中99人が「次」ってスワイプするやつ。",
        "印象？「特になし」が正直な感想。",
      ],
      details: [
        { category: "表情", score: -18, comment: "眉間にシワ寄ってる。リラックスしろ。" },
        { category: "照明", score: -12, comment: "影が顔の半分覆ってる。怪しすぎ。" },
        { category: "背景", score: -10, comment: "白い壁。つまらな。ストーリーがない。" },
        { category: "目線", score: -12, comment: "どこ見てんの？カメラ見ろ。" },
        { category: "服装", score: -7, comment: "無難すぎ。個性がない。" },
      ],
      advice: "とりあえず笑え。話はそれから。真顔禁止。",
      matchRate: "8%",
    },
    {
      score: 38,
      grade: "D",
      verdict: "イマイチ",
      roasts: [
        "惜しい...と言いたいけど、まだ遠い。",
        "「悪くはない」は褒め言葉じゃないからな？",
        "平均以下。厳しいけど、これが現実。",
      ],
      details: [
        { category: "表情", score: -15, comment: "笑顔が固い。緊張しすぎ。" },
        { category: "照明", score: -10, comment: "もう少し明るく。顔がくすんで見える。" },
        { category: "背景", score: -12, comment: "生活感出すぎ。洗濯物映ってない？" },
        { category: "姿勢", score: -10, comment: "猫背。自信なさそう。" },
        { category: "オーラ", score: -15, comment: "必死感出てる。余裕持て。" },
      ],
      advice: "自然体で撮れ。ガチガチになりすぎ。深呼吸してから撮り直せ。",
      matchRate: "12%",
    },
    {
      score: 45,
      grade: "D",
      verdict: "普通以下",
      roasts: [
        "うーん、「普通」には届いてない。",
        "埋もれる。完全に埋もれる。",
        "個性がない。量産型。",
      ],
      details: [
        { category: "表情", score: -12, comment: "笑顔はあるけど目が死んでる。" },
        { category: "照明", score: -8, comment: "悪くないけど、もう一工夫。" },
        { category: "背景", score: -10, comment: "無難すぎて記憶に残らない。" },
        { category: "構図", score: -10, comment: "証明写真かよ。動きがない。" },
        { category: "服装", score: -15, comment: "地味。色を入れろ。" },
      ],
      advice: "趣味してる時に撮れ。そっちの方が100倍マシになる。",
      matchRate: "15%",
    },
    {
      score: 52,
      grade: "C",
      verdict: "平均的",
      roasts: [
        "まあ、見れなくはない。",
        "「いいね」するかは...うーん、気分次第。",
        "印象には残らないけど、不快ではない。",
      ],
      details: [
        { category: "表情", score: -10, comment: "悪くない。でも「良い」でもない。" },
        { category: "照明", score: -8, comment: "改善の余地あり。" },
        { category: "背景", score: -8, comment: "もう少し工夫を。" },
        { category: "構図", score: -10, comment: "定番すぎ。差別化できてない。" },
        { category: "オーラ", score: -12, comment: "自信持て。もっと堂々と。" },
      ],
      advice: "ロケーション変えるだけで+10点はいける。カフェか公園で撮り直せ。",
      matchRate: "22%",
    },
    {
      score: 58,
      grade: "C+",
      verdict: "まあまあ",
      roasts: [
        "お、なかなかいいじゃん...と言いかけた。",
        "平均は超えた。でもそれだけ。",
        "上位30%には入れそう。惜しい。",
      ],
      details: [
        { category: "表情", score: -8, comment: "笑顔いいね。でもちょっと緊張してる。" },
        { category: "照明", score: -6, comment: "もう少し工夫すれば完璧。" },
        { category: "背景", score: -8, comment: "ストーリーがほしい。" },
        { category: "構図", score: -10, comment: "上半身入れると雰囲気出る。" },
        { category: "服装", score: -10, comment: "もう少し攻めてもいい。" },
      ],
      advice: "趣味の写真を追加しろ。会話のきっかけになる。",
      matchRate: "30%",
    },
    // 超レア：神レベル
    {
      score: 100,
      grade: "神",
      verdict: "完璧",
      roasts: [
        "...は？",
        "お前、プロ？",
        "これ本当にマッチングアプリ用？モデルの撮影？",
      ],
      details: [
        { category: "表情", score: 0, comment: "文句なし。完璧な笑顔。" },
        { category: "照明", score: 0, comment: "プロかよ。完璧。" },
        { category: "背景", score: 0, comment: "映画のワンシーンかな？" },
        { category: "構図", score: 0, comment: "黄金比。計算し尽くされてる。" },
        { category: "オーラ", score: 0, comment: "自信とリラックスの完璧なバランス。" },
      ],
      advice: "アドバイス？ない。俺が教えてほしい。",
      matchRate: "95%",
    },
  ];

  const analyzeFace = async () => {
    if (!image) return;

    setLoading(true);

    // 擬似的な待機（診断してる感を出す）
    await new Promise(resolve => setTimeout(resolve, 2500));

    // 重み付けランダム選択（低スコアが出やすい）
    const weights = [15, 20, 20, 18, 12, 8, 5, 2]; // 最後が神（2%）
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    let selectedIndex = 0;

    for (let i = 0; i < weights.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        selectedIndex = i;
        break;
      }
    }

    const selectedResult = diagnosisResults[selectedIndex];
    setResult(selectedResult);
    trackEvent("diagnosis_complete", { mode: "demo", score: selectedResult.score });
    setLoading(false);
  };

  const shareToTwitter = () => {
    trackEvent("share_twitter");
    const text = encodeURIComponent(
      `マッチングアプリ写真を辛口診断したら\n\n💀 ${result.score}点（${result.verdict}）\n\nだった...\n\n#マッチングアプリ写真診断 #辛口診断`
    );
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getScoreColor = (s: number) => {
    if (s >= 90) return "text-yellow-400";
    if (s >= 55) return "text-green-400";
    if (s >= 40) return "text-yellow-500";
    if (s >= 25) return "text-orange-500";
    return "text-red-500";
  };

  const getGradeColor = (s: number) => {
    if (s >= 90) return "from-yellow-400 to-yellow-600";
    if (s >= 55) return "from-green-400 to-green-600";
    if (s >= 40) return "from-yellow-500 to-orange-500";
    if (s >= 25) return "from-orange-500 to-red-500";
    return "from-red-500 to-red-700";
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Noise overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative container mx-auto px-4 py-8 max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <span className="text-xs font-mono bg-red-500/20 text-red-400 px-3 py-1 rounded-full border border-red-500/30">
              NO MERCY MODE
            </span>
          </div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">
            <span className="bg-gradient-to-r from-red-500 via-pink-500 to-red-500 bg-clip-text text-transparent
                           bg-[length:200%_200%] animate-pulse">
              辛口診断
            </span>
          </h1>
          <p className="text-zinc-500 text-sm font-mono">
            YOUR DATING PHOTO IS PROBABLY MID
          </p>
        </div>

        {/* Main Card */}
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 via-pink-500/20 to-red-500/20 rounded-2xl blur-xl" />

          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            {!result ? (
              <>
                {/* Upload Area */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                    transition-all duration-300
                    ${image
                      ? "border-red-500/50 bg-red-500/5"
                      : "border-zinc-700 hover:border-red-500/50 hover:bg-zinc-800/50"
                    }
                  `}
                >
                  {image ? (
                    <div className="relative">
                      <img
                        src={image}
                        alt="Uploaded"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent rounded-lg" />
                      <p className="absolute bottom-2 left-0 right-0 text-xs text-zinc-400 font-mono">
                        READY TO BE DESTROYED
                      </p>
                    </div>
                  ) : (
                    <div className="text-zinc-500">
                      <div className="text-6xl mb-4">💀</div>
                      <p className="text-lg font-bold text-zinc-300">
                        写真をアップロード
                      </p>
                      <p className="text-xs mt-2 text-zinc-600 font-mono">
                        覚悟はできてる？
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
                    className={`
                      w-full mt-6 py-4 px-6 rounded-xl font-bold text-lg
                      transition-all duration-300
                      ${loading
                        ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-[1.02]"
                      }
                    `}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-3">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span className="font-mono">{loadingText}...</span>
                      </span>
                    ) : (
                      <>🔥 容赦なく診断する</>
                    )}
                  </button>
                )}
              </>
            ) : (
              <>
                {/* Score Display */}
                <div className="text-center mb-6">
                  <div className={`
                    inline-block px-4 py-1 rounded-full text-sm font-mono mb-4
                    bg-gradient-to-r ${getGradeColor(result.score)}
                  `}>
                    {result.grade}ランク
                  </div>
                  <div className={`text-7xl font-black ${getScoreColor(result.score)} mb-2`}>
                    {result.score}
                    <span className="text-2xl text-zinc-600">/100</span>
                  </div>
                  <p className="text-xl font-bold text-zinc-400">{result.verdict}</p>
                  <p className="text-sm font-mono text-zinc-600 mt-2">
                    推定マッチ率: {result.matchRate}
                  </p>
                </div>

                {/* Pyramid - あなたの位置 */}
                <div className="mb-6 p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/50">
                  <p className="text-xs font-mono text-zinc-500 mb-4 text-center">📍 YOUR POSITION</p>
                  <div className="flex flex-col items-center gap-1">
                    {/* 神 - 100点 */}
                    <div className={`
                      relative w-12 h-6 flex items-center justify-center text-xs font-mono rounded-t-lg
                      ${result.score >= 100
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold animate-pulse'
                        : 'bg-zinc-800 text-zinc-600'}
                    `}>
                      {result.score >= 100 && <span className="absolute -left-6">👑</span>}
                      神
                      <span className="absolute -right-8 text-[10px] text-zinc-500">2%</span>
                    </div>
                    {/* S - 90点 */}
                    <div className={`
                      w-20 h-6 flex items-center justify-center text-xs font-mono
                      ${result.score >= 90 && result.score < 100
                        ? 'bg-gradient-to-r from-purple-400 to-purple-600 text-white font-bold'
                        : 'bg-zinc-800 text-zinc-600'}
                    `}>
                      S
                    </div>
                    {/* A - 70点 */}
                    <div className={`
                      w-28 h-6 flex items-center justify-center text-xs font-mono
                      ${result.score >= 70 && result.score < 90
                        ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold'
                        : 'bg-zinc-800 text-zinc-600'}
                    `}>
                      A
                    </div>
                    {/* B - 55点 */}
                    <div className={`
                      w-36 h-6 flex items-center justify-center text-xs font-mono
                      ${result.score >= 55 && result.score < 70
                        ? 'bg-gradient-to-r from-green-400 to-green-600 text-white font-bold'
                        : 'bg-zinc-800 text-zinc-600'}
                    `}>
                      B
                    </div>
                    {/* C - 45点 */}
                    <div className={`
                      relative w-44 h-6 flex items-center justify-center text-xs font-mono
                      ${result.score >= 45 && result.score < 55
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold'
                        : 'bg-zinc-800 text-zinc-600'}
                    `}>
                      C
                      {result.score >= 45 && result.score < 55 && <span className="absolute -left-6">👈</span>}
                    </div>
                    {/* D - 30点 */}
                    <div className={`
                      relative w-52 h-6 flex items-center justify-center text-xs font-mono
                      ${result.score >= 30 && result.score < 45
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold'
                        : 'bg-zinc-800 text-zinc-600'}
                    `}>
                      D
                      {result.score >= 30 && result.score < 45 && <span className="absolute -left-6">👈</span>}
                    </div>
                    {/* E - 20点 */}
                    <div className={`
                      relative w-60 h-6 flex items-center justify-center text-xs font-mono
                      ${result.score >= 20 && result.score < 30
                        ? 'bg-gradient-to-r from-red-500 to-red-700 text-white font-bold'
                        : 'bg-zinc-800 text-zinc-600'}
                    `}>
                      E
                      {result.score >= 20 && result.score < 30 && <span className="absolute -left-6">👈</span>}
                    </div>
                    {/* F - 0点 */}
                    <div className={`
                      relative w-[272px] h-6 flex items-center justify-center text-xs font-mono rounded-b-lg
                      ${result.score < 20
                        ? 'bg-gradient-to-r from-red-700 to-red-900 text-white font-bold'
                        : 'bg-zinc-800 text-zinc-600'}
                    `}>
                      F（底辺）
                      {result.score < 20 && <span className="absolute -left-6">💀</span>}
                      <span className="absolute -right-12 text-[10px] text-zinc-500">35%</span>
                    </div>
                  </div>
                  <p className="text-center text-xs text-zinc-600 mt-4 font-mono">
                    {result.score < 30 && "ほとんどの人がここにいる。お前もな。"}
                    {result.score >= 30 && result.score < 45 && "平均以下。まだまだ改善の余地あり。"}
                    {result.score >= 45 && result.score < 55 && "普通。埋もれる位置。"}
                    {result.score >= 55 && result.score < 70 && "まあまあ。上位30%には入れた。"}
                    {result.score >= 70 && result.score < 90 && "いい感じ。上位10%。"}
                    {result.score >= 90 && result.score < 100 && "かなり上位。上位3%。"}
                    {result.score >= 100 && "お前は神か？2%しかいない領域。"}
                  </p>
                </div>

                {/* Roasts */}
                <div className="bg-zinc-800/50 rounded-xl p-4 mb-4 border border-zinc-700/50">
                  <p className="text-xs font-mono text-red-400 mb-3">💀 BRUTAL HONESTY</p>
                  {result.roasts.map((roast: string, i: number) => (
                    <p key={i} className="text-zinc-300 text-sm mb-2 last:mb-0">
                      {roast}
                    </p>
                  ))}
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-mono text-zinc-500 mb-3">📊 BREAKDOWN</p>
                  {result.details.map((detail: any, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-zinc-800/30 rounded-lg p-3 border border-zinc-800">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-zinc-300">{detail.category}</span>
                          <span className={`text-xs font-mono ${detail.score === 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {detail.score === 0 ? '±0' : detail.score}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">{detail.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Advice */}
                <div className="bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 rounded-xl p-4 mb-6 border border-zinc-700/50">
                  <p className="text-xs font-mono text-yellow-500 mb-2">💡 ADVICE</p>
                  <p className="text-zinc-300 text-sm">{result.advice}</p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={shareToTwitter}
                    className="w-full py-4 px-6 rounded-xl font-bold bg-zinc-800 hover:bg-zinc-700
                             border border-zinc-700 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    この恥を晒す
                  </button>
                  <button
                    onClick={reset}
                    className="w-full py-4 px-6 rounded-xl font-bold text-zinc-400
                             hover:text-white hover:bg-zinc-800 transition-all"
                  >
                    もう一度挑戦する
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-zinc-700 text-xs mt-8 font-mono">
          ※ これはエンタメです。でも、参考にした方がいいかも。
        </p>
      </div>
    </main>
  );
}

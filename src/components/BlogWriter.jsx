import { useState } from 'react';

const BLOG_TOPICS = [
  { label: '견종별 보험 가이드', value: '견종별 펫보험 추천 가이드', icon: '🐕' },
  { label: '보험금 청구 방법', value: '펫보험 보험금 청구하는 방법 총정리', icon: '📋' },
  { label: '보험 비교 분석', value: '2026년 펫보험 8개사 비교 분석', icon: '📊' },
  { label: '슬개골 보험', value: '소형견 슬개골 탈구 보험 완벽 가이드', icon: '🦴' },
  { label: '가입 시 주의사항', value: '펫보험 가입 전 반드시 확인할 5가지', icon: '⚠️' },
  { label: '면책기간 안내', value: '펫보험 면책기간이란? 꼭 알아야 할 것들', icon: '📅' },
  { label: '다견 가정 보험', value: '강아지 2마리 이상 키우는 집의 보험 전략', icon: '🐾' },
  { label: '노령견 보험', value: '7세 이상 노령견을 위한 펫보험 가이드', icon: '👴' },
  { label: '고양이 보험', value: '고양이 보험 추천 및 주의사항', icon: '🐱' },
  { label: '자유 주제', value: '', icon: '✏️' },
];

const BLOG_STYLES = [
  { label: '정보성 (가이드)', value: '정보성 가이드 - 꼼꼼하고 체계적인 글' },
  { label: '후기/경험담', value: '경험담 - 25년 상담 경험 기반의 실제 사례 중심 글' },
  { label: '비교 분석', value: '비교 분석 - 표와 수치를 활용한 객관적 비교 글' },
  { label: '팁/꿀팁', value: '꿀팁 - 짧고 실용적인 팁 모음 글' },
];

export default function BlogWriter() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [customTopic, setCustomTopic] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(BLOG_STYLES[0].value);
  const [keywords, setKeywords] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleGenerate = async () => {
    const topic = selectedTopic === '' ? customTopic : selectedTopic;
    if (!topic) {
      alert('주제를 선택하거나 입력해주세요!');
      return;
    }

    setLoading(true);
    setGeneratedContent('');

    try {
      const response = await fetch('/api/blog-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          style: selectedStyle,
          keywords: keywords || undefined
        })
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedContent(data.content);
      } else {
        alert('글 생성에 실패했습니다: ' + (data.error || '알 수 없는 오류'));
      }
    } catch (error) {
      console.error('블로그 글 생성 오류:', error);
      alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드 실패 시 선택 방식
      const textArea = document.createElement('textarea');
      textArea.value = generatedContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) {
    return (
      <section id="blog-writer" className="py-20 bg-gradient-to-b from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            ✍️ 블로그 AI 글쓰기 도우미
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            AI가 네이버 블로그 SEO에 최적화된 펫보험 글을 작성해드립니다
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-bold mb-1">SEO 최적화</h3>
              <p className="text-sm text-gray-500">네이버 검색 상위 노출을 위한 키워드 배치</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-bold mb-1">1분 만에 완성</h3>
              <p className="text-sm text-gray-500">주제 선택하면 AI가 즉시 글 작성</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-3xl mb-2">📋</div>
              <h3 className="font-bold mb-1">복사 후 바로 발행</h3>
              <p className="text-sm text-gray-500">네이버 블로그에 붙여넣기만 하면 끝</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-xl transform hover:scale-105"
          >
            ✍️ 블로그 글 작성 시작하기
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="blog-writer" className="py-20 bg-gradient-to-b from-green-50 to-emerald-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            ✍️ 블로그 AI 글쓰기 도우미
          </h2>
          <p className="text-xl text-gray-600">
            주제를 선택하면 AI가 네이버 블로그 최적화 글을 작성합니다
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* 주제 선택 */}
          <div className="mb-6">
            <label className="block text-lg font-bold text-gray-900 mb-3">
              1. 주제 선택
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {BLOG_TOPICS.map((topic) => (
                <button
                  key={topic.label}
                  onClick={() => setSelectedTopic(topic.value)}
                  className={`p-3 rounded-xl border-2 transition-all text-sm ${
                    selectedTopic === topic.value
                      ? 'border-green-500 bg-green-50 text-green-700 shadow-md'
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                  }`}
                >
                  <div className="text-2xl mb-1">{topic.icon}</div>
                  <div className="font-medium">{topic.label}</div>
                </button>
              ))}
            </div>

            {selectedTopic === '' && (
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="자유 주제를 입력하세요 (예: 비숑 프리제 보험 추천)"
                className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            )}
          </div>

          {/* 스타일 선택 */}
          <div className="mb-6">
            <label className="block text-lg font-bold text-gray-900 mb-3">
              2. 글 스타일
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {BLOG_STYLES.map((style) => (
                <button
                  key={style.label}
                  onClick={() => setSelectedStyle(style.value)}
                  className={`p-3 rounded-xl border-2 transition-all text-sm ${
                    selectedStyle === style.value
                      ? 'border-green-500 bg-green-50 text-green-700 shadow-md'
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                  }`}
                >
                  <div className="font-medium">{style.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 키워드 입력 (선택) */}
          <div className="mb-6">
            <label className="block text-lg font-bold text-gray-900 mb-2">
              3. 추가 키워드 <span className="text-sm font-normal text-gray-500">(선택사항)</span>
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="예: 말티즈, 슬개골, 2026년, 가성비 (쉼표로 구분)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* 생성 버튼 */}
          <button
            onClick={handleGenerate}
            disabled={loading || (!selectedTopic && selectedTopic !== '')}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold text-xl hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                AI가 글을 작성하고 있어요... (약 30초)
              </span>
            ) : (
              '✍️ AI 글 생성하기'
            )}
          </button>

          {/* 생성된 콘텐츠 */}
          {generatedContent && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">생성된 블로그 글</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      copied
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {copied ? '복사 완료!' : '📋 전체 복사'}
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
                  >
                    🔄 다시 생성
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 max-h-[600px] overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans text-gray-800 text-sm leading-relaxed">
                  {generatedContent}
                </pre>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-yellow-800 font-medium text-sm">
                  💡 사용 방법: "전체 복사" 버튼 클릭 → 네이버 블로그 글쓰기에 붙여넣기 → 내용 확인 후 발행
                </p>
                <p className="text-yellow-700 text-sm mt-1">
                  ※ AI가 작성한 초안입니다. 발행 전 내용을 검토하고 본인의 경험을 추가하면 더 좋은 글이 됩니다!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 접기 버튼 */}
        <div className="text-center mt-4">
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ▲ 접기
          </button>
        </div>
      </div>
    </section>
  );
}

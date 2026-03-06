import { useParams, Link, Navigate } from 'react-router-dom';
import blogPosts from '../data/blogPosts';

function renderMarkdown(text) {
  // 간단한 마크다운 → HTML 변환
  const lines = text.split('\n');
  const result = [];
  let inTable = false;
  let tableRows = [];

  const flushTable = () => {
    if (tableRows.length > 0) {
      const headerCells = tableRows[0].split('|').filter(Boolean).map((c) => c.trim());
      const bodyRows = tableRows.slice(2); // skip header + separator
      result.push(
        <div key={`table-${result.length}`} className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-blue-50">
                {headerCells.map((cell, i) => (
                  <th key={i} className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, ri) => {
                const cells = row.split('|').filter(Boolean).map((c) => c.trim());
                return (
                  <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {cells.map((cell, ci) => (
                      <td key={ci} className="border border-gray-200 px-4 py-3 text-gray-600">
                        {cell}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 테이블 감지
    if (line.includes('|') && line.trim().startsWith('|')) {
      inTable = true;
      tableRows.push(line);
      continue;
    } else if (inTable) {
      inTable = false;
      flushTable();
    }

    // 빈 줄
    if (!line.trim()) {
      result.push(<div key={i} className="h-4" />);
      continue;
    }

    // h2
    if (line.startsWith('## ')) {
      result.push(
        <h2 key={i} className="text-2xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-200">
          {line.slice(3)}
        </h2>
      );
      continue;
    }

    // h3
    if (line.startsWith('### ')) {
      result.push(
        <h3 key={i} className="text-xl font-bold text-gray-800 mt-8 mb-3">
          {line.slice(4)}
        </h3>
      );
      continue;
    }

    // 구분선
    if (line.trim() === '---') {
      result.push(<hr key={i} className="my-8 border-gray-200" />);
      continue;
    }

    // 인용
    if (line.startsWith('> ')) {
      result.push(
        <blockquote key={i} className="border-l-4 border-blue-500 bg-blue-50 px-6 py-4 my-6 rounded-r-xl text-gray-700 italic">
          {line.slice(2)}
        </blockquote>
      );
      continue;
    }

    // 리스트 (- 또는 숫자)
    if (line.match(/^(\s*)[-*] /)) {
      const indent = line.match(/^(\s*)/)[1].length;
      const content = line.replace(/^(\s*)[-*] /, '');
      result.push(
        <div key={i} className="flex gap-2 my-1" style={{ paddingLeft: `${indent * 8 + 16}px` }}>
          <span className="text-blue-500 mt-1 shrink-0">•</span>
          <span className="text-gray-700">{formatInline(content)}</span>
        </div>
      );
      continue;
    }

    if (line.match(/^\d+\. /)) {
      const num = line.match(/^(\d+)\./)[1];
      const content = line.replace(/^\d+\.\s*/, '');
      result.push(
        <div key={i} className="flex gap-3 my-2 pl-4">
          <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
            {num}
          </span>
          <span className="text-gray-700">{formatInline(content)}</span>
        </div>
      );
      continue;
    }

    // 일반 텍스트
    result.push(
      <p key={i} className="text-gray-700 leading-relaxed my-2">
        {formatInline(line)}
      </p>
    );
  }

  // 남은 테이블 처리
  if (tableRows.length > 0) flushTable();

  return result;
}

function formatInline(text) {
  // **bold** 처리
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function BlogPost() {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  // 관련 포스트 (같은 카테고리, 최대 3개)
  const related = blogPosts
    .filter((p) => p.id !== post.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold hover:opacity-90 transition">
            🐾 PetCare+
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link to="/" className="hover:underline opacity-80 hover:opacity-100">홈</Link>
            <Link to="/blog" className="hover:underline opacity-80 hover:opacity-100">블로그</Link>
          </nav>
        </div>
      </header>

      {/* 포스트 히어로 */}
      <section className="bg-gradient-to-b from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-3xl mx-auto px-4">
          <Link to="/blog" className="inline-flex items-center text-blue-200 hover:text-white mb-6 transition">
            ← 블로그 목록으로
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">{post.category}</span>
            <span className="text-sm opacity-70">{post.date}</span>
            <span className="text-sm opacity-70">{post.readTime} 읽기</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">{post.title}</h1>
          <p className="mt-4 text-lg opacity-90">{post.excerpt}</p>
          <div className="mt-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-xl">👨‍⚕️</div>
            <div>
              <p className="font-semibold">이희전 상담사</p>
              <p className="text-sm opacity-70">미래에셋금융서비스 | 25년 경력</p>
            </div>
          </div>
        </div>
      </section>

      {/* 포스트 본문 */}
      <article className="max-w-3xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          {renderMarkdown(post.content)}
        </div>

        {/* 태그 */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* 상담 CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">도움이 되셨나요?</h3>
          <p className="text-gray-600 mb-6">전문가 무료 상담으로 더 자세한 안내를 받아보세요</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:010-5650-0670"
              className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition shadow-lg"
            >
              📞 전화 상담
            </a>
            <Link
              to="/#contact"
              className="px-6 py-3 bg-white text-blue-600 rounded-full font-bold hover:bg-gray-50 transition shadow-lg border border-blue-200"
            >
              📋 온라인 상담 신청
            </Link>
          </div>
        </div>
      </article>

      {/* 관련 포스트 */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">다른 글도 읽어보세요</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {related.map((p) => (
              <Link
                key={p.id}
                to={`/blog/${p.id}`}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 group"
              >
                <div className="text-4xl mb-3">{p.thumbnail}</div>
                <span className="text-xs text-blue-600 font-medium">{p.category}</span>
                <h3 className="font-bold text-gray-900 mt-1 line-clamp-2 group-hover:text-blue-600 transition">
                  {p.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2025 PetCare+ | 수인AI브릿지 | 사업자등록번호: 119-13-49535</p>
          <p className="mt-1">이희전 상담사 | 미래에셋금융서비스 | 📞 010-5650-0670</p>
        </div>
      </footer>
    </div>
  );
}

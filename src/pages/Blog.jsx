import { useState } from 'react';
import { Link } from 'react-router-dom';
import blogPosts, { CATEGORIES } from '../data/blogPosts';

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = blogPosts.filter((post) => {
    const matchCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold hover:opacity-90 transition">
            🐾 PetCare+
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link to="/" className="hover:underline opacity-80 hover:opacity-100">홈</Link>
            <Link to="/blog" className="underline font-semibold">블로그</Link>
          </nav>
        </div>
      </header>

      {/* 블로그 히어로 */}
      <section className="bg-gradient-to-b from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">펫보험 블로그</h1>
          <p className="text-xl opacity-90 mb-8">
            25년 경력 전문가가 알려주는 펫보험의 모든 것
          </p>

          {/* 검색 */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="검색어를 입력하세요 (예: 슬개골, 고양이, 청구)"
                className="w-full px-6 py-4 rounded-full text-gray-900 shadow-lg focus:ring-4 focus:ring-blue-300 outline-none text-lg"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
            </div>
          </div>
        </div>
      </section>

      {/* 카테고리 필터 */}
      <div className="max-w-6xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 포스트 목록 */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl">검색 결과가 없습니다</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="mt-4 text-blue-600 hover:underline"
            >
              전체 보기
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 overflow-hidden group"
              >
                {/* 썸네일 */}
                <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                  <span className="text-7xl group-hover:scale-110 transition-transform">
                    {post.thumbnail}
                  </span>
                </div>

                {/* 내용 */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-400">{post.readTime} 읽기</span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-400">{post.date}</span>
                    <span className="text-sm text-blue-600 font-medium group-hover:underline">
                      자세히 보기 →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">전문가 무료 상담</h2>
          <p className="text-lg opacity-90 mb-8">
            글만으로 해결이 안 되시나요? 25년 경력 전문가가 직접 상담해드립니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:010-5650-0670"
              className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-xl"
            >
              📞 010-5650-0670
            </a>
            <Link
              to="/#contact"
              className="px-8 py-4 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition"
            >
              📋 상담 신청하기
            </Link>
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

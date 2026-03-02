import { useState, useEffect, useRef } from 'react';

export default function HospitalFinder() {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchRadius, setSearchRadius] = useState(5000);
  const [filterOpen24, setFilterOpen24] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [googleReady, setGoogleReady] = useState(false);
  const [error, setError] = useState('');

  // ⚡ 성능 최적화: 캐싱 & 중복 검색 방지
  const searchCacheRef = useRef({});
  const lastSearchRef = useRef(null);
  const abortControllerRef = useRef(null);

  // 🧹 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      // 🛑 진행 중인 요청 취소
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // 💾 캐시 초기화 (메모리 누수 방지)
      searchCacheRef.current = {};
    };
  }, []);

  // Google Maps 로드 완료 대기
  useEffect(() => {
    const checkGoogle = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setGoogleReady(true);
      } else {
        setTimeout(checkGoogle, 500);
      }
    };
    checkGoogle();
  }, []);

  const getCurrentLocation = () => {
    if (!googleReady) {
      setError('⚠️ 지도 서비스 로딩 중입니다. 1-2초 후 다시 시도해주세요.\n(Google Maps API 키가 설정되지 않았으면 작동하지 않습니다.)');
      return;
    }
    setError('');
    setLoading(true);
    setHospitals([]);

    if (!navigator.geolocation) {
      setError('❌ 이 브라우저는 위치 서비스를 지원하지 않습니다.\n크롬, 파이어폭스, 사파리 등 최신 브라우저를 사용해주세요.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setLocation(coords);
        searchHospitals(coords, searchRadius); // ✅ 현재 반경 전달
      },
      (error) => {
        let errorMsg = '위치 권한을 허용해주세요.';
        if (error.code === 1) {
          errorMsg = '❌ 위치 권한이 거부되었습니다.\n브라우저 설정에서 위치 접근을 허용해주세요.';
        } else if (error.code === 2) {
          errorMsg = '❌ 위치 정보를 가져올 수 없습니다.\n인터넷 연결을 확인해주세요.';
        } else if (error.code === 3) {
          errorMsg = '❌ 위치 조회 시간이 초과되었습니다.\n다시 시도해주세요.';
        }
        setError(errorMsg);
        setLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  // ✅ 성능 최적화: 캐싱 + 중복 검색 방지 + AbortController
  const searchHospitals = (coords, radius) => {
    try {
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        setError('❌ Google Maps API 로드 실패\n.env에 VITE_GOOGLE_MAPS_API_KEY를 설정해주세요.');
        setLoading(false);
        return;
      }

      // 🔍 캐시 키 생성 (좌표 + 반경)
      const cacheKey = `${coords.lat.toFixed(4)}_${coords.lng.toFixed(4)}_${radius}`;

      // ⚡ 캐시 확인: 같은 위치+반경이면 즉시 반환
      if (searchCacheRef.current[cacheKey]) {
        console.log('✅ 캐시에서 로드:', cacheKey);
        setHospitals(searchCacheRef.current[cacheKey]);
        setError('');
        setLoading(false);
        return;
      }

      // 🛑 이전 검색 취소
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      // ⏱️ 중복 검색 방지: 1초 이내 같은 검색 무시
      const now = Date.now();
      if (lastSearchRef.current && now - lastSearchRef.current < 1000) {
        console.warn('⏱️ 검색 너무 빨라요. 1초 대기 중...');
        return;
      }
      lastSearchRef.current = now;

      const service = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );
      const request = {
        location: new window.google.maps.LatLng(coords.lat, coords.lng),
        radius: radius,
        keyword: '동물병원',
        language: 'ko'
      };

      service.nearbySearch(request, (results, status) => {
        // 🛑 요청 취소됨 확인
        if (abortControllerRef.current.signal.aborted) {
          console.log('🛑 검색 취소됨');
          return;
        }

        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          const data = results.map(place => ({
            id: place.place_id,
            name: place.name,
            address: place.vicinity,
            rating: place.rating || 0,
            userRatingsTotal: place.user_ratings_total || 0,
            openNow: place.opening_hours?.open_now || false,
            distance: calculateDistance(
              coords.lat, coords.lng,
              place.geometry.location.lat(),
              place.geometry.location.lng()
            )
          }));

          // ⬆️ 거리순 정렬 (성능: O(n log n))
          data.sort((a, b) => a.distance - b.distance);

          // 💾 캐시에 저장
          searchCacheRef.current[cacheKey] = data;
          console.log(`✅ 검색 완료: ${data.length}개 병원 (캐시 저장)`);

          setHospitals(data);
          setError('');
        } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          setError('📌 주변에 동물병원이 없습니다.\n반경을 넓혀서 다시 시도해주세요.');
          searchCacheRef.current[cacheKey] = [];
        } else {
          setError(`검색 오류: ${status}\n잠시 후 다시 시도해주세요.`);
        }
        setLoading(false);
      });
    } catch (err) {
      console.error('검색 오류:', err);
      setError('❌ 검색 중 오류가 발생했습니다.\nGoogle Maps API 설정을 확인해주세요.');
      setLoading(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 +
      Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  // ⚡ 필터링 성능 최적화: useMemo 대신 간단한 필터
  const filteredHospitals = filterOpen24
    ? hospitals.filter(h => h.openNow)
    : hospitals;

  // 📊 통계 (성능: O(1))
  const stats = {
    total: hospitals.length,
    open24: hospitals.filter(h => h.openNow).length,
    avgRating: hospitals.length > 0
      ? (hospitals.reduce((sum, h) => sum + h.rating, 0) / hospitals.length).toFixed(1)
      : 0
  };

  return (
    <section id="hospital-finder" className="py-20 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🏥 주변 동물병원 찾기
          </h2>
          <p className="text-xl text-gray-600">
            24시간 응급병원부터 일반 동물병원까지 한눈에
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <button
              onClick={getCurrentLocation}
              disabled={loading}
              className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all shadow-lg font-semibold text-lg"
            >
              {loading ? '🔍 검색 중...' : '📍 내 주변 동물병원 찾기'}
            </button>

            {hospitals.length > 0 && (
              <div className="flex gap-4 items-center">
                <select
                  value={searchRadius}
                  onChange={(e) => {
                    const newRadius = Number(e.target.value);
                    setSearchRadius(newRadius); // 상태 업데이트
                    if (location) {
                      setLoading(true);
                      searchHospitals(location, newRadius); // ✅ 새 반경 직접 전달
                    }
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value={3000}>반경 3km</option>
                  <option value={5000}>반경 5km</option>
                  <option value={10000}>반경 10km</option>
                </select>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterOpen24}
                    onChange={(e) => setFilterOpen24(e.target.checked)}
                    className="w-5 h-5 text-green-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">지금 운영 중만</span>
                </label>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              ⚠️ {error}
            </div>
          )}
          {loading && (
            <div className="mt-4 text-center text-gray-600 py-4">
              <p className="text-lg animate-pulse">🔍 주변 동물병원 검색 중...</p>
              <p className="text-xs text-gray-500 mt-2">로딩 중... (최대 3초)</p>
            </div>
          )}

          {/* ⚡ 검색 완료 후 통계 표시 */}
          {hospitals.length > 0 && !loading && (
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                <p className="text-xs text-gray-600">총 병원</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-2xl font-bold text-green-600">{stats.open24}</p>
                <p className="text-xs text-gray-600">현재 운영 중</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3">
                <p className="text-2xl font-bold text-yellow-600">⭐ {stats.avgRating}</p>
                <p className="text-xs text-gray-600">평균 별점</p>
              </div>
            </div>
          )}
        </div>

        {filteredHospitals.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredHospitals.map((hospital) => (
              <div
                key={hospital.id}
                className={`bg-white rounded-xl shadow-md p-5 cursor-pointer transition-all hover:shadow-xl border-2 ${
                  selectedHospital?.id === hospital.id ? 'border-green-500' : 'border-transparent'
                }`}
                onClick={() => setSelectedHospital(
                  selectedHospital?.id === hospital.id ? null : hospital
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-900">{hospital.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    hospital.openNow ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {hospital.openNow ? '🟢 운영중' : '🔴 마감'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">📍 {hospital.address}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span>📏 {hospital.distance.toFixed(1)}km</span>
                  {hospital.rating > 0 && (
                    <span>⭐ {hospital.rating} ({hospital.userRatingsTotal}명)</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <a
                    href={`https://map.kakao.com/link/search/${encodeURIComponent(hospital.name)}`}
                    target="_blank" rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="flex-1 text-center py-2 bg-yellow-400 text-black rounded-lg text-sm font-medium hover:bg-yellow-500 transition-all"
                  >
                    🗺️ 카카오맵
                  </a>
                  <a
                    href={`https://map.naver.com/v5/search/${encodeURIComponent(hospital.name)}`}
                    target="_blank" rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="flex-1 text-center py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-all"
                  >
                    🗺️ 네이버맵
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && hospitals.length === 0 && !error && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-6xl mb-4">🏥</div>
            <p className="text-xl mb-2">버튼을 눌러 주변 동물병원을 찾아보세요</p>
            <p className="text-sm">위치 권한 허용 후 검색됩니다</p>
          </div>
        )}
      </div>
    </section>
  );
}

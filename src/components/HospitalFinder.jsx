import { useState, useEffect } from 'react';

export default function HospitalFinder() {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchRadius, setSearchRadius] = useState(5000); // 5km
  const [filterOpen24, setFilterOpen24] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);

  // 현재 위치 가져오기
  const getCurrentLocation = () => {
    setLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(coords);
          searchHospitals(coords);
        },
        (error) => {
          console.error('위치 오류:', error);
          alert('위치 정보를 가져올 수 없습니다. 위치 권한을 허용해주세요.');
          setLoading(false);
        }
      );
    } else {
      alert('이 브라우저는 위치 서비스를 지원하지 않습니다.');
      setLoading(false);
    }
  };

  // Google Places API로 동물병원 검색
  const searchHospitals = async (coords) => {
    try {
      // Google Places API 사용 (프록시 서버 필요 없이 직접 호출)
      const service = new google.maps.places.PlacesService(
        document.createElement('div')
      );

      const request = {
        location: new google.maps.LatLng(coords.lat, coords.lng),
        radius: searchRadius,
        keyword: '동물병원',
        language: 'ko'
      };

      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          const hospitalData = results.map(place => ({
            id: place.place_id,
            name: place.name,
            address: place.vicinity,
            rating: place.rating || 0,
            userRatingsTotal: place.user_ratings_total || 0,
            openNow: place.opening_hours?.open_now || false,
            location: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            },
            distance: calculateDistance(
              coords.lat,
              coords.lng,
              place.geometry.location.lat(),
              place.geometry.location.lng()
            )
          }));

          // 거리순 정렬
          hospitalData.sort((a, b) => a.distance - b.distance);
          
          setHospitals(hospitalData);
          setLoading(false);
        } else {
          console.error('Places API 오류:', status);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('병원 검색 오류:', error);
      setLoading(false);
    }
  };

  // 두 지점 간 거리 계산 (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // 지구 반경 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // km
  };

  // 병원 상세 정보 가져오기
  const getHospitalDetails = (placeId) => {
    const service = new google.maps.places.PlacesService(
      document.createElement('div')
    );

    service.getDetails(
      {
        placeId: placeId,
        fields: ['name', 'formatted_phone_number', 'opening_hours', 'website', 'photos']
      },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          setSelectedHospital({
            ...selectedHospital,
            phone: place.formatted_phone_number,
            website: place.website,
            hours: place.opening_hours?.weekday_text,
            photos: place.photos
          });
        }
      }
    );
  };

  const filteredHospitals = filterOpen24
    ? hospitals.filter(h => h.openNow)
    : hospitals;

  return (
    <section id="hospital-finder" className="py-20 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🏥 주변 동물병원 찾기
          </h2>
          <p className="text-xl text-gray-600">
            24시간 응급병원부터 일반 동물병원까지 한눈에
          </p>
        </div>

        {/* 검색 버튼 & 필터 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <button
              onClick={getCurrentLocation}
              disabled={loading}
              className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all shadow-lg font-semibold text-lg"
            >
              {loading ? '🔍 검색 중...' : '📍 내 주변 동물병원 찾기'}
            </button>

            {hospitals.length > 0 && (
              <div className="flex gap-4 items-center">
                <select
                  value={searchRadius}
                  onChange={(e) => {
                    setSearchRadius(Number(e.target.value));
                    if (location) searchHospitals(location);
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
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    지금 운영 중만
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* 결과 */}
        {hospitals.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* 병원 리스트 */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {filteredHospitals.length > 0 ? (
                filteredHospitals.map((hospital, index) => (
                  <div
                    key={hospital.id}
                    onClick={() => {
                      setSelectedHospital(hospital);
                      getHospitalDetails(hospital.id);
                    }}
                    className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all hover:shadow-xl border-2 ${
                      selectedHospital?.id === hospital.id
                        ? 'border-green-500'
                        : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-2xl font-bold text-green-600">
                            {index + 1}
                          </span>
                          <h3 className="text-xl font-bold text-gray-900">
                            {hospital.name}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600">{hospital.address}</p>
                      </div>
                      {hospital.openNow && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                          운영 중
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="font-semibold">{hospital.rating.toFixed(1)}</span>
                          <span className="text-sm text-gray-500">
                            ({hospital.userRatingsTotal})
                          </span>
                        </div>
                        <div className="text-sm font-medium text-blue-600">
                          📍 {hospital.distance.toFixed(1)}km
                        </div>
                      </div>
                      <button className="text-green-600 hover:text-green-700 font-medium">
                        상세보기 →
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">지금 운영 중인 병원이 없습니다.</p>
                  <button
                    onClick={() => setFilterOpen24(false)}
                    className="mt-4 text-green-600 hover:text-green-700 font-medium"
                  >
                    전체 병원 보기
                  </button>
                </div>
              )}
            </div>

            {/* 지도 */}
            <div className="sticky top-4">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  📍 위치 지도
                </h3>
                
                {selectedHospital ? (
                  <div>
                    <div className="mb-4">
                      <h4 className="font-bold text-gray-900 mb-2">
                        {selectedHospital.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {selectedHospital.address}
                      </p>
                      
                      {selectedHospital.phone && (
                        <a
                          href={`tel:${selectedHospital.phone}`}
                          className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium"
                        >
                          <span>📞</span>
                          <span>{selectedHospital.phone}</span>
                        </a>
                      )}
                      
                      {selectedHospital.hours && (
                        <div className="mt-4">
                          <p className="font-semibold text-gray-900 mb-2">영업시간:</p>
                          <div className="text-sm text-gray-600 space-y-1">
                            {selectedHospital.hours.map((hour, i) => (
                              <p key={i}>{hour}</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.location.lat},${selectedHospital.location.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-3 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition-colors font-semibold"
                      >
                        길찾기 🚗
                      </a>
                      
                      {selectedHospital.phone && (
                        <a
                          href={`tel:${selectedHospital.phone}`}
                          className="block w-full py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                          전화하기 📞
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🗺️</div>
                    <p className="text-gray-500">
                      병원을 선택하면 지도가 표시됩니다
                    </p>
                  </div>
                )}
              </div>

              {/* 안내사항 */}
              <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <p className="text-sm text-yellow-800">
                  <strong>💡 Tip:</strong> 응급 상황에는 24시간 병원에 먼저 전화하세요!
                </p>
              </div>
            </div>
          </div>
        ) : (
          !loading && (
            <div className="text-center py-20">
              <div className="text-8xl mb-6">🏥</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                주변 동물병원을 찾아보세요
              </h3>
              <p className="text-gray-600 mb-8">
                24시간 응급병원부터 일반 동물병원까지<br />
                거리순으로 정렬해드립니다
              </p>
              <button
                onClick={getCurrentLocation}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all shadow-lg font-semibold text-lg"
              >
                📍 내 주변 동물병원 찾기
              </button>
            </div>
          )
        )}

        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mb-4"></div>
            <p className="text-gray-600">주변 동물병원을 검색하고 있습니다...</p>
          </div>
        )}
      </div>

      {/* Google Maps 스크립트 */}
      <script
        src={`https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places&language=ko`}
        async
        defer
      ></script>
    </section>
  );
}

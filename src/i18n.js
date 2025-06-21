import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appTitle: 'NimbusNow',
      search: 'Search',
      searchPlaceholder: 'Enter city name...',
      searchButton: 'Search Weather',
      useLocation: 'Use My Location',
      loading: 'Loading...',
      favorites: 'Favorite Cities',
      forecast: '5-Day Forecast',
      notFound: 'City not found.',
      humidity: 'Humidity',
      wind: 'Wind',
      feelsLike: 'Feels like',
      min: 'Min',
      max: 'Max',
      error: 'An error occurred.',
      miniMode: 'Mini Mode',
      fullMode: 'Full Mode',
      celsius: '°C',
      fahrenheit: '°F',
    }
  },
  id: {
    translation: {
      appTitle: 'NimbusNow',
      search: 'Cari',
      searchPlaceholder: 'Masukkan nama kota...',
      searchButton: 'Cari Cuaca',
      useLocation: 'Gunakan Lokasi Saya',
      loading: 'Memuat...',
      favorites: 'Kota Favorit',
      forecast: 'Prakiraan 5 Hari',
      notFound: 'Kota tidak ditemukan.',
      humidity: 'Kelembapan',
      wind: 'Angin',
      feelsLike: 'Terasa seperti',
      min: 'Min',
      max: 'Maks',
      error: 'Terjadi kesalahan.',
      miniMode: 'Mode Mini',
      fullMode: 'Mode Lengkap',
      celsius: '°C',
      fahrenheit: '°F',
    }
  },
  zh: { translation: { appTitle: 'NimbusNow', search: '搜索', searchPlaceholder: '输入城市名称...', searchButton: '搜索天气', useLocation: '使用我的位置', loading: '加载中...', favorites: '收藏城市', forecast: '5天天气预报', notFound: '未找到城市。', humidity: '湿度', wind: '风', feelsLike: '体感温度', min: '最低', max: '最高', error: '发生错误。', miniMode: '迷你模式', fullMode: '完整模式', celsius: '°C', fahrenheit: '°F', } },
  es: { translation: { appTitle: 'NimbusNow', search: 'Buscar', searchPlaceholder: 'Ingrese el nombre de la ciudad...', searchButton: 'Buscar Clima', useLocation: 'Usar mi ubicación', loading: 'Cargando...', favorites: 'Ciudades Favoritas', forecast: 'Pronóstico de 5 días', notFound: 'Ciudad no encontrada.', humidity: 'Humedad', wind: 'Viento', feelsLike: 'Sensación térmica', min: 'Mín', max: 'Máx', error: 'Ocurrió un error.', miniMode: 'Modo Mini', fullMode: 'Modo Completo', celsius: '°C', fahrenheit: '°F', } },
  ar: { translation: { appTitle: 'NimbusNow', search: 'بحث', searchPlaceholder: 'أدخل اسم المدينة...', searchButton: 'ابحث عن الطقس', useLocation: 'استخدم موقعي', loading: 'جار التحميل...', favorites: 'المدن المفضلة', forecast: 'توقعات 5 أيام', notFound: 'لم يتم العثور على المدينة.', humidity: 'الرطوبة', wind: 'الرياح', feelsLike: 'يشعر وكأنه', min: 'الحد الأدنى', max: 'الحد الأقصى', error: 'حدث خطأ.', miniMode: 'الوضع المصغر', fullMode: 'الوضع الكامل', celsius: '°م', fahrenheit: '°ف', } },
  hi: { translation: { appTitle: 'NimbusNow', search: 'खोजें', searchPlaceholder: 'शहर का नाम दर्ज करें...', searchButton: 'मौसम खोजें', useLocation: 'मेरी लोकेशन का उपयोग करें', loading: 'लोड हो रहा है...', favorites: 'पसंदीदा शहर', forecast: '5-दिन का पूर्वानुमान', notFound: 'शहर नहीं मिला।', humidity: 'आर्द्रता', wind: 'हवा', feelsLike: 'महसूस होता है', min: 'न्यूनतम', max: 'अधिकतम', error: 'एक त्रुटि हुई।', miniMode: 'मिनी मोड', fullMode: 'पूर्ण मोड', celsius: '°से', fahrenheit: '°फ', } },
  ru: { translation: { appTitle: 'NimbusNow', search: 'Поиск', searchPlaceholder: 'Введите название города...', searchButton: 'Поиск погоды', useLocation: 'Использовать мое местоположение', loading: 'Загрузка...', favorites: 'Избранные города', forecast: 'Прогноз на 5 дней', notFound: 'Город не найден.', humidity: 'Влажность', wind: 'Ветер', feelsLike: 'Ощущается как', min: 'Мин', max: 'Макс', error: 'Произошла ошибка.', miniMode: 'Мини-режим', fullMode: 'Полный режим', celsius: '°C', fahrenheit: '°F', } },
  pt: { translation: { appTitle: 'NimbusNow', search: 'Buscar', searchPlaceholder: 'Digite o nome da cidade...', searchButton: 'Buscar Clima', useLocation: 'Usar minha localização', loading: 'Carregando...', favorites: 'Cidades Favoritas', forecast: 'Previsão de 5 dias', notFound: 'Cidade não encontrada.', humidity: 'Umidade', wind: 'Vento', feelsLike: 'Sensação térmica', min: 'Mín', max: 'Máx', error: 'Ocorreu um erro.', miniMode: 'Modo Mini', fullMode: 'Modo Completo', celsius: '°C', fahrenheit: '°F', } },
  ja: { translation: { appTitle: 'NimbusNow', search: '検索', searchPlaceholder: '都市名を入力...', searchButton: '天気を検索', useLocation: '現在地を使用', loading: '読み込み中...', favorites: 'お気に入り都市', forecast: '5日間の予報', notFound: '都市が見つかりません。', humidity: '湿度', wind: '風', feelsLike: '体感温度', min: '最低', max: '最高', error: 'エラーが発生しました。', miniMode: 'ミニモード', fullMode: 'フルモード', celsius: '°C', fahrenheit: '°F', } },
  fr: { translation: { appTitle: 'NimbusNow', search: 'Rechercher', searchPlaceholder: 'Entrez le nom de la ville...', searchButton: 'Rechercher la météo', useLocation: 'Utiliser ma position', loading: 'Chargement...', favorites: 'Villes favorites', forecast: 'Prévisions sur 5 jours', notFound: 'Ville non trouvée.', humidity: 'Humidité', wind: 'Vent', feelsLike: 'Ressenti', min: 'Min', max: 'Max', error: 'Une erreur est survenue.', miniMode: 'Mode Mini', fullMode: 'Mode Complet', celsius: '°C', fahrenheit: '°F', } },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'id',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 
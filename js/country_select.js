// Country Select - Инициализация Select2 для выбора страны
// Используется только когда isAtmRegEnabled = false

document.addEventListener('DOMContentLoaded', function() {
  const countrySelect = document.getElementById('selectNationality');

  if (!countrySelect) return;

  // Динамическая загрузка скриптов
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const loadStylesheet = (href) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  };

  // Загружаем стили Select2
  loadStylesheet('https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css');
  loadStylesheet('https://cdn.jsdelivr.net/npm/select2-bootstrap-5-theme@1.3.0/dist/select2-bootstrap-5-theme.min.css');

  // Загружаем скрипты последовательно
  loadScript('https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js')
    .then(() => loadScript('https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js'))
    .then(() => initializeCountrySelect(countrySelect))
    .catch(error => console.error('Ошибка загрузки Select2:', error));
});

function initializeCountrySelect(countrySelect) {
  // Список стран с правильной сортировкой
  const countries = [
    { id: 'RU', text: '🇷🇺 Россия' },
    { id: 'BY', text: '🇧🇾 Беларусь' },
    { id: 'KZ', text: '🇰🇿 Казахстан' },
    { id: 'KG', text: '🇰🇬 Кыргызстан' },
    { id: 'UZ', text: '🇺🇿 Узбекистан' },
    { id: 'TJ', text: '🇹🇯 Таджикистан' },
    { id: '', text: '──── Другие страны ────', disabled: true },
    { id: 'AU', text: '🇦🇺 Австралия' },
    { id: 'AT', text: '🇦🇹 Австрия' },
    { id: 'AR', text: '🇦🇷 Аргентина' },
    { id: 'BE', text: '🇧🇪 Бельгия' },
    { id: 'BG', text: '🇧🇬 Болгария' },
    { id: 'BR', text: '🇧🇷 Бразилия' },
    { id: 'GB', text: '🇬🇧 Великобритания' },
    { id: 'HU', text: '🇭🇺 Венгрия' },
    { id: 'VN', text: '🇻🇳 Вьетнам' },
    { id: 'DE', text: '🇩🇪 Германия' },
    { id: 'GR', text: '🇬🇷 Греция' },
    { id: 'DK', text: '🇩🇰 Дания' },
    { id: 'IL', text: '🇮🇱 Израиль' },
    { id: 'IN', text: '🇮🇳 Индия' },
    { id: 'ID', text: '🇮🇩 Индонезия' },
    { id: 'IE', text: '🇮🇪 Ирландия' },
    { id: 'IS', text: '🇮🇸 Исландия' },
    { id: 'ES', text: '🇪🇸 Испания' },
    { id: 'IT', text: '🇮🇹 Италия' },
    { id: 'KH', text: '🇰🇭 Камбоджа' },
    { id: 'CA', text: '🇨🇦 Канада' },
    { id: 'CY', text: '🇨🇾 Кипр' },
    { id: 'CN', text: '🇨🇳 Китай' },
    { id: 'CO', text: '🇨🇴 Колумбия' },
    { id: 'LV', text: '🇱🇻 Латвия' },
    { id: 'LT', text: '🇱🇹 Литва' },
    { id: 'LI', text: '🇱🇮 Лихтенштейн' },
    { id: 'LU', text: '🇱🇺 Люксембург' },
    { id: 'MY', text: '🇲🇾 Малайзия' },
    { id: 'MT', text: '🇲🇹 Мальта' },
    { id: 'MX', text: '🇲🇽 Мексика' },
    { id: 'MC', text: '🇲🇨 Монако' },
    { id: 'MN', text: '🇲🇳 Монголия' },
    { id: 'NL', text: '🇳🇱 Нидерланды' },
    { id: 'NZ', text: '🇳🇿 Новая Зеландия' },
    { id: 'NO', text: '🇳🇴 Норвегия' },
    { id: 'AE', text: '🇦🇪 ОАЭ' },
    { id: 'PL', text: '🇵🇱 Польша' },
    { id: 'PT', text: '🇵🇹 Португалия' },
    { id: 'RO', text: '🇷🇴 Румыния' },
    { id: 'SG', text: '🇸🇬 Сингапур' },
    { id: 'SK', text: '🇸🇰 Словакия' },
    { id: 'SI', text: '🇸🇮 Словения' },
    { id: 'US', text: '🇺🇸 США' },
    { id: 'TH', text: '🇹🇭 Таиланд' },
    { id: 'TR', text: '🇹🇷 Турция' },
    { id: 'PH', text: '🇵🇭 Филиппины' },
    { id: 'FI', text: '🇫🇮 Финляндия' },
    { id: 'FR', text: '🇫🇷 Франция' },
    { id: 'HR', text: '🇭🇷 Хорватия' },
    { id: 'CZ', text: '🇨🇿 Чехия' },
    { id: 'CL', text: '🇨🇱 Чили' },
    { id: 'CH', text: '🇨🇭 Швейцария' },
    { id: 'SE', text: '🇸🇪 Швеция' },
    { id: 'EE', text: '🇪🇪 Эстония' },
    { id: 'KR', text: '🇰🇷 Южная Корея' },
    { id: 'JP', text: '🇯🇵 Япония' }
  ];

  // Очищаем существующие опции
  countrySelect.innerHTML = '';

  // Добавляем опции
  countries.forEach(country => {
    const option = new Option(country.text, country.id, false, country.id === 'RU');
    if (country.disabled) option.disabled = true;
    countrySelect.add(option);
  });

  // Инициализируем Select2
  $(countrySelect).select2({
    theme: 'bootstrap-5',
    width: '100%',
    placeholder: 'Выберите страну',
    allowClear: false,
    dropdownAutoWidth: true,
    minimumResultsForSearch: 0,
    language: {
      noResults: function() {
        return 'Страна не найдена';
      },
      searching: function() {
        return 'Поиск...';
      }
    },
    matcher: function(params, data) {
      if ($.trim(params.term) === '') {
        return data;
      }

      if (!data.text) {
        return null;
      }

      // Поиск по названию страны (без флага)
      const searchTerm = params.term.toLowerCase();
      const countryName = data.text.substring(5).toLowerCase();

      if (countryName.indexOf(searchTerm) > -1) {
        return data;
      }

      return null;
    }
  });

  // Устанавливаем значение по умолчанию
  $(countrySelect).val('RU').trigger('change');

  // Фокус на поиске при открытии
  $(countrySelect).on('select2:open', function() {
    setTimeout(function() {
      document.querySelector('.select2-search__field').focus();
    }, 10);
  });
}

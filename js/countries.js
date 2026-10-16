import { getLanguage, t } from "./i18n.js";
export const countries = [
  { id: "RU", text: "🇷🇺 Россия" },
  { id: "BY", text: "🇧🇾 Беларусь" },
  { id: "KZ", text: "🇰🇿 Казахстан" },
  { id: "KG", text: "🇰🇬 Кыргызстан" },
  { id: "UZ", text: "🇺🇿 Узбекистан" },
  { id: "TJ", text: "🇹🇯 Таджикистан" },
  { id: "", text: "──── Другие страны ────", disabled: true },
  { id: "AU", text: "🇦🇺 Австралия" },
  { id: "AT", text: "🇦🇹 Австрия" },
  { id: "AR", text: "🇦🇷 Аргентина" },
  { id: "BE", text: "🇧🇪 Бельгия" },
  { id: "BG", text: "🇧🇬 Болгария" },
  { id: "BR", text: "🇧🇷 Бразилия" },
  { id: "GB", text: "🇬🇧 Великобритания" },
  { id: "HU", text: "🇭🇺 Венгрия" },
  { id: "VN", text: "🇻🇳 Вьетнам" },
  { id: "DE", text: "🇩🇪 Германия" },
  { id: "GR", text: "🇬🇷 Греция" },
  { id: "DK", text: "🇩🇰 Дания" },
  { id: "IL", text: "🇮🇱 Израиль" },
  { id: "IN", text: "🇮🇳 Индия" },
  { id: "ID", text: "🇮🇩 Индонезия" },
  { id: "IE", text: "🇮🇪 Ирландия" },
  { id: "IS", text: "🇮🇸 Исландия" },
  { id: "ES", text: "🇪🇸 Испания" },
  { id: "IT", text: "🇮🇹 Италия" },
  { id: "KH", text: "🇰🇭 Камбоджа" },
  { id: "CA", text: "🇨🇦 Канада" },
  { id: "CY", text: "🇨🇾 Кипр" },
  { id: "CN", text: "🇨🇳 Китай" },
  { id: "CO", text: "🇨🇴 Колумбия" },
  { id: "LV", text: "🇱🇻 Латвия" },
  { id: "LT", text: "🇱🇹 Литва" },
  { id: "LI", text: "🇱🇮 Лихтенштейн" },
  { id: "LU", text: "🇱🇺 Люксембург" },
  { id: "MY", text: "🇲🇾 Малайзия" },
  { id: "MT", text: "🇲🇹 Мальта" },
  { id: "MX", text: "🇲🇽 Мексика" },
  { id: "MC", text: "🇲🇨 Монако" },
  { id: "MN", text: "🇲🇳 Монголия" },
  { id: "NL", text: "🇳🇱 Нидерланды" },
  { id: "NZ", text: "🇳🇿 Новая Зеландия" },
  { id: "NO", text: "🇳🇴 Норвегия" },
  { id: "AE", text: "🇦🇪 ОАЭ" },
  { id: "PL", text: "🇵🇱 Польша" },
  { id: "PT", text: "🇵🇹 Португалия" },
  { id: "RO", text: "🇷🇴 Румыния" },
  { id: "SG", text: "🇸🇬 Сингапур" },
  { id: "SK", text: "🇸🇰 Словакия" },
  { id: "SI", text: "🇸🇮 Словения" },
  { id: "US", text: "🇺🇸 США" },
  { id: "TH", text: "🇹🇭 Таиланд" },
  { id: "TR", text: "🇹🇷 Турция" },
  { id: "PH", text: "🇵🇭 Филиппины" },
  { id: "FI", text: "🇫🇮 Финляндия" },
  { id: "FR", text: "🇫🇷 Франция" },
  { id: "HR", text: "🇭🇷 Хорватия" },
  { id: "CZ", text: "🇨🇿 Чехия" },
  { id: "CL", text: "🇨🇱 Чили" },
  { id: "CH", text: "🇨🇭 Швейцария" },
  { id: "SE", text: "🇸🇪 Швеция" },
  { id: "EE", text: "🇪🇪 Эстония" },
  { id: "KR", text: "🇰🇷 Южная Корея" },
  { id: "JP", text: "🇯🇵 Япония" },
];

export function initCountries() {
  const select = document.getElementById("selectNationality");
  countries.forEach((country) => {
    const option = new Option(
      country.text,
      country.id,
      false,
      country.id === "RU",
    );
    option.disabled = Boolean(country.disabled);
    select.add(option);
  });
  translateCountries();
}

function translateCountries() {
  const names = new Intl.DisplayNames([getLanguage()], { type: "region" });
  for (const option of document.getElementById("selectNationality").options) {
    const country = countries.find((item) => item.id === option.value);
    if (!country) continue;
    option.textContent = country.disabled
      ? `──── ${t("countries.other")} ────`
      : `${country.text.split(" ")[0]} ${names.of(country.id)}`;
  }
}
window.addEventListener("languagechange", translateCountries);

import { hideRegistrationForm } from "./registration.js";

export function initUi() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      if (
        anchor.hasAttribute("data-bs-toggle") ||
        anchor.hasAttribute("data-action")
      )
        return;
      const target = document.getElementById(
        anchor.getAttribute("href").slice(1),
      );
      if (!target) return;
      event.preventDefault();
      if (document.getElementById("mainContent").style.display === "none")
        hideRegistrationForm();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  const banner = document.getElementById("cookieConsent");
  banner.style.display = document.cookie.includes("cookieAccepted=true")
    ? "none"
    : "block";
  document.getElementById("acceptCookie").addEventListener("click", () => {
    document.cookie =
      "cookieAccepted=true; max-age=15552000; path=/; SameSite=Lax";
    banner.style.display = "none";
  });
  document.addEventListener("click", (event) => {
    const tooltip = event.target
      .closest(".tooltip-icon")
      ?.closest(".custom-tooltip");
    document.querySelectorAll(".custom-tooltip.active").forEach((item) => {
      if (item !== tooltip) item.classList.remove("active");
    });
    tooltip?.classList.toggle("active");
  });
  document.querySelectorAll(".swiper").forEach((element) => {
    new Swiper(element, {
      slidesPerView: 1.2,
      spaceBetween: 15,
      grabCursor: true,
      freeMode: true,
      scrollbar: {
        el: element.querySelector(".swiper-scrollbar"),
        draggable: true,
      },
      breakpoints: {
        576: { slidesPerView: 2.2 },
        992: { slidesPerView: 3.2 },
        1200: { slidesPerView: 4.2 },
      },
    });
  });
  const video = document.querySelector("#videoModal iframe");
  document
    .getElementById("videoModal")
    .addEventListener("hidden.bs.modal", () => {
      if (video) video.src = video.src; // Arrêter la lecture à la fermeture.
    });
}

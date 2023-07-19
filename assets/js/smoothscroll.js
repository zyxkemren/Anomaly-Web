// Menangkap semua anchor link yang di dalam dokumen
const anchorLinks = document.querySelectorAll('a[href^="#"]');

// Loop melalui setiap anchor link dan tambahkan event listener untuk scroll smooth
anchorLinks.forEach((link) => {
  link.addEventListener("click", smoothScroll);
});

// Fungsi untuk scroll smooth
function smoothScroll(e) {
  e.preventDefault();

  const targetId = this.getAttribute("href");
  const targetElement = document.querySelector(targetId);

  if (targetElement) {
    const targetPosition =
      targetElement.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  }
}

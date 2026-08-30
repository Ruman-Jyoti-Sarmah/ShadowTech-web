// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');

function setMenu(open) {
  sidebar.classList.toggle('active', open);
  hamburger.classList.toggle('open', open);
}

// Navbar shadow enhancement on scroll
const header = document.getElementById('main-header');
if (header) {
    const onScroll = () => {
        header.classList.toggle('scrolled', (window.pageYOffset || window.scrollY) > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

hamburger.addEventListener('click', () => {
  setMenu(!sidebar.classList.contains('active'));
});

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
  if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
    setMenu(false);
  }
});

// Close sidebar when clicking a link
const sidebarLinks = document.querySelectorAll('.sidebar-link');
sidebarLinks.forEach(link => {
  link.addEventListener('click', () => {
    setMenu(false);
  });
});

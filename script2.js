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

/* ============================================================
   3-Dot Kebab Menu — Smooth Animated Dropdown (index2.html)
   Clicking the three-dot button toggles a smoothly animated
   dropdown menu on the project card.
   ============================================================ */
(function () {
  'use strict';

  var menuButtons = document.querySelectorAll('.card-menu-btn');
  if (!menuButtons.length) return;

  // Close every open dropdown
  function closeAllDropdowns() {
    menuButtons.forEach(function (btn) {
      var wrapper = btn.closest('.card-menu-wrapper');
      if (wrapper) {
        wrapper.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.classList.remove('open');
      }
    });
  }

  // Toggle a single dropdown
  function toggleDropdown(btn, e) {
    e.stopPropagation(); // don't bubble up to the document click handler
    var wrapper = btn.closest('.card-menu-wrapper');
    var isOpen = wrapper.classList.contains('open');

    // Close all others first so only one is open at a time
    closeAllDropdowns();

    if (!isOpen) {
      wrapper.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      btn.classList.add('open');
    }
  }

  menuButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      toggleDropdown(btn, e);
    });
  });

  // Close any open dropdown when clicking outside
  document.addEventListener('click', function () {
    closeAllDropdowns();
  });

    /* ---- Share action ---- */
  function handleShare(e) {
    e.preventDefault();
    var url = e.currentTarget.dataset.share;
    if (navigator.share) {
      navigator.share({ url: url || window.location.href, title: 'Check this out!' });
    } else if (url) {
      // Fallback: copy to clipboard
      var temp = document.createElement('textarea');
      temp.value = url;
      document.body.appendChild(temp);
      temp.select();
      try { document.execCommand('copy'); } catch (err) { }
      document.body.removeChild(temp);
            // Brief visual feedback
      var btn = e.currentTarget;
      var textNode = Array.prototype.find.call(btn.childNodes, function (node) {
        return node.nodeType === 3;
      });
      var originalText = textNode ? textNode.textContent.trim() : 'Share';
      if (textNode) {
        textNode.textContent = ' Copied!';
      }
      setTimeout(function () {
        if (textNode) {
          textNode.textContent = ' ' + originalText;
        }
      }, 1200);
    }
  }

      /* ---- Bookmark action ---- */
  function handleBookmark(e) {
    e.preventDefault();
    var name = e.currentTarget.dataset.project || 'this project';
    // Store in sessionStorage so it persists across navigation on the same page
    var bookmarks = JSON.parse(sessionStorage.getItem('bookmarks') || '[]');
    var isBookmarked = bookmarks.indexOf(name) !== -1;
    var message;

    if (!isBookmarked) {
      bookmarks.push(name);
      sessionStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      message = 'Bookmarked: ' + name;
    } else {
      bookmarks.splice(bookmarks.indexOf(name), 1);
      sessionStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      message = 'Removed bookmark: ' + name;
    }
    isBookmarked = !isBookmarked;

    // Update only the text node, preserving the <i> icon
    var textNode = Array.prototype.find.call(e.currentTarget.childNodes, function (node) {
      return node.nodeType === 3;
    });
    if (textNode) {
      textNode.textContent = isBookmarked ? ' Bookmarked' : ' Bookmark';
    }
    e.currentTarget.classList.toggle('bookmarked', isBookmarked);

    // Show a temporary toast
    var toast = document.createElement('div');
    toast.className = 'card-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 1800);
  }

  var shareButtons = document.querySelectorAll('.share-item');
  shareButtons.forEach(function (btn) {
    btn.addEventListener('click', handleShare);
  });

  var bookmarkButtons = document.querySelectorAll('.bookmark-item');
  bookmarkButtons.forEach(function (btn) {
    btn.addEventListener('click', handleBookmark);
  });
})();

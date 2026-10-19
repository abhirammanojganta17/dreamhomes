document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  setTimeout(() => preloader?.classList.add("hide"), 750);

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  menuToggle?.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", open);
  });
  document.querySelectorAll(".nav-link, .login-btn").forEach(link => {
    link.addEventListener("click", () => navLinks?.classList.remove("open"));
  });

  const revealItems = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(el => revealObserver.observe(el));

  const navSections = [...document.querySelectorAll("main section[id]")];
  const navAnchors = [...document.querySelectorAll(".nav-link")];
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  navSections.forEach(s => sectionObserver.observe(s));

  const counters = document.querySelectorAll("[data-count]");
  let countersStarted = false;
  const statsObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !countersStarted) {
      countersStarted = true;
      counters.forEach(counter => {
        const target = Number(counter.dataset.count);
        const suffix = target === 98 ? "%" : "+";
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 65));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          counter.textContent = current.toLocaleString() + suffix;
        }, 22);
      });
    }
  }, { threshold: .5 });
  const stats = document.querySelector(".stats-strip");
  if (stats) statsObserver.observe(stats);

  const toast = document.getElementById("toast");
  const showToast = msg => {
    if (!toast) return;
    toast.textContent = msg; toast.classList.add("show");
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  };

  document.querySelectorAll(".heart").forEach(btn => btn.addEventListener("click", e => {
    e.stopPropagation();
    btn.classList.toggle("saved");
    btn.textContent = btn.classList.contains("saved") ? "♥" : "♡";
    showToast(btn.classList.contains("saved") ? "Property saved to your favourites." : "Property removed from favourites.");
  }));
  document.querySelectorAll(".details-btn").forEach(btn => btn.addEventListener("click", () => showToast("Property details demo — connect this button to your property details page.")));

  const searchBtn = document.getElementById("searchBtn");
  searchBtn?.addEventListener("click", () => {
    const location = (document.getElementById("location")?.value || "").trim().toLowerCase();
    const type = document.getElementById("type")?.value || "all";
    const cards = document.querySelectorAll(".property-card");
    let matches = 0;
    cards.forEach(card => {
      const loc = card.dataset.location || "";
      const cardType = card.dataset.type || "";
      const match = (!location || loc.includes(location)) && (type === "all" || cardType === type);
      card.style.display = match ? "" : "none";
      if (match) matches++;
    });
    const noResults = document.getElementById("noResults");
    if (noResults) noResults.style.display = matches ? "none" : "block";
    document.getElementById("properties")?.scrollIntoView({ behavior:"smooth" });
    showToast(matches ? `${matches} matching ${matches === 1 ? "property" : "properties"} found.` : "No matching properties found.");
  });

  const quotes = [
    ["Ananya Sharma","Home buyer · Hyderabad","The whole experience felt simple from the first search. I could compare homes quickly and finally found a place that feels like mine."],
    ["Rahul Mehta","Property seller · Bengaluru","The listing process was straightforward and the presentation helped my property stand out to the right audience."],
    ["Sneha Patel","First-time buyer · Visakhapatnam","I loved how easy it was to explore different options. The clean property details made comparing homes much less stressful."]
  ];
  let quoteIndex = 0;
  const quoteText = document.getElementById("quoteText"), quoteName = document.getElementById("quoteName"), quoteRole = document.getElementById("quoteRole");
  const setQuote = i => {
    quoteIndex = (i + quotes.length) % quotes.length;
    if (quoteText) quoteText.textContent = quotes[quoteIndex][2];
    if (quoteName) quoteName.textContent = quotes[quoteIndex][0];
    if (quoteRole) quoteRole.textContent = quotes[quoteIndex][1];
  };
  document.getElementById("nextQuote")?.addEventListener("click", () => setQuote(quoteIndex + 1));
  document.getElementById("prevQuote")?.addEventListener("click", () => setQuote(quoteIndex - 1));

  const backTop = document.getElementById("backTop");
  window.addEventListener("scroll", () => backTop?.classList.toggle("show", window.scrollY > 650));
  backTop?.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));

  const togglePassword = document.getElementById("togglePassword");
  togglePassword?.addEventListener("click", () => {
    const input = document.getElementById("password");
    input.type = input.type === "password" ? "text" : "password";
    togglePassword.textContent = input.type === "password" ? "Show" : "Hide";
  });
  document.getElementById("loginForm")?.addEventListener("submit", e => {
    e.preventDefault();
    showToast("Demo login successful — connect this form to your backend.");
  });
  document.getElementById("demoLogin")?.addEventListener("click", () => {
    document.getElementById("email").value = "demo@dreamhomes.example";
    document.getElementById("password").value = "dream123";
    showToast("Demo account details filled in.");
  });
  document.getElementById("forgotLink")?.addEventListener("click", e => { e.preventDefault(); showToast("Password reset is a demo feature in this project."); });
  document.getElementById("signupLink")?.addEventListener("click", e => { e.preventDefault(); showToast("Registration page can be connected to your backend next."); });
});

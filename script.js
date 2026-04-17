document.addEventListener("DOMContentLoaded", () => {
  setCurrentYear();
  setupNavigation();
  setupRevealAnimation();
  setupParallax();

  const page = document.body.dataset.page;

  if (page === "home") {
    initHomePage();
  }

  if (page === "characters") {
    initCharacterPage();
  }

  if (page === "events") {
    initEventsPage();
  }
});

function setCurrentYear() {
  const year = new Date().getFullYear();
  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(year);
  });
}

function setupNavigation() {
  const page = document.body.dataset.page;
  const nav = document.querySelector("[data-nav]");
  const toggle = document.querySelector("[data-menu-toggle]");

  document.querySelectorAll("[data-page-link]").forEach((link) => {
    link.classList.toggle("is-current", link.dataset.pageLink === page);
  });

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("is-open");
    });

    nav.querySelectorAll("a").forEach((anchor) => {
      anchor.addEventListener("click", () => {
        nav.classList.remove("is-open");
      });
    });
  }
}

function setupRevealAnimation() {
  const revealTargets = document.querySelectorAll("[data-reveal]");

  if (!revealTargets.length) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealTargets.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
    }
  );

  revealTargets.forEach((item) => observer.observe(item));
}

function setupParallax() {
  const zones = document.querySelectorAll("[data-parallax-zone]");

  zones.forEach((zone) => {
    const layers = zone.querySelectorAll("[data-depth]");
    if (!layers.length) {
      return;
    }

    zone.addEventListener("mousemove", (event) => {
      const bounds = zone.getBoundingClientRect();
      const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;

      layers.forEach((layer) => {
        const depth = Number(layer.dataset.depth || 10);
        layer.style.transform = `translate(${offsetX * depth}px, ${offsetY * depth}px)`;
      });
    });

    zone.addEventListener("mouseleave", () => {
      layers.forEach((layer) => {
        layer.style.transform = "translate(0, 0)";
      });
    });
  });
}

function initHomePage() {
  initNewsCarousel();
  initCommissionTracker();
}

function initNewsCarousel() {
  const track = document.querySelector("[data-carousel-track]");
  const prevButton = document.querySelector("[data-carousel-prev]");
  const nextButton = document.querySelector("[data-carousel-next]");

  if (!track) {
    return;
  }

  const cards = Array.from(track.children);
  if (!cards.length) {
    return;
  }

  let index = 0;
  let intervalId = null;

  const updateSlide = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
  };

  const goNext = () => {
    index = (index + 1) % cards.length;
    updateSlide();
  };

  const goPrev = () => {
    index = (index - 1 + cards.length) % cards.length;
    updateSlide();
  };

  if (nextButton) {
    nextButton.addEventListener("click", goNext);
  }

  if (prevButton) {
    prevButton.addEventListener("click", goPrev);
  }

  const startAuto = () => {
    stopAuto();
    intervalId = window.setInterval(goNext, 5500);
  };

  const stopAuto = () => {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  };

  track.addEventListener("mouseenter", stopAuto);
  track.addEventListener("mouseleave", startAuto);

  updateSlide();
  startAuto();
}

function initCommissionTracker() {
  const list = document.querySelector("[data-commission-list]");
  const statusText = document.querySelector("[data-commission-text]");
  const progressBar = document.querySelector("[data-commission-bar]");

  if (!list || !statusText || !progressBar) {
    return;
  }

  const checkboxes = Array.from(list.querySelectorAll("input[type='checkbox']"));
  const storageKey = "gamora-commission-state";

  const savedState = readStorage(storageKey, {});

  checkboxes.forEach((checkbox) => {
    const id = checkbox.dataset.commission;
    if (id && savedState[id]) {
      checkbox.checked = true;
    }

    checkbox.addEventListener("change", () => {
      const nextState = {};
      checkboxes.forEach((item) => {
        const key = item.dataset.commission;
        if (key) {
          nextState[key] = item.checked;
        }
      });
      writeStorage(storageKey, nextState);
      renderCommissionProgress();
    });
  });

  function renderCommissionProgress() {
    const completed = checkboxes.filter((checkbox) => checkbox.checked).length;
    const total = checkboxes.length;
    const percent = total ? Math.round((completed / total) * 100) : 0;

    statusText.textContent = `${completed}/${total} complete`;
    progressBar.style.width = `${percent}%`;
  }

  renderCommissionProgress();
}

function initCharacterPage() {
  initRosterSelection();
  initWishSimulator();
}

function initRosterSelection() {
  const cards = Array.from(document.querySelectorAll(".roster-card"));
  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));

  if (!cards.length) {
    return;
  }

  const nameNode = document.querySelector("[data-character-name]");
  const elementNode = document.querySelector("[data-character-element]");
  const roleNode = document.querySelector("[data-character-role]");
  const quoteNode = document.querySelector("[data-character-quote]");
  const imageNode = document.querySelector("[data-character-image]");
  const starsNode = document.querySelector("[data-character-stars]");
  const skillNode = document.querySelector("[data-character-skill]");
  const burstNode = document.querySelector("[data-character-burst]");

  const updateSpotlight = (card) => {
    const rarity = Number(card.dataset.rarity || 4);

    if (nameNode) {
      nameNode.textContent = card.dataset.name || "Unknown Operative";
    }

    if (elementNode) {
      elementNode.textContent = toLabel(card.dataset.element || "");
    }

    if (roleNode) {
      roleNode.textContent = card.dataset.role || "Unknown Role";
    }

    if (quoteNode) {
      quoteNode.textContent = card.dataset.quote || "No quote available.";
    }

    if (imageNode) {
      imageNode.src = card.dataset.image || imageNode.src;
      imageNode.alt = `${card.dataset.name || "Operative"} portrait`;
    }

    if (starsNode) {
      starsNode.textContent = "★".repeat(rarity);
    }

    if (skillNode) {
      skillNode.textContent = card.dataset.skill || "Unknown Skill";
    }

    if (burstNode) {
      burstNode.textContent = card.dataset.burst || "Unknown Burst";
    }

    cards.forEach((item) => {
      item.classList.toggle("active", item === card);
    });
  };

  cards.forEach((card) => {
    card.addEventListener("click", () => updateSpotlight(card));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        updateSpotlight(card);
      }
    });
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "all";

      filterButtons.forEach((node) => {
        node.classList.toggle("active", node === button);
      });

      cards.forEach((card) => {
        const matches = filter === "all" || card.dataset.element === filter;
        card.classList.toggle("is-hidden", !matches);
      });

      const selected = cards.find((card) => card.classList.contains("active") && !card.classList.contains("is-hidden"));
      if (selected) {
        updateSpotlight(selected);
        return;
      }

      const firstVisible = cards.find((card) => !card.classList.contains("is-hidden"));
      if (firstVisible) {
        updateSpotlight(firstVisible);
      }
    });
  });

  const initialCard = cards.find((card) => card.classList.contains("active")) || cards[0];
  updateSpotlight(initialCard);
}

function initWishSimulator() {
  const controls = Array.from(document.querySelectorAll("[data-pull]"));
  const pityNode = document.querySelector("[data-pity-count]");
  const resultList = document.querySelector("[data-wish-results]");

  if (!controls.length || !pityNode || !resultList) {
    return;
  }

  const fiveStarPool = ["Lyra Stormveil", "Kairo Embermace", "Eon Mariner"];
  const fourStarPool = ["Mira Tideshade", "Rook Granite", "Vexa Pulse", "Sorin Gale", "Nora Cinderfield"];
  const threeStarPool = ["Iron Pike", "Aster Tome", "Ranger Bow", "Silver Blade"];

  const pityStorage = "gamora-wish-pity";
  let pity = Number(readStorage(pityStorage, 0));

  const pullOnce = () => {
    pity += 1;

    let rarity = 3;
    const fiveStarChance = pity >= 80 ? 1 : pity >= 70 ? 0.24 : 0.06;
    const fourStarChance = 0.22;

    const roll = Math.random();

    if (roll < fiveStarChance) {
      rarity = 5;
      pity = 0;
    } else if (roll < fiveStarChance + fourStarChance) {
      rarity = 4;
    }

    let reward;
    if (rarity === 5) {
      reward = pickRandom(fiveStarPool);
    } else if (rarity === 4) {
      reward = pickRandom(fourStarPool);
    } else {
      reward = pickRandom(threeStarPool);
    }

    return { rarity, reward };
  };

  const renderResults = (entries) => {
    entries.reverse().forEach((entry) => {
      const line = document.createElement("li");
      line.classList.add(`rarity-${entry.rarity}`);
      line.textContent = `${entry.rarity}-star | ${entry.reward}`;
      resultList.prepend(line);
    });

    while (resultList.children.length > 12) {
      resultList.removeChild(resultList.lastElementChild);
    }
  };

  const refreshPity = () => {
    pityNode.textContent = String(pity);
    writeStorage(pityStorage, pity);
  };

  controls.forEach((button) => {
    button.addEventListener("click", () => {
      const amount = Number(button.dataset.pull || 1);
      const entries = [];

      for (let index = 0; index < amount; index += 1) {
        entries.push(pullOnce());
      }

      const emptyState = resultList.querySelector(".wish-empty");
      if (emptyState) {
        emptyState.remove();
      }

      renderResults(entries);
      refreshPity();
    });
  });

  refreshPity();
}

function initEventsPage() {
  const cards = Array.from(document.querySelectorAll(".event-card"));
  const filterButtons = Array.from(document.querySelectorAll("[data-event-filter]"));

  if (!cards.length) {
    return;
  }

  let activeFilter = "all";

  const liveCountNode = document.querySelector("[data-live-count]");
  const upcomingCountNode = document.querySelector("[data-upcoming-count]");
  const endedCountNode = document.querySelector("[data-ended-count]");

  const updateCards = () => {
    const now = Date.now();
    let liveCount = 0;
    let upcomingCount = 0;
    let endedCount = 0;

    cards.forEach((card) => {
      const start = Date.parse(card.dataset.start || "");
      const end = Date.parse(card.dataset.end || "");

      const countdownNode = card.querySelector("[data-countdown]");
      const statusNode = card.querySelector("[data-status-text]");
      const progressNode = card.querySelector("[data-progress]");

      let status = "ended";
      let countdownText = "Event closed";
      let progress = 100;

      if (Number.isFinite(start) && Number.isFinite(end)) {
        if (now < start) {
          status = "upcoming";
          countdownText = `Starts in ${formatDuration(start - now)}`;
          progress = 0;
          upcomingCount += 1;
        } else if (now <= end) {
          status = "live";
          countdownText = `Ends in ${formatDuration(end - now)}`;
          progress = ((now - start) / (end - start)) * 100;
          liveCount += 1;
        } else {
          status = "ended";
          countdownText = "Event closed";
          progress = 100;
          endedCount += 1;
        }
      }

      card.dataset.currentStatus = status;
      card.classList.remove("status-live", "status-upcoming", "status-ended");
      card.classList.add(`status-${status}`);

      if (statusNode) {
        statusNode.textContent = status;
      }

      if (countdownNode) {
        countdownNode.textContent = countdownText;
      }

      if (progressNode) {
        progressNode.style.width = `${Math.max(0, Math.min(100, progress)).toFixed(1)}%`;
      }
    });

    if (liveCountNode) {
      liveCountNode.textContent = String(liveCount);
    }

    if (upcomingCountNode) {
      upcomingCountNode.textContent = String(upcomingCount);
    }

    if (endedCountNode) {
      endedCountNode.textContent = String(endedCount);
    }

    applyEventFilter(cards, activeFilter);
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.eventFilter || "all";

      filterButtons.forEach((node) => {
        node.classList.toggle("active", node === button);
      });

      applyEventFilter(cards, activeFilter);
    });
  });

  initGemPlanner();
  updateCards();
  window.setInterval(updateCards, 1000);
}

function applyEventFilter(cards, filter) {
  cards.forEach((card) => {
    const typeMatch = card.dataset.eventType === filter;
    const statusMatch = card.dataset.currentStatus === filter;
    const show = filter === "all" || typeMatch || statusMatch;
    card.classList.toggle("is-hidden", !show);
  });
}

function initGemPlanner() {
  const slider = document.querySelector("[data-days-slider]");
  const dayOutput = document.querySelector("[data-days-output]");
  const totalOutput = document.querySelector("[data-gem-total]");
  const bonusChecks = Array.from(document.querySelectorAll("[data-bonus]"));

  if (!slider || !dayOutput || !totalOutput) {
    return;
  }

  const render = () => {
    const days = Number(slider.value);
    const base = days * 60;
    const bonuses = bonusChecks
      .filter((check) => check.checked)
      .reduce((sum, check) => sum + Number(check.dataset.bonus || 0), 0);

    dayOutput.textContent = String(days);
    totalOutput.textContent = String(base + bonuses);
  };

  slider.addEventListener("input", render);
  bonusChecks.forEach((check) => check.addEventListener("change", render));

  render();
}

function toLabel(value) {
  if (!value) {
    return "Unknown";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore write errors from private browsing or blocked storage.
  }
}

function formatDuration(ms) {
  if (ms <= 0) {
    return "0m";
  }

  const seconds = Math.floor(ms / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

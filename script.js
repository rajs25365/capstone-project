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

  if (page === "community") {
    initCommunityPage();
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
  initOpeningGate();
  initCinematicHero();
  initHomeLiveFeed();
  initHomeModeCards();
  initHomeCharacterPremiere();
  initHomeNewsTabs();
  initHomeRealmAtlas();
}

function initOpeningGate() {
  const gate = document.querySelector("[data-opening-gate]");
  const enterButton = document.querySelector("[data-opening-enter]");
  const skipButton = document.querySelector("[data-opening-skip]");

  if (!gate || !enterButton || !skipButton) {
    return;
  }

  const storageKey = "neon-opening-gate-seen";
  const hasSeenGate = readStorage(storageKey, false) === true;

  if (hasSeenGate) {
    gate.classList.add("is-hidden");
    return;
  }

  document.body.classList.add("gate-locked");

  const closeGate = () => {
    gate.classList.add("is-leaving");
    window.setTimeout(() => {
      gate.classList.add("is-hidden");
      document.body.classList.remove("gate-locked");
    }, 420);
    writeStorage(storageKey, true);
  };

  enterButton.addEventListener("click", closeGate);
  skipButton.addEventListener("click", closeGate);

  window.addEventListener("keydown", (event) => {
    if (gate.classList.contains("is-hidden")) {
      return;
    }

    if (event.key === "Enter") {
      closeGate();
    }
  });
}

function initHomeLiveFeed() {
  const feedNode = document.querySelector("[data-live-feed-text]");

  if (!feedNode) {
    return;
  }

  const messages = [
    "Live Feed: Fresh armored convoy job goes live in 02h 13m.",
    "Live Feed: Heist lobbies are hitting peak activity downtown.",
    "Live Feed: Midnight race season phase two starts tomorrow.",
    "Live Feed: Social Club tournament signups close in 8h.",
  ];

  let index = 0;
  feedNode.textContent = messages[index];

  window.setInterval(() => {
    index = (index + 1) % messages.length;
    feedNode.textContent = messages[index];
  }, 5200);
}

function initHomeModeCards() {
  const cards = Array.from(document.querySelectorAll("[data-mode-card]"));
  const hintNode = document.querySelector("[data-mode-hint]");

  if (!cards.length || !hintNode) {
    return;
  }

  const setMode = (card) => {
    cards.forEach((node) => {
      node.classList.toggle("is-active", node === card);
    });

    const title = card.dataset.modeTitle || "Mode";
    const desc = card.dataset.modeDesc || "No mode details available.";
    hintNode.textContent = `${title}: ${desc}`;
  };

  cards.forEach((card) => {
    card.addEventListener("click", () => setMode(card));
  });

  const initialCard = cards.find((card) => card.classList.contains("is-active")) || cards[0];
  setMode(initialCard);
}

function initCinematicHero() {
  const slides = Array.from(document.querySelectorAll("[data-hero-slide]"));
  const dots = Array.from(document.querySelectorAll("[data-hero-dot]"));
  const stage = document.querySelector("[data-cinematic-stage]");

  if (!slides.length) {
    return;
  }

  let index = slides.findIndex((slide) => slide.classList.contains("is-active"));
  if (index < 0) {
    index = 0;
  }

  let intervalId = null;

  const setActive = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === index);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === index);
    });
  };

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const nextIndex = Number(dot.dataset.heroDot || 0);
      setActive(nextIndex);
    });
  });

  const moveNext = () => {
    setActive(index + 1);
  };

  const stopAuto = () => {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  };

  const startAuto = () => {
    stopAuto();
    intervalId = window.setInterval(moveNext, 6500);
  };

  if (stage) {
    stage.addEventListener("mouseenter", stopAuto);
    stage.addEventListener("mouseleave", startAuto);
  }

  setActive(index);
  startAuto();
}

function initHomeCharacterPremiere() {
  const cards = Array.from(document.querySelectorAll(".home-char-card"));
  const imageNode = document.querySelector("[data-home-char-image]");
  const nameNode = document.querySelector("[data-home-char-name]");
  const roleNode = document.querySelector("[data-home-char-role]");
  const loreNode = document.querySelector("[data-home-char-lore]");
  const tagNode = document.querySelector("[data-home-char-elements]");

  if (!cards.length || !imageNode || !nameNode || !roleNode || !loreNode || !tagNode) {
    return;
  }

  const updateSpotlight = (card) => {
    const name = card.dataset.charName || "Unknown Crew Member";
    const role = card.dataset.charRole || "Unknown Role";
    const lore = card.dataset.charLore || "No lore available.";
    const image = card.dataset.charImage || imageNode.src;
    const tags = String(card.dataset.charElements || "").split("|").filter((tag) => tag.trim().length > 0);

    cards.forEach((node) => {
      node.classList.toggle("is-active", node === card);
    });

    nameNode.textContent = name;
    roleNode.textContent = role;
    loreNode.textContent = lore;
    imageNode.src = image;
    imageNode.alt = `${name} spotlight portrait`;

    tagNode.innerHTML = tags.map((tag) => `<span class="chip">${tag}</span>`).join("");
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

  const initialCard = cards.find((card) => card.classList.contains("is-active")) || cards[0];
  updateSpotlight(initialCard);
}

function initHomeNewsTabs() {
  const buttons = Array.from(document.querySelectorAll("[data-news-tab-button]"));
  const panes = Array.from(document.querySelectorAll("[data-news-pane]"));

  if (!buttons.length || !panes.length) {
    return;
  }

  const activate = (tab) => {
    buttons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.newsTabButton === tab);
    });

    panes.forEach((pane) => {
      pane.classList.toggle("is-active", pane.dataset.newsPane === tab);
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      activate(button.dataset.newsTabButton || "updates");
    });
  });

  const initialButton = buttons.find((button) => button.classList.contains("is-active")) || buttons[0];
  activate(initialButton.dataset.newsTabButton || "updates");
}

function initHomeRealmAtlas() {
  const regionButtons = Array.from(document.querySelectorAll("[data-region-node]"));
  const nameNode = document.querySelector("[data-region-name-display]");
  const descNode = document.querySelector("[data-region-desc-display]");
  const progressNode = document.querySelector("[data-region-progress-display]");
  const threatNode = document.querySelector("[data-region-threat-display]");
  const barNode = document.querySelector("[data-region-progress-bar]");
  const tagsNode = document.querySelector("[data-region-tags]");

  if (!regionButtons.length || !nameNode || !descNode || !progressNode || !threatNode || !barNode || !tagsNode) {
    return;
  }

  const renderRegion = (button) => {
    regionButtons.forEach((node) => {
      node.classList.toggle("is-active", node === button);
    });

    const name = button.dataset.regionName || "Unknown Region";
    const desc = button.dataset.regionDesc || "No region details available.";
    const threat = button.dataset.regionThreat || "Unlisted";
    const progress = Number(button.dataset.regionProgress || 0);
    const tags = String(button.dataset.regionFocus || "").split("|").filter((tag) => tag.trim().length > 0);

    nameNode.textContent = name;
    descNode.textContent = desc;
    threatNode.textContent = threat;
    progressNode.textContent = `${Math.max(0, Math.min(100, progress))}%`;
    barNode.style.width = `${Math.max(0, Math.min(100, progress))}%`;
    tagsNode.innerHTML = tags.map((tag) => `<span class="chip">${tag}</span>`).join("");
  };

  regionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      renderRegion(button);
    });
  });

  const initialButton = regionButtons.find((button) => button.classList.contains("is-active")) || regionButtons[0];
  renderRegion(initialButton);
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
  const storageKey = "neon-commission-state";

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

function initCommunityPulse() {
  const statusBadge = document.querySelector("[data-server-status-badge]");
  const onlineCount = document.querySelector("[data-online-count]");
  const lfgCount = document.querySelector("[data-lfg-count]");

  if (!statusBadge && !onlineCount && !lfgCount) {
    return;
  }

  const states = [
    { key: "status-online", label: "Online", weight: 0.72 },
    { key: "status-busy", label: "High Traffic", weight: 0.23 },
    { key: "status-maintenance", label: "Maintenance", weight: 0.05 },
  ];

  const pickState = () => {
    const roll = Math.random();
    let cursor = 0;

    for (const state of states) {
      cursor += state.weight;
      if (roll <= cursor) {
        return state;
      }
    }

    return states[0];
  };

  const renderPulse = () => {
    const hour = new Date().getHours();
    const base = 1800 + Math.floor(Math.max(0, Math.sin((hour / 24) * Math.PI * 2)) * 900);
    const online = base + Math.floor(Math.random() * 600);
    const lfg = Math.max(120, Math.floor(online * 0.13) + Math.floor(Math.random() * 100));
    const state = pickState();

    if (statusBadge) {
      statusBadge.textContent = state.label;
      statusBadge.classList.remove("status-online", "status-busy", "status-maintenance");
      statusBadge.classList.add(state.key);
    }

    if (onlineCount) {
      onlineCount.textContent = online.toLocaleString();
    }

    if (lfgCount) {
      lfgCount.textContent = lfg.toLocaleString();
    }
  };

  renderPulse();
  window.setInterval(renderPulse, 12000);
}

function initCharacterPage() {
  initRosterSelection();
  initWishSimulator();
  initSquadBuilder();
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
      nameNode.textContent = card.dataset.name || "Unknown Crew Member";
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
      imageNode.alt = `${card.dataset.name || "Crew Member"} portrait`;
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

  const fiveStarPool = ["Rico Vega", "Dante Blaze", "Ace Marino"];
  const fourStarPool = ["Maya Cruz", "Bruno Steel", "Vee Sparks", "Jax Mercer", "Nina Volt"];
  const threeStarPool = ["Street Pistol", "Budget SMG", "Compact Shotgun", "Iron Bat"];

  const pityStorage = "neon-crate-pity";
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

function initSquadBuilder() {
  const slots = Array.from(document.querySelectorAll("[data-team-slot]"));
  const resultNode = document.querySelector("[data-team-result]");
  const tagsNode = document.querySelector("[data-team-tags]");
  const autoButton = document.querySelector("[data-auto-team]");

  if (!slots.length || !resultNode || !tagsNode) {
    return;
  }

  const roster = Array.from(document.querySelectorAll(".roster-card")).map((card) => ({
    name: card.dataset.name || "",
    element: card.dataset.element || "",
    role: card.dataset.role || "",
    rarity: Number(card.dataset.rarity || 4),
  }));

  const options = roster
    .map((member) => `<option value="${member.name}">${member.name}</option>`)
    .join("");

  slots.forEach((slot) => {
    slot.innerHTML = `<option value="">Choose crew member</option>${options}`;
    slot.addEventListener("change", renderTeam);
  });

  if (autoButton) {
    const metaTeam = ["Rico Vega", "Dante Blaze", "Maya Cruz", "Ace Marino"];
    autoButton.addEventListener("click", () => {
      slots.forEach((slot, index) => {
        slot.value = metaTeam[index] || "";
      });
      renderTeam();
    });
  }

  function renderTeam() {
    const selected = slots
      .map((slot) => roster.find((member) => member.name === slot.value))
      .filter((item) => Boolean(item));

    if (selected.length < 4) {
      resultNode.textContent = `Select ${4 - selected.length} more crew members to score this crew.`;
      tagsNode.innerHTML = "";
      return;
    }

    const selectedNames = selected.map((item) => item.name);
    const hasDuplicate = selectedNames.some((name, index) => selectedNames.indexOf(name) !== index);

    if (hasDuplicate) {
      resultNode.textContent = "Duplicate picks detected. Use four unique crew members for a valid lineup.";
      tagsNode.innerHTML = '<span class="chip">Invalid composition</span>';
      return;
    }

    const elementCounts = selected.reduce((acc, member) => {
      acc[member.element] = (acc[member.element] || 0) + 1;
      return acc;
    }, {});

    const tags = [];
    let score = 40;

    const rarityScore = selected.reduce((sum, member) => sum + member.rarity, 0);
    score += rarityScore * 6;

    const hasRolePairing = Object.values(elementCounts).some((count) => count >= 2);
    if (hasRolePairing) {
      tags.push("Role pairing bonus");
      score += 10;
    }

    if (elementCounts.wheelman && elementCounts.hacker) {
      tags.push("Clean getaway protocol");
      score += 9;
    }

    if (elementCounts.muscle && elementCounts.shooter) {
      tags.push("Heavy pressure combo");
      score += 11;
    }

    if (elementCounts.scout && elementCounts.hacker) {
      tags.push("Intel control package");
      score += 8;
    }

    const uniqueElements = Object.keys(elementCounts).length;
    if (uniqueElements >= 3) {
      tags.push("Flexible crew coverage");
      score += 8;
    }

    const roleCoverage = new Set(selected.map((member) => member.role.toLowerCase()));
    if ([...roleCoverage].some((role) => role.includes("hacker") || role.includes("scout") || role.includes("planner"))) {
      tags.push("Intel network ready");
      score += 6;
    }

    score = Math.max(0, Math.min(100, score));

    const rank =
      score >= 90 ? "S Tier" :
      score >= 80 ? "A Tier" :
      score >= 70 ? "B Tier" : "C Tier";

    resultNode.textContent = `Crew score ${score}/100 | ${rank} setup for high-heat city jobs.`;

    tagsNode.innerHTML = tags.map((tag) => `<span class="chip">${tag}</span>`).join("");
  }

  renderTeam();
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
      let countdownText = "Job closed";
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
          countdownText = "Job closed";
          progress = 100;
          endedCount += 1;
        }
      }

      card.dataset.currentStatus = status;
      card.classList.remove("status-live", "status-upcoming", "status-ended");
      card.classList.add(`status-${status}`);

      if (statusNode) {
        const statusLabel =
          status === "live" ? "Live Job" :
          status === "upcoming" ? "Incoming" : "Closed";
        statusNode.textContent = statusLabel;
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
  initCoopQueue();
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

function initCoopQueue() {
  const form = document.querySelector("[data-coop-form]");
  const list = document.querySelector("[data-coop-list]");
  const countNode = document.querySelector("[data-coop-count]");

  if (!form || !list || !countNode) {
    return;
  }

  const storageKey = "neon-coop-queue";
  let entries = readStorage(storageKey, []);

  if (!Array.isArray(entries)) {
    entries = [];
  }

  entries = entries
    .filter((entry) => entry && entry.alias && entry.role && entry.region)
    .slice(0, 12);

  const renderQueue = () => {
    list.innerHTML = "";

    if (!entries.length) {
      const empty = document.createElement("li");
      empty.className = "fan-empty";
      empty.textContent = "No crew entries yet. Add your role to start a run.";
      list.appendChild(empty);
    } else {
      entries.forEach((entry, index) => {
        const item = document.createElement("li");
        item.className = "queue-item";

        const line = document.createElement("span");
        const ago = entry.createdAt ? formatElapsed(Date.now() - entry.createdAt) : "just now";
        line.textContent = `${entry.alias} | ${entry.role} | ${entry.region} | ${ago}`;

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.textContent = "Remove";
        removeButton.dataset.removeIndex = String(index);

        item.appendChild(line);
        item.appendChild(removeButton);
        list.appendChild(item);
      });
    }

    countNode.textContent = String(entries.length);
    writeStorage(storageKey, entries);
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const alias = String(formData.get("alias") || "").trim().slice(0, 20);
    const role = String(formData.get("role") || "").trim();
    const region = String(formData.get("region") || "").trim();

    if (!alias || !role || !region) {
      return;
    }

    entries.unshift({
      alias,
      role,
      region,
      createdAt: Date.now(),
    });

    entries = entries.slice(0, 12);
    form.reset();
    renderQueue();
  });

  list.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) {
      return;
    }

    const index = Number(target.dataset.removeIndex);
    if (Number.isNaN(index) || index < 0 || index >= entries.length) {
      return;
    }

    entries.splice(index, 1);
    renderQueue();
  });

  renderQueue();
}

function initCommunityPage() {
  initCommunityVote();
  initFanWall();
  initSpotlightCarousel();
  initCommunityHeaderPulse();
}

function initCommunityVote() {
  const buttons = Array.from(document.querySelectorAll("[data-vote-button]"));

  if (!buttons.length) {
    return;
  }

  const storageKey = "neon-community-votes";
  const defaultVotes = {
    burst: 12,
    carry: 8,
    reaction: 10,
    beginner: 6,
  };

  const storedVotes = readStorage(storageKey, defaultVotes);
  const votes = {
    burst: Number(storedVotes.burst || 0),
    carry: Number(storedVotes.carry || 0),
    reaction: Number(storedVotes.reaction || 0),
    beginner: Number(storedVotes.beginner || 0),
  };

  const renderVotes = () => {
    const total = Object.values(votes).reduce((sum, count) => sum + count, 0);

    Object.keys(votes).forEach((key) => {
      const countNode = document.querySelector(`[data-vote-count="${key}"]`);
      const barNode = document.querySelector(`[data-vote-bar="${key}"]`);
      const percent = total > 0 ? (votes[key] / total) * 100 : 0;

      if (countNode) {
        countNode.textContent = String(votes[key]);
      }

      if (barNode) {
        barNode.style.width = `${percent.toFixed(1)}%`;
      }
    });

    writeStorage(storageKey, votes);
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.voteButton || "";
      if (!Object.prototype.hasOwnProperty.call(votes, key)) {
        return;
      }

      votes[key] += 1;
      renderVotes();
    });
  });

  renderVotes();
}

function initFanWall() {
  const form = document.querySelector("[data-fan-form]");
  const list = document.querySelector("[data-fan-list]");

  if (!form || !list) {
    return;
  }

  const storageKey = "neon-fan-wall";
  let posts = readStorage(storageKey, []);

  if (!Array.isArray(posts)) {
    posts = [];
  }

  posts = posts
    .filter((entry) => entry && entry.alias && entry.message)
    .slice(0, 12);

  const renderWall = () => {
    list.innerHTML = "";

    if (!posts.length) {
      const empty = document.createElement("li");
      empty.className = "fan-empty";
      empty.textContent = "No street feed posts yet. Be the first to post.";
      list.appendChild(empty);
      return;
    }

    posts.forEach((post) => {
      const item = document.createElement("li");
      item.className = "fan-item";

      const head = document.createElement("strong");
      const timestamp = post.createdAt ? formatElapsed(Date.now() - post.createdAt) : "just now";
      head.textContent = `${post.alias} | ${timestamp}`;

      const message = document.createElement("span");
      message.textContent = post.message;

      item.appendChild(head);
      item.appendChild(message);
      list.appendChild(item);
    });

    writeStorage(storageKey, posts);
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const alias = String(formData.get("alias") || "").trim().slice(0, 20);
    const message = String(formData.get("message") || "").trim().slice(0, 140);

    if (!alias || !message) {
      return;
    }

    posts.unshift({
      alias,
      message,
      createdAt: Date.now(),
    });

    posts = posts.slice(0, 12);
    form.reset();
    renderWall();
  });

  renderWall();
}

function initSpotlightCarousel() {
  const track = document.querySelector("[data-spotlight-track]");
  const prevButton = document.querySelector("[data-spot-prev]");
  const nextButton = document.querySelector("[data-spot-next]");

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
    intervalId = window.setInterval(goNext, 6500);
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

function initCommunityHeaderPulse() {
  const statusNode = document.querySelector("[data-community-status]");
  const membersNode = document.querySelector("[data-community-members]");

  if (!statusNode || !membersNode) {
    return;
  }

  const states = [
    { className: "status-online", label: "Lobbies live" },
    { className: "status-busy", label: "Peak traffic" },
    { className: "status-online", label: "Heist queues open" },
  ];

  const update = () => {
    const state = states[Math.floor(Math.random() * states.length)];
    const members = 2100 + Math.floor(Math.random() * 900);

    statusNode.textContent = state.label;
    statusNode.classList.remove("status-online", "status-busy", "status-maintenance");
    statusNode.classList.add(state.className);
    membersNode.textContent = members.toLocaleString();
  };

  update();
  window.setInterval(update, 15000);
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

function formatElapsed(ms) {
  if (ms <= 0) {
    return "just now";
  }

  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) {
    return "just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
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

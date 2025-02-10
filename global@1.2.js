function testLog() {
  console.log("code sandbox connected!");
}

// gsap defaults
gsap.defaults({
  ease: "power2.inOut",
  duration: 0.3,
});

///////////////////////////////////
// utility & animation functions //
///////////////////////////////////

// lenis init
var lenisMain;
function initLenisMain() {
  gsap.registerPlugin(ScrollTrigger);
  if (lenisMain) {
    lenisMain.destroy();
  }
  lenisMain = new Lenis({
    lerp: 0.95,
    smooth: true,
    autoResize: true,
  });

  lenisMain.on("scroll", (e) => {
    ScrollTrigger.update();
  });

  const loop = (time) => {
    lenisMain.raf(time);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  if (window.location.pathname == "/") {
    lenisMain.stop();
  }
}

// animate images on hover on work page
function workImages(page) {
  if (window.innerWidth < 992) return;
  function randomPos() {
    let min = 16;
    let max = window.innerWidth / 2 - 400;
    let randomNumber = Math.ceil(Math.random() * (max - min) + min);
    return randomNumber;
  }

  let projects = page.querySelectorAll(".work_item-wrapper");

  projects.forEach((project) => {
    let image = project.querySelector(".work_cover-image-frame");
    let title = project.querySelector(".work_caption-wrapper");

    let hoverTl;

    project.addEventListener("mouseenter", () => {
      if (hoverTl) {
        hoverTl.pause();
      }
      hoverTl = gsap.timeline();
      hoverTl.set(image, {
        display: "flex",
        align: "center",
        right: randomPos(),
        opacity: 0,
      });
      hoverTl.to(image, { opacity: 1, duration: 0.1 });
      hoverTl.to(title, { y: "0.2rem", duration: 0.2 });
    });

    project.addEventListener("mouseleave", () => {
      if (hoverTl) {
        hoverTl.pause();
      }
      hoverTl = gsap.timeline();
      hoverTl.to(image, { opacity: 0, duration: 0.1 });
      hoverTl.to(title, { y: "" });
      hoverTl.set(image, { display: "none" });
    });
  });
}

// enumerate projects on work page
function workEnumerate(page) {
  let indexFields = page.querySelectorAll(".work_index-wrapper");

  indexFields.forEach((indexField, num) => {
    let index;
    if (num < 9) {
      index = "0" + (num + 1).toString();
    } else {
      index = (num + 1).toString();
    }

    indexField.innerHTML = index;
  });

  gsap.to(indexFields, {
    opacity: 1,
    duration: 0.1,
  });
}

// rock animation on about page
let rockTl = gsap.timeline();
function flyingRock(page) {
  return; // animation disabled. Remove this line to re-enable
  let image = page.querySelector(".stone-animation_stone-wrapper");
  if (!image) {
    return;
  }
  let vw = window.innerWidth;
  let vh = window.innerHeight;
  let timeMod = 1;

  // make the rock slower for bigger screens
  if (window.innerWidth > 1550) {
    timeMod = window.innerWidth / 1550;
  }

  if (rockTl.isActive()) {
    rockTl.kill();
    rockTl = gsap.timeline();
  }

  rockTl
    .set(image, { display: "block", x: "-15rem", y: "5rem", rotation: "0" })
    .to(image, {
      x: vw,
      y: vh / 2,
      rotation: "360",
      duration: 3 * timeMod,
      ease: "linear",
      delay: 3,
    })
    .set(image, { y: vh * 0.2, delay: 3 })
    .to(image, {
      x: "-15rem",
      y: vh * 0.8,
      rotation: "-90",
      duration: 3 * timeMod,
      ease: "linear",
    })
    .set(image, { x: vw / 2, y: vh, delay: 2 })
    .to(image, {
      x: vw * 0.8,
      y: "-15rem",
      rotation: "90",
      duration: 4 * timeMod,
      ease: "linear",
    })
    .set(image, { x: vw * 0.6, y: "-15rem", delay: 2 })
    .to(image, {
      x: "-15rem",
      y: vh * 0.7,
      rotation: "220",
      duration: 3 * timeMod,
      ease: "linear",
    })
    .repeat(-1);
}

// Vimeo video functionality via Player SDK
let vimeoVideoContainers = null;
let vimeoPlayers = [];
function videos(page) {
  if (vimeoVideoContainers) {
    vimeoVideoContainers = null;
    vimeoPlayers.forEach((player) => {
      player.destroy();
      vimeoPlayers = [];
    });
  }
  vimeoVideoContainers = page.querySelectorAll("[vimeo_id]");

  vimeoVideoContainers.forEach((videoContainer) => {
    let vimeoId = videoContainer.getAttribute("vimeo_id");
    if (!vimeoId) {
      return;
    }

    let settings = {
      id: vimeoId,
      width: videoContainer.offsetWidth,
      quality: "1080p",
      background: true,
      dnt: true, // Prevent the player from tracking session data
    };

    let player = new Vimeo.Player(videoContainer.firstElementChild, settings);

    player.setQuality("1080p");

    player.on("play", () => {
      Promise.all([player.getVideoWidth(), player.getVideoHeight()]).then();
      gsap.to(videoContainer, { opacity: 1 });
    });
    vimeoPlayers.push(player);
  });
}

// project page, previous / next project buttons functionality
function navigationButtons(page) {
  let nexthref =
    page
      .querySelector("#post_list .w--current")
      ?.parentElement?.nextElementSibling?.querySelector("a")
      ?.getAttribute("href") ||
    page
      .querySelector("#post_list")
      ?.firstElementChild?.firstElementChild?.querySelector("a")
      ?.getAttribute("href");

  let previoushref =
    page
      .querySelector("#post_list .w--current")
      ?.parentElement?.previousElementSibling?.querySelector("a")
      ?.getAttribute("href") ||
    page
      .querySelector("#post_list")
      ?.firstElementChild?.lastElementChild?.querySelector("a")
      ?.getAttribute("href");

  let nextButton = page.querySelector("#next_button");
  if (nextButton) {
    if (nexthref == null) {
      nexthref = "#";
      gsap.set(nextButton, { display: "none" });
    }
    nextButton.href = nexthref;
  }
  let previousButton = page.querySelector("#previous_button");
  if (previousButton) {
    if (previoushref == null) {
      previoushref = "#";
      gsap.set(previousButton, { display: "none" });
    }
    previousButton.href = previoushref;
  }
}

// auto play video on home page
function homeVideoPlay(page) {
  let videos = page.querySelectorAll("video");
  if (videos) {
    videos.forEach((video) => {
      video.play();
    });
  }
}

function homeLogo(page) {
  let logo = page.querySelector(".hero_logo");
  let tl = gsap.timeline();

  tl.set(logo, { opacity: 1 });
}

// scale image on about page
function scaleImage(page) {
  setTimeout(() => {
    gsap.registerPlugin(ScrollTrigger);

    let image = page.querySelector(".about_photograph-wrapper");
    gsap.set(image, { transformOrigin: "bottom center" });

    gsap.to(image, {
      scale: 0,
      ease: "none",
      scrollTrigger: {
        trigger: image,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, 0);
}

// resize function
function resize() {
  flyingRock(document);
  videos(document);
}

///////////
// barba //
///////////

barba.init({
  views: [
    {
      namespace: "home",
      afterEnter(data) {
        homeInit(data.next.container);
      },
    },
    {
      namespace: "work",
      async beforeEnter(data) {
        workInit(data.next.container);
        let logo = document.querySelector(".footer_logo-wrapper");
        await gsap.to(logo, { opacity: 0, height: 0, duration: 0.2 });
        gsap.set(logo, { display: "none" });
      },
      afterLeave() {
        let logo = document.querySelector(".footer_logo-wrapper");
        gsap.set(logo, { display: "block" });
        gsap.to(logo, { opacity: 1, height: "", duration: 0.2 });
      },
    },
    {
      namespace: "about",
      afterEnter(data) {
        aboutInit(data.next.container);
      },
    },
    {
      namespace: "project-page",
      beforeEnter(data) {
        projectPageInit(data.next.container);
      },
    },
  ],
  transitions: [
    {
      name: "default-transition",
      async leave(data) {
        let page = data.current.container;
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        await gsap.to(page, { opacity: 0, duration: 0.1, ease: "power2.out" });
      },
      enter(data) {
        let page = data.next.container;
        let footer = document.querySelector(".footer");
        gsap.set([page, footer], { opacity: 0 });
        gsap.to(page, { opacity: 1, duration: 0.6, ease: "power2.out" });
        gsap.to(footer, {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.3,
        });
        initLenisMain();
        lenisMain.scrollTo(0);
      },
      afterEnter(data) {
        page = data.next.container;
        page.querySelectorAll("img").forEach((img) => {
          img.addEventListener("load", () => {
            lenisMain.resize();
          });
        });
      },
    },
    {
      to: {
        namespace: ["home"],
      },
      once() {
        let page = document.querySelector(".page-wrapper");
        let entryTl = gsap.timeline();
        entryTl.to(page, { opacity: 1, duration: 0.6, ease: "power2.out" });
      },
    },
  ],
});

////////////////////
// init functions //
////////////////////

function mainInit() {
  testLog();
  initLenisMain();
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("load", () => {
      lenisMain.resize();
    });
  });

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resize();
    }, 300);
  });
}

function workInit(page) {
  workImages(page);
  workEnumerate(page);
}

function projectPageInit(page) {
  videos(page);
  navigationButtons(page);
}

function aboutInit(page) {
  scaleImage(page);
  flyingRock(page);
}

function homeInit(page) {
  homeVideoPlay(page);
  homeLogo(page);
  gsap.to("#hero_links", { pointerEvents: "auto" });
}

///////////////
// main body //
///////////////

document.addEventListener("DOMContentLoaded", mainInit);

"use strict";

const header = document.querySelector(".header");

const nav = document.querySelector(".nav");
const navToggle = document.querySelector(".nav__toggle");
const navLink = document.querySelector(".nav__links");

const btnScroll = document.querySelector(".btn--scroll-to");
const btnOpenModal = document.querySelectorAll(".btn--show-modal");
const btnCloseModal = document.querySelector(".btn--close-modal");

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

const allSections = document.querySelectorAll(".section");
const section1 = document.getElementById("section--1");

const tabContainer = document.querySelector(".operations__tab-container");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContent = document.querySelectorAll(".operations__content")

const slides = document.querySelectorAll(".slide");

const arrowUp = document.querySelector('.arrow')

// navigation toggle
navToggle.addEventListener("click", (e) => {
	e.preventDefault();
	navLink.classList.toggle("active");
});

// button scroll to
btnScroll.addEventListener("click", () => {
	section1.scrollIntoView({ behavior: "smooth" });
});

// button close modal
const openModal = (e) => {
	e.preventDefault();
	modal.classList.remove("hidden");
	overlay.classList.remove("hidden");
};
const closeModal = () => {
	modal.classList.add("hidden");
	overlay.classList.add("hidden");
};
btnOpenModal.forEach((btn) => btn.addEventListener("click", openModal));
btnCloseModal.addEventListener("click", closeModal);
document.addEventListener('keydown', e=>{
  if(e.key === 'Escape') closeModal()
})
overlay.addEventListener('click', closeModal)

///////////////////////////////////
// sticky nav
const navHeight = nav.getBoundingClientRect().height;
const stickNav = (entries) => {
	const [entry] = entries;

	if (!entry.isIntersecting) { 
		nav.classList.add("sticky");

		arrowUp.classList.remove("arrow--hidden");
	} else {
		 nav.classList.remove("sticky");
		arrowUp.classList.add('arrow--hidden')
	}
};

const headerObserver = new IntersectionObserver(stickNav, {
	root: null,
	threshold: 0,
	rootMargin: `${-navHeight}px`,
});
headerObserver.observe(header);

// navigation link scroll to section
navLink.addEventListener("click", (e) => {
	e.preventDefault();
	if (e.target.classList.contains("nav__link")) {
    if(e.target.getAttribute('href') === '#') return

		const id = e.target.getAttribute("href");
		document.querySelector(id).scrollIntoView({ behavior: "smooth" });

    navLink.classList.remove('active')
	} 
});

// animation fade navigation
const handleHover = function (e) {
	if (e.target.classList.contains("nav__link")) {
		const link = e.target;
		const siblings = link.closest(".nav").querySelectorAll(".nav__link");
		const logo = link.closest(".nav").querySelector("img");

		siblings.forEach(sibling => {
			if (sibling !== link) sibling.style.opacity = this; 
		});
		logo.style.opacity = this;
	}
};

nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

// reveal section
const revealSection = (entries, observer) => {
	const [entry] = entries;
	if (!entry.isIntersecting) return; // when the first start load the page, the intersection = false
	// we get target section
	entry.target.classList.remove("section--hidden"); // when we scroll up and down back and forth its fire up every time
	observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
	root: null,
	threshold: 0.15,
});

allSections.forEach((section) => {
	sectionObserver.observe(section);
	section.classList.add("section--hidden");
});


// tab
tabContainer.addEventListener("click", (e) => {
	const clicked = e.target.closest(".operations__tab"); 

	tabs.forEach((tab) => tab.classList.remove("operations__tab--active")); 
	tabsContent.forEach((content) =>
		content.classList.remove("operations__content--active")
	); 

	clicked.classList.add("operations__tab--active");

	document
		.querySelector(`.operations__content--${clicked.dataset.tab}`)
		.classList.add("operations__content--active");
});

// slider
const slider = ()=>{
	const btnLeft = document.querySelector(".slider__btn--left");
	const btnRight = document.querySelector(".slider__btn--right");
	const dotsContainer = document.querySelector(".dots");
	let curSlide = 0;

	const createDots = () => {
		slides.forEach((_, i) => {
			dotsContainer.insertAdjacentHTML(
				"beforeend",
				`<button class="dots__dot" data-slide = "${i}"></button>`
			);
		});
	};

	const activateDot = (curSlide) => {
		document.querySelectorAll(".dots__dot").forEach((dot) => {
			dot.classList.remove("dots__dot--active");
		});
		document
			.querySelector(`.dots__dot[data-slide="${curSlide}"]`) // dataset selector
			.classList.add("dots__dot--active");
	};

	const goToSlide = (curSlide) => {
		slides.forEach(
			(slide, i) =>
				(slide.style.transform = `translateX(${100 * (i - curSlide)}%)`) // 100 * (0-1)
		);
	};

	const nextSlide = () => {
		curSlide === slides.length - 1 ? (curSlide = 0) : curSlide++;
		goToSlide(curSlide);
		activateDot(curSlide);
	};

	const prevSlide = () => {
		curSlide === 0 ? (curSlide = slides.length - 1) : curSlide--;
		goToSlide(curSlide);
		activateDot(curSlide);
	};

	const init = () => {
		goToSlide(0);
		createDots();
		activateDot(0);
	};
	init();

	btnRight.addEventListener("click", nextSlide);
	btnLeft.addEventListener("click", prevSlide);
}
slider()

arrowUp.addEventListener('click', () =>{
	header.scrollIntoView({ behavior: "smooth" });
} )

// lazy img
const imgTargets = document.querySelectorAll("img[data-src]");

const loadImg = function(entries, observer) {
	const [entry] = entries
	if(!entry.isIntersecting) return
	entry.target.src = entry.target.dataset.src

	entry.target.addEventListener('load', ()=> {
		entry.target.classList.remove('lazy-img')
	})
	observer.unobserve(entry.target);
}
const imgObserver = new IntersectionObserver(loadImg, {
	root: null,
	threshold: 0,
	rootMargin: '200px'
})
imgTargets.forEach((img) => imgObserver.observe(img));

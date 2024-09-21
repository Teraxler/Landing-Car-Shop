"use strict";

const dropDownBtns = getAllElementsByClass("drop-down__btn");

const dropDownListItems = getAllElementsByClass("drop-down__list-item");

const carStatusBtn = getAllElementsByClass("car-status");

const mobileMenu = getElementByClass("mobile-menu");
const bgOverlay = getElementByClass("bg-overlay");

const openMenuIcon = getElementByClass("open-menu-icon");
const closeMenuIcon = document.getElementById("close-menu-icon");

const searchBtn = document.getElementById("search-btn");

//
const MAX_BRANDS_COUNT = 6;

let cars, brands, customers, blogs;

// Fetch
async function fetchData(url, options) {
  let data;

  data = await fetch(url, options);
  console.log("Data:", data);

  data = await data.json();
  console.log("data =>", data);

  return data;
}

// === Functions ===

// Public functions
function getElementByClass(className) {
  let elm = document.getElementsByClassName(className)[0];

  !elm ? console.error("Class:", className, "Is wrong!") : null;

  return elm;
}

function getAllElementsByClass(className) {
  let elms = [...document.getElementsByClassName(className)];

  !elms[0] ? console.error("Class:", className, "Is wrong!") : null;

  return elms;
}

function removeClass(className, elm = null) {
  let elms;

  if (elm) {
    elm.classList.remove(className);
  } else {
    elms = document.getElementsByClassName(className);
    for (const elm of elms) {
      elm.classList.remove(className);
    }
  }
}

function toggleClass(className, elm) {
  elm.classList
    ? elm.classList.toggle(className)
    : console.error(elm, "toggle class =>", className, "Error");
}

function numberSeparator(num) {
  let strNum = num.toString(),
    result = "";

  for (let i = 1; i < strNum.length; i++) {
    result = strNum[strNum.length - i] + result;

    if (i % 3 === 0) {
      result = "," + result;
    }
  }

  return strNum[0] + result;
}

// Main Functions
function selectDropDownItem(event) {
  let label,
    target = event.target;

  console.log(target);
  if (target.tagName === "LI") {
    label = event.target.parentElement.previousElementSibling;
    console.log(event.target.textContent);

    console.log(label);
    label.textContent = event.target.textContent;
    removeClass("drop-down__list-item--active");
    // return event.target.textContent
  }
}

function openDropDown(e) {
  removeClass("drop-down__list-item--active");

  let submenu = e.currentTarget.nextElementSibling;

  submenu.classList.add("drop-down__list-item--active");
}

function closeMenu() {
  removeClass("mobile-menu--show", mobileMenu);
  bgOverlay.classList.add("hidden");
}

function openMenu() {
  removeClass("hidden", bgOverlay);
  mobileMenu.classList.add("mobile-menu--show");
}

function redirectPage() {
  const labelMaker = document.getElementById("label-maker");
  const labelPrice = document.getElementById("label-price");
  const labelModel = document.getElementById("label-model");

  let price, model, brand;

  brand = labelMaker.textContent.trim();
  model = labelModel.textContent.trim();
  price = labelPrice.textContent.trim();

  location.replace(
    `http://127.0.0.1:5500/public/index.html?brand=${brand}&model=${model}&price=${price}`
  );
}

function updateSlidePosition(swiperWrapper, currentIndex) {
  let gap = 16;
  // console.log(window.innerWidth);

  window.innerWidth >= 768 ? (gap = 30) : (gap = 16);

  swiperWrapper.style.transform = `translateX(calc(-${currentIndex * 100}% - ${
    currentIndex * gap
  }px))`;
}

function toggleBookmarkIcon(e) {
  e.preventDefault();
  let useElm = e.currentTarget.children[0].children[0];

  if (useElm.getAttribute("href") === "#bookmark") {
    useElm.setAttribute("href", "#bookmark-solid");
  } else {
    useElm.setAttribute("href", "#bookmark");
  }
  console.log(useElm.getAttribute("href"));
}

// Calculateor
function calcMaxSlides(amountItems, itemsPerSlide) {
  return Math.ceil(amountItems / itemsPerSlide);
}

function calcDiscount(price, percent) {
  percent = percent > 100 ? 100 : percent;

  return price - (price * percent) / 100;
}

function calcAmountItemsPerSlide(swiperId) {
  let itemsPerSlide,
    windowWidth = window.innerWidth;

  if (swiperId === "all-vehicles-wrapper") {
    console.log(windowWidth);

    if (windowWidth >= 1280) {
      itemsPerSlide = 4;
      console.log("items", itemsPerSlide);
    } else if (windowWidth >= 768) {
      itemsPerSlide = 3;
      console.log("items", itemsPerSlide);
    } else if (windowWidth >= 480) {
      itemsPerSlide = 2;
      console.log("items", itemsPerSlide);
    } else {
      itemsPerSlide = 1;
      console.log("items", itemsPerSlide);
    }
  } else if (swiperId === "popular-makers-wrapper") {
    if (windowWidth >= 768) {
      itemsPerSlide = 2;
      console.log("items", itemsPerSlide);
    } else {
      itemsPerSlide = 1;
      console.log("items", itemsPerSlide);
    }
  } else if (swiperId === "comments-wrapper") {
    itemsPerSlide = 1;
  }

  return itemsPerSlide;
}

// Render
function renderContent() {
  renderSwipers();
  renderCarBrandsOfSrachBox();
  renderPermiumBrands();
  renderAllVeihcles();
  renderPopularMakers();
  renderUserComments();
  renderCarBrands();
  renderBlogs();

  const bookmarks = getAllElementsByClass("bookmark");
  // console.log("🚀 ~ renderContent ~ bookmarks:", bookmarks)

  for (const bookmark of bookmarks) {
    bookmark.addEventListener("click", toggleBookmarkIcon);
  }
}

function renderPermiumBrands() {
  const permiumBrandsWrapper = document.getElementById(
    "permium-brands-wrappper"
  );

  for (let i = 0; i < MAX_BRANDS_COUNT; i++) {
    const { name, logo, link } = brands[i];

    permiumBrandsWrapper.insertAdjacentHTML(
      "beforeend",
      `
          <a href="${link}"
              class="bg-white text-center border py-4 xl:py-6.5 border-gray-200 rounded-2xl">
            <div class="flex items-center justify-center max-w-full size-25 px-2 sm:px-0 mx-auto">
              <img
              class="max-h-full"
              src="${logo}"
              alt="${name} logo"/>
            </div>
            <span class="block mt-1.5">${name}</span>
          </a>`
    );
  }
}

function renderAllVeihcles() {
  const allVehiclesContainer = document.getElementById("all-vehicles-wrapper");

  allVehiclesContainer.dataset.amountItems =
    cars.length > 16 ? 16 : cars.length;

  for (const car of cars) {
    const {
      year,
      model,
      price,
      engine,
      images,
      topSpeed,
      fuelType,
      transmission,
      manufacturer,
    } = car;

    console.log("Car:", car);

    allVehiclesContainer.insertAdjacentHTML(
      "beforeend",
      `
            <div class="flex justify-center w-full xs:w-[calc(50%-8.034px)] md:w-[calc(33.333333%-20.067px)] xl:w-[calc(25%-22.534px)] shrink-0">
            <div class="w-full max-w-80 xs:max-w-full shrink-0 rounded-2xl overflow-hidden">
            <a href="#" class="block relative">
                <img class="w-full max-h-[218px]"
                  src="${images[0]}"
                  alt="${manufacturer} ${model} – ${year}"/>
                <span
                  class="absolute top-3 lg:top-6 left-2 lg:left-5 flex items-center justify-center bg-green-600 text-white text-xs lg:text-parent w-20 lg:w-[105px] h-6 lg:h-7.5 rounded-full"
                  >Great Price</span>
                <div
                  class="bookmark absolute top-2 lg:top-5 right-2 lg:right-5 size-8 lg:size-9 flex items-center justify-center bg-white text-primary cursor-pointer rounded-full"
                    onclick="">
                  <svg class="size-4">
                    <use href="#bookmark"></use>
                  </svg>
                </div>
              </a>
              <div
                class="px-4 lg:px-7.5 pb-4 lg:pb-7.5 pt-3 lg:pt-4 border-x border-b border-gray-200 rounded-b-2xl">
                <h4
                  class="line-clamp-1 mb-1 lg:mb-1.5 text-base lg:text-lg/[22px] font-medium">
                  ${manufacturer} ${model} – ${year}
                </h4>
                <span
                  class="line-clamp-1 mb-1 text-xs lg:text-sm/[17px]">${engine}</span>
                <div
                  class="flex justify-between py-3 lg:py-4 border-y border-gray-200 text-center text-xs lg:text-sm/none">
                  <div class="">
                    <svg class="size-4.5 mb-2 lg:mb-3 mx-auto">
                      <use href="#max-speed"></use>
                    </svg>
                    <span>${topSpeed} km</span>
                  </div>
                  <div>
                    <svg class="size-4.5 mb-2 lg:mb-3 mx-auto">
                      <use href="#gas"></use>
                    </svg>
                    <span>${fuelType}</span>
                  </div>
                  <div>
                    <svg class="size-4.5 mb-2 lg:mb-3 mx-auto">
                      <use href="#gear"></use>
                    </svg>
                    <span>${transmission}</span>
                  </div>
                </div>
                <div class="flex items-center justify-between mt-3 lg:mt-4">
                  <span class="font-bold text-base lg:text-xl/[30px]">
                  $${numberSeparator(price)}
                  </span>
                  <a
                    href="#"
                    class="flex items-center gap-x-1.5 lg:gap-x-2.5 mt-2.5 sm:mt-0 text-xs lg:text-parent text-secondary font-medium">
                    View Details
                    <svg class="w-3 lg:w-3.5 h-3 lg:h-3.5">
                      <use href="#arrow-up-right"></use>
                    </svg>
                  </a>
                </div>
              </div>
              </div>
            </div>`
    );
  }
}

function renderCarBrandsOfSrachBox() {
  const carsMenuContainer = document.getElementById("brands-list");
  console.log(cars);

  carsMenuContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      renderCarModels(e.target.textContent.trim());
    }
  });

  for (const brand of brands) {
    carsMenuContainer.insertAdjacentHTML(
      "beforeend",
      `<li class="px-2 md:px-2.5 hover:bg-secondary hover:text-white transition-colors cursor-pointer rounded-md">
          ${brand.name}
          </li>`
    );
  }
  console.log(brands);
}

function renderCarModels(chosenBrand) {
  const modelsList = document.getElementById("models-list");

  let label = modelsList.previousElementSibling;

  label.textContent = "Any Models"; // Default Value

  modelsList.innerHTML = `<li class="px-2 md:px-2.5 hover:bg-secondary hover:text-white transition-colors cursor-pointer rounded-md">Any Models</li>`;

  for (const brand of brands) {
    if (brand.name === chosenBrand) {
      for (const model of brand.models) {
        modelsList.insertAdjacentHTML(
          "beforeend",
          `
        <li class="px-2 md:px-2.5 hover:bg-secondary hover:text-white transition-colors cursor-pointer rounded-md">
        ${model}
        </li>`
        );
      }
    }
  }
}

function renderPopularMakers() {
  let amountItems = 0,
    contentContainer,
    popularMakers = ["bmw", "audi", "mercedes benz", "bentley"];

  contentContainer = document.getElementById("popular-makers-wrapper");
  contentContainer.innerHTML = "";

  for (const car of cars) {
    if (popularMakers.includes(car.manufacturer.toLowerCase())) {
      let {
        year,
        model,
        price,
        images,
        engine,
        fuelType,
        topSpeed,
        discount,
        manufacturer,
        transmission,
      } = car;

      amountItems++;

      contentContainer.insertAdjacentHTML(
        "beforeend",
        `
        <div class="w-full md:w-[calc(50%-15px)] flex justify-center shrink-0 "> 
          <div class="w-full max-w-80 xs:max-w-[566px] lg:max-w-3xl flex flex-col xs:flex-row rounded-2xl overflow-hidden">
          <div class="relative shrink-0 xs:w-[46%]">
            <img
              class="w-full h-full"
              src="${images[0]}"
              alt="${manufacturer} ${model} - ${year}"/>
            <span
              class="absolute top-3 lg:top-6 left-2 lg:left-5 flex items-center justify-center bg-green-600 text-white text-xs lg:text-parent px-2.5 lg:px-[15px] h-6 lg:h-7.5 rounded-full">Great Price</span>
            <div
              class="absolute top-2 lg:top-5 right-2 lg:right-5 size-8 lg:size-9 flex items-center justify-center bg-white text-primary cursor-pointer rounded-full">
              <svg class="size-4">
                <use href="#bookmark"></use>
              </svg>
            </div>
          </div>
          <div class="flex-grow p-3 lg:px-4 xl:px-7.5 lg:pb-[22px] lg:pt-5 bg-white/[7%]">
            <h4
              class="line-clamp-1 mb-1 lg:mb-1.5 text-base lg:text-lg/[22px] font-medium">
              ${manufacturer} ${model} - ${year}
            </h4>
            <span class="line-clamp-1 text-xs lg:text-sm/none">${engine}</span>
            <div
              class="flex flex-col items-start gap-y-2.5 xl:gap-y-[15px] py-3 lg:py-4 xl:py-6.5 text-xs lg:text-sm/none">
              <div class="flex items-center gap-x-2.5">
                <svg class="size-4.5">
                  <use href="#max-speed"></use>
                </svg>
                <span>${topSpeed} km</span>
              </div>
              <div class="flex items-center gap-x-2.5">
                <svg class="size-4.5">
                  <use href="#gas"></use>
                </svg>
                <span>${fuelType}</span>
              </div>
              <div class="flex items-center gap-x-2.5">
                <svg class="size-4.5">
                  <use href="#gear"></use>
                </svg>
                <span>${transmission}</span>
              </div>
            </div>
            <div class="flex items-end justify-between">
              <div class="flex flex-col">
                <span class="line-through text-xs lg:text-sm">$${numberSeparator(
                  price
                )}</span>
                <span class="font-bold lg:text-xl/[30px]">$${numberSeparator(
                  calcDiscount(price, discount)
                )}</span>
              </div>
              <a
                href="#"
                class="flex items-center gap-x-1.5 lg:gap-x-2.5 mt-2.5 sm:mt-0 text-xs lg:text-parent font-medium">
                View Details
                <svg class="w-3 lg:w-3.5 h-3 lg:h-3.5">
                  <use href="#arrow-up-right"></use>
                </svg>
              </a>
            </div>
          </div>
        </div>
        </div>`
      );
    }
  }

  contentContainer.dataset.amountItems = amountItems;
}

function renderUserComments() {
  let svgColorClass;
  const commentsWrapper = document.getElementById("comments-wrapper");

  commentsWrapper.innerHTML = "";
  commentsWrapper.dataset.amountItems = 3;

  for (const customer of customers) {
    svgColorClass = [
      "text-gray-300",
      "text-gray-300",
      "text-gray-300",
      "text-gray-300",
      "text-gray-300",
    ];

    for (let i = 0; i < Math.floor(customer.score); i++) {
      svgColorClass[i] = "text-[#E1C03F]";
    }

    const { name, score, comment, profileImg, job } = customer;

    commentsWrapper.insertAdjacentHTML(
      "beforeend",
      `
        <div
            class="shrink-0 w-full flex flex-col sm:flex-row gap-6 lg:gap-x-12 xl:gap-x-16 2xl:gap-x-[150px] ">
            <!-- Prfile img -->
            <div
              class="w-48 lg:w-72 xl:w-96 2xl:w-[448px] mx-auto shrink-0 rounded-lg overflow-hidden">
              <img src="${profileImg}" alt="Profile img ${name}" />
            </div>
            <!-- Descriptions -->
            <div class="flex flex-col justify-center">
              <!-- Head -->
              <div class="flex flex-col items-center sm:items-start">
                <!-- Score -->
                <div class="flex items-center gap-x-2.5">
                  <div class="flex gap-x-0.5">
                    <svg class="size-4  ${svgColorClass[0]}">
                      <use href="#star"></use>
                    </svg>
                    <svg class="size-4 ${svgColorClass[1]}">
                      <use href="#star"></use>
                    </svg>
                    <svg class="size-4 ${svgColorClass[2]}">
                      <use href="#star"></use>
                    </svg>
                    <svg class="size-4 ${svgColorClass[3]}">
                      <use href="#star"></use>
                    </svg>
                    <svg class="size-4 ${svgColorClass[4]}">
                      <use href="#star"></use>
                    </svg>
                  </div>
                  <span
                    class="px-2 lg:px-2.5 text-xs lg:text-parent text-white bg-[#E1C03F] rounded-full">
                      ${score.toFixed(1)}
                    </span>
                </div>
                <span class="lg:text-lg/[21.6px] font-medium mt-2.5 lg:mt-3.5">
                  ${name}
                </span>
                <span class="mt-1 text-sm lg:text-parent">${job}</span>
              </div>
              <p 
              class="sm:text-lg/8 lg:text-2xl/9 2xl:text-[26px]/[48px] line-clamp-5 sm:line-clamp-4 text-center sm:text-start font-medium mt-4 lg:mt-[35px]">
                ${comment}
              </p>
            </div>
            </div>`
    );
  }
}

function renderCarBrands() {
  const carBrandsWrapper = document.getElementById("car-brands-wrapper");

  for (const brand of brands) {
    carBrandsWrapper.insertAdjacentHTML(
      "beforeend",
      `<li>
        <a href="javascript:void(0)"> ${brand.name} Cars </a>
      </li>`
    );
  }
}

function renderBlogs() {
  const blogsWrapper = document.getElementById("blogs-wrapper");

  for (const blog of blogs) {
    const { author, date, title, image } = blog;
    const { year, month, day } = date;

    blogsWrapper.insertAdjacentHTML(
      "beforeend",
      `     <div class="max-w-80 xs:max-w-full">
              <div class="relative rounded-2xl overflow-hidden">
                <img
                  class="w-full aspect-[3/2]"
                  src="${image}"
                  alt="${title}"/>
                <span
                  class="absolute top-3 lg:top-6 left-2 lg:left-5 flex items-center justify-center bg-white text-primary text-xs lg:text-parent px-2.5 lg:px-[15px] h-6 lg:h-7.5 rounded-full">
                  Sound
                  </span>
              </div>
              <div
                class="flex gap-x-3 md:gap-x-3.5 mt-2.5 md:mt-5 mb-0.5 md:mb-1">
                <div class="flex items-center gap-x-2 md:gap-x-2.5">
                  <span class="text-xs sm:text-parent"> ${author} </span>
                  <span class="size-1 bg-gray-300 rounded-full"></span>
                </div>
                <span class="text-xs sm:text-parent">${month} ${day}, ${year}</span>
              </div>
              <p
                class="text-base sm:text-lg xl:text-xl/[30px] line-clamp-2 font-medium">
                ${title}
              </p>
            </div>`
    );
  }
}
// === Set Events ===

window.addEventListener("DOMContentLoaded", async () => {
  let data = await fetchData(
    "http://127.0.0.1:5500/public/javascripts/db.json"
  );

  cars = data.cars;
  blogs = data.blogs;
  brands = data.brands;
  customers = data.customers;

  console.log("🚀 ~ window.addEventListener ~ comments:", customers);

  renderContent();

  // let params = new URLSearchParams(document.location.search);
  // console.log("Brand", params.get("brand"));
  // console.log("Price", params.get("price"));
  // console.log("Model", params.get("model"));
});

document.body.addEventListener("click", (e) => {
  if (e.target.className?.includes("drop-down__btn")) {
    removeClass("drop-down__list-item--active");
  }
});

for (const btn of dropDownBtns) {
  btn.addEventListener("click", openDropDown);
}

for (const list of dropDownListItems) {
  list.addEventListener("click", selectDropDownItem);
}

for (const btn of carStatusBtn) {
  btn.addEventListener("click", (e) => {
    let elm = e.target;

    removeClass("car-status--active");

    elm.classList.add("car-status--active");
    // removeClass("border-white", elm)
  });
}

searchBtn.addEventListener("click", redirectPage);

openMenuIcon.addEventListener("click", openMenu);
closeMenuIcon.addEventListener("click", closeMenu);
bgOverlay.addEventListener("click", closeMenu);

function renderSwipers() {
  const swiperContainers = getAllElementsByClass("swiper");

  for (const swiper of swiperContainers) {
    let swiperWrapper,
      btnNext,
      btnPrev,
      maxSlides,
      currentIndex = 0;

    swiperWrapper = swiper.getElementsByClassName("swiper__wrapper")[0];

    btnNext = swiper.getElementsByClassName("btn-next")[0];
    btnPrev = swiper.getElementsByClassName("btn-prev")[0];

    btnNext.addEventListener("click", () => {
      let itemsPerSlide,
        amountItems = swiperWrapper.dataset.amountItems;
      console.log("amountItems", amountItems);
      console.log("Swiper ID", swiperWrapper.id);

      itemsPerSlide = calcAmountItemsPerSlide(swiperWrapper.id);

      maxSlides = calcMaxSlides(amountItems, itemsPerSlide);

      if (currentIndex < maxSlides - 1) {
        currentIndex++;
        updateSlidePosition(swiperWrapper, currentIndex);
      }
    });

    btnPrev.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;

        updateSlidePosition(swiperWrapper, currentIndex);
      }
    });
  }
}

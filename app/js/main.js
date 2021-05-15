const accordionItems = document.querySelector(".qa__accordion-items");
// calc Currencies
const rates = {};
const elementUSD = document.querySelector('[data-value="USD"]');
const elementEUR = document.querySelector('[data-value="EUR"]');
const elementGBP = document.querySelector('[data-value="GBP"]');
const inputRub = document.querySelector("#input-rub");
const inputOther = document.querySelector("#input-other");
const selectCount = document.querySelectorAll(".course__convert-select-current");
// select
let selectHeader = document.querySelectorAll(".course__convert-select-header");
let selectItem = document.querySelectorAll(".course__convert-select-item");
// form
let input = document.querySelectorAll(".form__input");
let formWrap = document.querySelector(".form");
let form = document.querySelector(".form__area");
// pop
let popOverlay = document.querySelector(".popup");
let popText = document.querySelector(".popup__text");


// VanillaTilt.init(document.querySelector(".card-item"), {
//   max: 20,
//   speed: 100,
// });

accordionItems.addEventListener("click", showAccordion);
form.addEventListener("submit", formSend);
popOverlay.addEventListener("click", (e) => {
  e.stopPropagation();
  closeModal(e);
});

getCurrencies();
select();
labelUp();

function showAccordion(e) {
  if (e.target.tagName.toLowerCase() === "div") {
    const accordionHeader = e.target;
    accordionHeader.nextElementSibling.classList.toggle("qa__accordion-body--active");
    accordionHeader.children[1].classList.toggle("qa__accordion-icon--minus");
  }
}

async function getCurrencies() {
  const response = await fetch("https://www.cbr-xml-daily.ru/daily_json.js");
  const data = await response.json();
  const result = await data;

  rates.USD = result.Valute.USD;
  rates.EUR = result.Valute.EUR;
  rates.GBP = result.Valute.GBP;

  elementUSD.textContent = rates.USD.Value.toFixed(1);
  elementEUR.textContent = rates.EUR.Value.toFixed(1);
  elementGBP.textContent = rates.GBP.Value.toFixed(1);
}

function select() {
  selectHeader.forEach((item) => {
    item.addEventListener("click", toggleOpen);
  });

  selectItem.forEach((item) => {
    item.addEventListener("click", selectChoose);
  });

  function toggleOpen() {
    this.parentElement.classList.toggle("active");
    selectHeader.forEach((item) => {
      if (item !== this) item.parentElement.classList.remove("active");
    });
  }

  function selectChoose() {
    let selectText = this.innerText;
    let select = this.closest(".course__convert-other");
    let currentText = select.querySelector(".course__convert-select-current");
    currentText.classList.add("course__convert-select-current--active");
    currentText.innerText = selectText;
    select.classList.remove("active");
  }
}

inputRub.oninput = () => {
  inputOther.value = (parseFloat(inputRub.value) / rates.USD.Value).toFixed(2);
};

function labelUp() {
  for (let i = 0; i < input.length; i++) {
    const inputReq = input[i];
    let labelReq = inputReq.nextElementSibling;
    inputReq.oninput = () => getStyle();

    if (inputReq.value == "") {
      getStyle();
    }
    function getStyle() {
      if (inputReq.value !== "") {
        labelReq.style.fontSize = "11px";
        labelReq.style.color = "#CA48F6";
        labelReq.style.top = "14px";
      } else {
        labelReq.style.fontSize = "18px";
        labelReq.style.color = "#302d42";
        labelReq.style.top = "50%";
        inputReq.blur();
      }
    }
  }
}

async function formSend(e) {
  e.preventDefault();

  let error = formValidate(form);

  if (error === 0) {
    popText.style.color = "rgb(0, 202, 118)";
    popContent.style.top = "50%";
    openModal("Успешно отправлено");
    form.reset();
    labelUp();
  } else {
    popText.style.color = "rgb(202, 0, 0)";
    popContent.style.top = '20%';
    openModal("Заполните обязательные поля");
  }
}

function formValidate(form) {
  let error = 0;
  let formReq = document.querySelectorAll("._req");
  let label = document.querySelectorAll(".form__label");
  for (let i = 0; i < formReq.length; i++) {
    const input = formReq[i];

    formRemoveError(input);

    if (input.classList.contains("_email")) {
      if (emailTest(input)) {
        formAddError(input);
        error++;
      }
    } else if (input.getAttribute("type") === "checkbox" && input.checked === false) {
      formAddError(input);
      error++;
    } else {
      if (input.value === "") {
        formAddError(input);
        error++;
      }
    }
  }
  return error;
}

function formAddError(input) {
  input.parentElement.classList.add("_error");
  input.classList.add("_error");
}

function formRemoveError(input) {
  input.parentElement.classList.remove("_error");
  input.classList.remove("_error");
}
function emailTest(input) {
  return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
}

function openModal(message) {
  popText.textContent = message;
  popOverlay.classList.remove("hidden");
}

function closeModal(e) {
  if (e.target.classList.contains("popup__close-btn")) {
    popOverlay.classList.add("hidden");
  } else if (e.target.classList.contains("popup")) {
    popOverlay.classList.add("hidden");
  }
}

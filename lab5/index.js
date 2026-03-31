//1
const lamp = document.getElementById("lamp");
const lampType = document.getElementById("lampType");
const lampText = document.getElementById("lampText");
const toggleLampBtn = document.getElementById("toggleLampBtn");
const brightnessBtn = document.getElementById("brightnessBtn");

let lampOn = false;
let lampTimer;

function updateLamp() {
    lamp.className = "lamp";

    if (lampOn) {
        lamp.classList.add("on");
        lamp.classList.add(lampType.value);
        lampText.textContent = "Лампочка увімкнена";
    } else {
        lamp.classList.add("off");
        lampText.textContent = "Лампочка вимкнена";
    }
}

function resetLampTimer() {
    clearTimeout(lampTimer);
    lampTimer = setTimeout(() => {
        lampOn = false;
        updateLamp();
        lampText.textContent = "Лампочка вимкнулась автоматично";
    }, 5 * 60 * 1000);
}

toggleLampBtn.addEventListener("click", () => {
    lampOn = !lampOn;
    updateLamp();
    resetLampTimer();
});

lampType.addEventListener("change", () => {
    updateLamp();
    resetLampTimer();
});

brightnessBtn.addEventListener("click", () => {
    let value = prompt("Введіть яскравість від 20 до 100");
    value = Number(value);

    if (value >= 20 && value <= 100) {
        lamp.style.opacity = value / 100;
    } else {
        alert("Невірне значення");
    }

    resetLampTimer();
});

updateLamp();
resetLampTimer();

//2
const red = document.getElementById("red");
const yellow = document.getElementById("yellow");
const green = document.getElementById("green");
const trafficText = document.getElementById("trafficText");

const startTrafficBtn = document.getElementById("startTrafficBtn");
const stopTrafficBtn = document.getElementById("stopTrafficBtn");
const nextTrafficBtn = document.getElementById("nextTrafficBtn");
const changeTimeBtn = document.getElementById("changeTimeBtn");

let redTime = 5000;
let yellowTime = 3000;
let greenTime = 7000;

let trafficTimeout = null;
let trafficRunning = false;
let state = "red";

function clearTraffic() {
    red.className = "light";
    yellow.className = "light";
    green.className = "light";
}

function showTraffic(newState) {
    clearTraffic();
    state = newState;

    if (state === "red") {
        red.classList.add("active-red");
        trafficText.textContent = "Стан: червоний";
    } else if (state === "yellow") {
        yellow.classList.add("active-yellow");
        trafficText.textContent = "Стан: жовтий";
    } else if (state === "green") {
        green.classList.add("active-green");
        trafficText.textContent = "Стан: зелений";
    }
}

function blinkYellow(times, callback) {
    let count = 0;
    let isOn = false;

    const interval = setInterval(() => {
        clearTraffic();

        if (isOn) {
            yellow.classList.add("active-yellow");
        }

        isOn = !isOn;
        count++;

        if (count === times * 2) {
            clearInterval(interval);
            callback();
        }
    }, 500);
}

function runTraffic() {
    if (!trafficRunning) return;

    showTraffic("red");
    trafficTimeout = setTimeout(() => {
        if (!trafficRunning) return;

        showTraffic("yellow");
        trafficTimeout = setTimeout(() => {
            if (!trafficRunning) return;

            showTraffic("green");
            trafficTimeout = setTimeout(() => {
                if (!trafficRunning) return;

                trafficText.textContent = "Стан: миготливий жовтий";
                blinkYellow(3, () => {
                    if (trafficRunning) {
                        runTraffic();
                    }
                });
            }, greenTime);
        }, yellowTime);
    }, redTime);
}

startTrafficBtn.addEventListener("click", () => {
    clearTimeout(trafficTimeout);
    trafficRunning = true;
    runTraffic();
});

stopTrafficBtn.addEventListener("click", () => {
    trafficRunning = false;
    clearTimeout(trafficTimeout);
    clearTraffic();
    trafficText.textContent = "Світлофор зупинено";
});

nextTrafficBtn.addEventListener("click", () => {
    if (state === "red") {
        showTraffic("yellow");
    } else if (state === "yellow") {
        showTraffic("green");
    } else {
        showTraffic("red");
    }
});

changeTimeBtn.addEventListener("click", () => {
    const r = Number(prompt("Червоний (секунди):", "5"));
    const y = Number(prompt("Жовтий (секунди):", "3"));
    const g = Number(prompt("Зелений (секунди):", "7"));

    if (r > 0 && y > 0 && g > 0) {
        redTime = r * 1000;
        yellowTime = y * 1000;
        greenTime = g * 1000;
        alert("Час змінено");
    } else {
        alert("Невірні значення");
    }
});

showTraffic("red");

//3
const clock = document.getElementById("clock");
const timerInput = document.getElementById("timerInput");
const startTimerBtn = document.getElementById("startTimerBtn");
const timerText = document.getElementById("timerText");

const monthInput = document.getElementById("monthInput");
const showCalendarBtn = document.getElementById("showCalendarBtn");
const calendar = document.getElementById("calendar");

const birthdayInput = document.getElementById("birthdayInput");
const birthdayBtn = document.getElementById("birthdayBtn");
const birthdayText = document.getElementById("birthdayText");

function updateClock() {
    const now = new Date();

    let h = String(now.getHours()).padStart(2, "0");
    let m = String(now.getMinutes()).padStart(2, "0");
    let s = String(now.getSeconds()).padStart(2, "0");

    clock.textContent = `${h}:${m}:${s}`;
}

setInterval(updateClock, 1000);
updateClock();

let timerInterval;

startTimerBtn.addEventListener("click", () => {
    clearInterval(timerInterval);

    const endDate = new Date(timerInput.value);

    timerInterval = setInterval(() => {
        const now = new Date();
        const diff = endDate - now;

        if (diff <= 0) {
            timerText.textContent = "Час вийшов";
            clearInterval(timerInterval);
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        timerText.textContent =
            `Залишилось: ${days} дн. ${hours} год. ${minutes} хв. ${seconds} сек.`;
    }, 1000);
});

showCalendarBtn.addEventListener("click", () => {
    const value = monthInput.value;

    if (!value) {
        calendar.textContent = "Оберіть місяць";
        return;
    }

    const parts = value.split("-");
    const year = Number(parts[0]);
    const month = Number(parts[1]) - 1;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let html = "<table><tr><th>Нд</th><th>Пн</th><th>Вт</th><th>Ср</th><th>Чт</th><th>Пт</th><th>Сб</th></tr><tr>";

    let dayOfWeek = firstDay;

    for (let i = 0; i < dayOfWeek; i++) {
        html += "<td></td>";
    }

    for (let day = 1; day <= daysInMonth; day++) {
        html += `<td>${day}</td>`;
        dayOfWeek++;

        if (dayOfWeek === 7 && day !== daysInMonth) {
            html += "</tr><tr>";
            dayOfWeek = 0;
        }
    }

    while (dayOfWeek > 0 && dayOfWeek < 7) {
        html += "<td></td>";
        dayOfWeek++;
    }

    html += "</tr></table>";
    calendar.innerHTML = html;
});

birthdayBtn.addEventListener("click", () => {
    const inputDate = birthdayInput.value;

    if (!inputDate) {
        birthdayText.textContent = "Оберіть дату";
        return;
    }

    let birthday = new Date(inputDate);
    const now = new Date();

    birthday.setFullYear(now.getFullYear());

    if (birthday < now) {
        birthday.setFullYear(now.getFullYear() + 1);
    }

    const diff = birthday - now;

    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor((diff / (1000 * 60 * 60 * 24)) % 30);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    birthdayText.textContent =
        `До дня народження: ${months} міс. ${days} дн. ${hours} год. ${minutes} хв. ${seconds} сек.`;
});

//4
const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productCount = document.getElementById("productCount");
const addProductBtn = document.getElementById("addProductBtn");

const deleteId = document.getElementById("deleteId");
const deleteProductBtn = document.getElementById("deleteProductBtn");

const updateId = document.getElementById("updateId");
const newPrice = document.getElementById("newPrice");
const newCount = document.getElementById("newCount");
const updateProductBtn = document.getElementById("updateProductBtn");

const searchName = document.getElementById("searchName");
const searchProductBtn = document.getElementById("searchProductBtn");

const orderId = document.getElementById("orderId");
const orderCount = document.getElementById("orderCount");
const orderBtn = document.getElementById("orderBtn");

const productList = document.getElementById("productList");
const orderList = document.getElementById("orderList");

const products = new Map();
const orders = new Set();
const productInfo = new WeakMap();
const viewedProducts = new WeakSet();

let currentId = 1;

function showProducts() {
    if (products.size === 0) {
        productList.textContent = "Товарів немає";
        return;
    }

    let text = "";

    for (const [id, product] of products) {
        text += `ID: ${id}, Назва: ${product.name}, Ціна: ${product.price}, Кількість: ${product.count}<br>`;
    }

    productList.innerHTML = text;
}

function showOrders() {
    if (orders.size === 0) {
        orderList.textContent = "Замовлень немає";
        return;
    }

    let text = "";

    for (const order of orders) {
        text += `Замовлення: ${order.name}, Кількість: ${order.count}<br>`;
    }

    orderList.innerHTML = text;
}

addProductBtn.addEventListener("click", () => {
    const name = productName.value.trim();
    const price = Number(productPrice.value);
    const count = Number(productCount.value);

    if (name === "" || price <= 0 || count < 0) {
        alert("Введіть правильні дані");
        return;
    }

    const product = {
        name: name,
        price: price,
        count: count
    };

    products.set(currentId, product);
    productInfo.set(product, { history: ["Створено"] });
    viewedProducts.add(product);

    currentId++;
    showProducts();
});

deleteProductBtn.addEventListener("click", () => {
    const id = Number(deleteId.value);

    if (products.delete(id)) {
        alert("Товар видалено");
    } else {
        alert("Товар не знайдено");
    }

    showProducts();
});

updateProductBtn.addEventListener("click", () => {
    const id = Number(updateId.value);

    if (!products.has(id)) {
        alert("Товар не знайдено");
        return;
    }

    const product = products.get(id);

    if (Number(newPrice.value) > 0) {
        product.price = Number(newPrice.value);
    }

    if (Number(newCount.value) >= 0) {
        product.count = Number(newCount.value);
    }

    const data = productInfo.get(product);
    data.history.push("Оновлено");

    showProducts();
    alert("Товар оновлено");
});

searchProductBtn.addEventListener("click", () => {
    const name = searchName.value.trim().toLowerCase();

    for (const [id, product] of products) {
        if (product.name.toLowerCase() === name) {
            alert(`Знайдено: ID ${id}, ${product.name}, ціна ${product.price}, кількість ${product.count}`);
            return;
        }
    }

    alert("Товар не знайдено");
});

orderBtn.addEventListener("click", () => {
    const id = Number(orderId.value);
    const count = Number(orderCount.value);

    if (!products.has(id)) {
        alert("Товар не знайдено");
        return;
    }

    const product = products.get(id);

    if (count <= 0 || count > product.count) {
        alert("Недостатньо товару");
        return;
    }

    product.count -= count;

    const order = {
        name: product.name,
        count: count
    };

    orders.add(order);

    const data = productInfo.get(product);
    data.history.push("Замовлено");

    showProducts();
    showOrders();
    alert("Замовлення оформлено");
});

showProducts();
showOrders();
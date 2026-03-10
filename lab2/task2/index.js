function isNumberInRange(num, min, max) {
    return num >= min && num <= max;
}

function showRangeCheck() {
    let number = 7;

    if (isNumberInRange(number, 1, 10)) {
        alert("Число знаходиться в діапазоні");
    } else {
        alert("Число НЕ в діапазоні");
    }
}

let isActive = true;

function changeState() {
    isActive = !isActive;
    alert("Новий стан: " + isActive);
}
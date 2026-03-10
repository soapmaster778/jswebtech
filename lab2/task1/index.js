function findMinMax(arr) {

    arr.sort((a, b) => {
        return a - b;
    });

    let min = arr[0];
    let max = arr[arr.length - 1];

    return {
        min: min,
        max: max
    };
}

let numbers = [1, 15, 9, 32];

let result = findMinMax(numbers);

function showFindMinMax() {
    alert(`Мінімальний елемент: ${result.min}`);
    alert(`Максимальний елемент: ${result.max}`);
}

function compareObjects(obj1, obj2) {
    if (obj1.name === obj2.name && obj1.age === obj2.age) {
        return true;
    } else {
        return false;
    }
}

let student1 = {
    name: "Ivan",
    age: 18
};

let student2 = {
    name: "Ivan",
    age: 18
};

function showCompareObjects() {
    let result = compareObjects(student1, student2);

    if (result) {
        alert("Об'єкти однакові");
    } else {
        alert("Об'єкти різні");
    }
}
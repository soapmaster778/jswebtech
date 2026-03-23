
function task1() {
    let arr1= ["яблуко", "груша", "банан"]
    console.log("Завдання 1")

    arr1.pop()
    console.log("Видалення останнього: "+arr1)

    arr1.unshift("ананас")
    console.log("В початок ананас: "+arr1)

    arr1.sort().reverse()
    console.log("Перевернутий масив: "+arr1);

    let index = 1+arr1.indexOf("яблуко");
    console.log("Індекс елемента 'яблуко':" + index);

}
task1()
function task2() {
    let arr2= ["жовтий", "синій", "червоний", "фіолетовий"]
    console.log("Завдання 2")

    let long = arr2.reduce((a, b) => (a.length > b.length ? a : b));
    let short = arr2.reduce((a, b) => (a.length < b.length ? a : b));
    console.log("Найдовший: "+long)
    console.log("Найкоротший: "+short)

    let newArr2= arr2.filter(color => color.includes("синій"))
    console.log("Масив з тільки синім:" +newArr2)

    let colorString = arr2.join(", ");
    console.log("Всі елементи масиву у рядку: " + colorString);
}
task2()

function task3() {
    console.log("Завдання 3");
    let employees = [
        { name: "Євген", age: 20, position: "розробник"},
        { name: "Дмитро", age: 50, position: "менеджер" },
        { name: "Аліна", age: 35, position: "дизайнер" },
        { name: "Іван", age: 18, position: "розробник" }
    ];
    employees.sort((a, b) => a.name.localeCompare(b.name));
    console.log("За іменами: ", employees);

    let developers = employees.filter(e => e.position === "розробник");
    console.log("Розробники: ", developers);

    employees = employees.filter(e => e.age <= 25);
    console.log("Видалення старших за 35 років: ", employees);

    employees.push({ name: "Артур", age: 65, position: "прожект менеджер" });
    console.log("З новим працівником: ", employees);
}
task3()
function task4() {
    console.log("Завдання 4");
    let students = [
        { name: "Іван", age: 18, course: 2 },
        { name: "Дмитро", age: 17, course: 1 },
        { name: "Аліна", age: 25, course: 3 },
        { name: "Олексій", age: 20, course: 2 },

    ];

    console.log( students);

    students = students.filter(student => student.name !== "Олексій");
    console.log("Без Олексія: ", students);

    students.push({ name: "Сергій", age: 25, course: 4 });
    console.log("Новий студент: ", students);

    students.sort((a, b) => b.age - a.age);
    console.log("Сортування за віком: ", students);

    let thirdCourse = students.find(student => student.course === 3);
    console.log("3 курс: ", thirdCourse);
}
task4()
function task5() {
    console.log("Завдання 5");
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    let square = numbers.map(n => n ** 2);
    console.log("Квадрат: ", square);

    let even = numbers.filter(n => n % 2 === 0);
    console.log("Парні числа: ", even);

    let sum = numbers.reduce((a, b) => a + b);
    console.log("Сума: ", sum);

    let extra = [11, 12, 13, 14, 15];
    numbers = numbers.concat(extra);
    console.log("Екстра масив: ", numbers);

    numbers.splice(0, 3);
    console.log("Без перших 3 чисел: ", numbers);

}
task5()

    console.log("Завдання 6");
    function libraryManagement() {
        let books = [
            {title: "Гобіт", author: "Дж.Р.Р.Толкін", genre: "Фентезі", pages: 350, isAvailable: true},
            {title: "Незнайко", author: "М.М.Носов", genre: "Казка", pages: 155, isAvailable: true},
            {title: "Останнє бажання", author: "Анджей Сапковський", genre: "Фентезі", pages: 361, isAvailable: false}
        ];

        return {
            addBook(title, author, genre, pages) {
                books.push({title, author, genre, pages, isAvailable: true});
            },
            removeBook(title) {
                books = books.filter(book => book.title !== title);
            },
            findBooksByAuthor(author) {
                let foundBooks = books.filter(book => book.author === author);
                console.log(`Книги "${author}":`, foundBooks);
            },


            toggleBookAvailability(title, isAvailable) {
                let book = books.find(book => book.title === title);
                if (book) {
                    book.isAvailable = isAvailable;
                    console.log(`Книга ${book.isAvailable ? "доступна" : "позичена"}.`);
                }
            },
            sortBooksByPages() {
                books.sort((a, b) => a.pages - b.pages);
                console.log("Сортовано з сторінками: ", books);
            },
            getBooksStatistics() {
                let totalBooks = books.length;
                let availableBooks = books.filter(book => book.isAvailable === true).length;
                let borrowedBooks = books.filter(book => book.isAvailable === false).length;
                let avgPages = totalBooks ? books.reduce((sum, book) => sum + book.pages, 0) / totalBooks : 0;

                let stats = {totalBooks, availableBooks, borrowedBooks, avgPages};

                console.log("Статистика:", stats);

                return stats;
            },
            getBooks() {
                console.log("Список книг:", books);
                return books;
            }
        };
    }

    const library = libraryManagement();
    library.addBook("Пес", "Говард Лавкрафт", "наукова фантастика", 444);
    library.getBooks();
    library.removeBook("Гобіт");
    library.getBooks();
    library.findBooksByAuthor("Анджей Сапковський");
    library.toggleBookAvailability("Пес", false);
    library.sortBooksByPages();
    library.getBooksStatistics();


function task7() {
    console.log("Завдання 7");
    let student = { name: "Євген", age: 18, course: 2};
    console.log("Студент: ", student);

    student.subjects = ["Англійська", "Javascript", "Програмування"];
    console.log("Студент з предметами: ", student);
    delete student.age;
    console.log("Без віку: ", student);
}
task7()
'use strict';

let products = [];
let tasks = [];
let editId = null;

let currentFilter = 'all';
let currentSort = 'none';
let searchCategory = '';
let currentTaskSort = 'none';

const productList = document.getElementById('productList');
const totalPrice = document.getElementById('totalPrice');
const modal = document.getElementById('modal');
const form = document.getElementById('productForm');
const filtersContainer = document.getElementById('filters');
const sortButtonsContainer = document.getElementById('sortButtons');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const snackbar = document.getElementById('snackbar');
const categorySearchInput = document.getElementById('categorySearch');
const closeModalBtn = document.getElementById('closeModal');
const addBtn = document.getElementById('addBtn');
const addTaskBtn = document.getElementById('addTask');
const resetSortBtn = document.getElementById('resetSort');
const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const categoryInput = document.getElementById('category');
const imageInput = document.getElementById('image');
const modalTitle = document.getElementById('modalTitle');

const taskSortButtonsContainer = document.getElementById('taskSortButtons');
const resetTaskSortBtn = document.getElementById('resetTaskSort');

const generateId = () => Math.floor(Math.random() * 1000000);
const getCurrentDate = () => Date.now();

const showSnackbar = (text) => {
    snackbar.textContent = text;
    snackbar.style.display = 'block';

    clearTimeout(showSnackbar.timeoutId);
    showSnackbar.timeoutId = setTimeout(() => {
        snackbar.style.display = 'none';
    }, 2000);
};

const updateTotal = () => {
    const sum = products.reduce((acc, product) => acc + Number(product.price), 0);
    totalPrice.textContent = `Загальна сума: ${sum} грн`;
};

const getCategories = () => {
    const categories = products
        .map((product) => product.category.trim())
        .filter((category) => category !== '');

    return [...new Set(categories)];
};

const openModal = (isEditMode = false) => {
    modal.classList.remove('hidden');
    modalTitle.textContent = isEditMode ? 'Редагувати товар' : 'Додати товар';
};

const closeModal = () => {
    modal.classList.add('hidden');
    form.reset();
    editId = null;
};

const renderFilterButtons = () => {
    filtersContainer.innerHTML = '';

    const allButton = document.createElement('button');
    allButton.type = 'button';
    allButton.textContent = 'Усі';

    if (currentFilter === 'all') {
        allButton.classList.add('active');
    }

    allButton.addEventListener('click', () => {
        currentFilter = 'all';
        render();
    });

    filtersContainer.appendChild(allButton);

    const categories = getCategories();

    categories.forEach((category) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = category;

        if (currentFilter === category) {
            button.classList.add('active');
        }

        button.addEventListener('click', () => {
            currentFilter = category;
            render();
        });

        filtersContainer.appendChild(button);
    });
};

const getFilteredProducts = () => {
    let result = [...products];

    if (currentFilter !== 'all') {
        result = result.filter((product) => product.category === currentFilter);
    }

    if (searchCategory !== '') {
        result = result.filter((product) =>
            product.category.toLowerCase().includes(searchCategory)
        );
    }

    return result;
};

const getSortedProducts = (items) => {
    const sortedProducts = [...items];

    if (currentSort === 'price') {
        sortedProducts.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (currentSort === 'created') {
        sortedProducts.sort((a, b) => a.created - b.created);
    } else if (currentSort === 'updated') {
        sortedProducts.sort((a, b) => a.updated - b.updated);
    }

    return sortedProducts;
};

const updateSortButtonsView = () => {
    const sortButtons = sortButtonsContainer.querySelectorAll('button[data-sort]');

    sortButtons.forEach((button) => {
        button.classList.toggle('active', button.dataset.sort === currentSort);
    });
};

const createProductCard = (product) => {
    const card = document.createElement('div');
    card.className = 'product-card';

    const image = document.createElement('img');
    image.src = product.image;
    image.alt = product.name;

    const idText = document.createElement('p');
    idText.innerHTML = `<strong>ID:</strong> ${product.id}`;

    const nameText = document.createElement('p');
    nameText.innerHTML = `<strong>Назва:</strong> ${product.name}`;

    const priceText = document.createElement('p');
    priceText.innerHTML = `<strong>Ціна:</strong> ${product.price} грн`;

    const categoryText = document.createElement('p');
    categoryText.innerHTML = `<strong>Категорія:</strong> ${product.category}`;

    const createdText = document.createElement('p');
    createdText.innerHTML = `<strong>Створено:</strong> ${new Date(product.created).toLocaleString()}`;

    const updatedText = document.createElement('p');
    updatedText.innerHTML = `<strong>Оновлено:</strong> ${new Date(product.updated).toLocaleString()}`;

    const actions = document.createElement('div');
    actions.className = 'product-actions';

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.textContent = 'Редагувати';
    editButton.addEventListener('click', () => {
        editProduct(product.id);
    });

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Видалити';
    deleteButton.addEventListener('click', () => {
        deleteProduct(product.id);
    });

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    card.appendChild(image);
    card.appendChild(idText);
    card.appendChild(nameText);
    card.appendChild(priceText);
    card.appendChild(categoryText);
    card.appendChild(createdText);
    card.appendChild(updatedText);
    card.appendChild(actions);

    return card;
};

const render = () => {
    productList.innerHTML = '';

    renderFilterButtons();
    updateSortButtonsView();

    let preparedProducts = getFilteredProducts();
    preparedProducts = getSortedProducts(preparedProducts);

    if (preparedProducts.length === 0) {
        productList.textContent = 'Наразі список товарів пустий. Додайте новий товар.';
        updateTotal();
        return;
    }

    preparedProducts.forEach((product) => {
        productList.appendChild(createProductCard(product));
    });

    updateTotal();
};

const addProduct = (productData) => {
    const newProduct = {
        id: generateId(),
        name: productData.name,
        price: productData.price,
        category: productData.category,
        image: productData.image,
        created: getCurrentDate(),
        updated: getCurrentDate()
    };

    products.push(newProduct);
    return newProduct;
};

const updateProduct = (productId, productData) => {
    const oldProduct = products.find((product) => product.id === productId);

    if (!oldProduct) {
        return null;
    }

    const updatedProduct = {
        ...oldProduct,
        name: productData.name,
        price: productData.price,
        category: productData.category,
        image: productData.image,
        updated: getCurrentDate()
    };

    products = products.map((product) =>
        product.id === productId ? updatedProduct : product
    );

    return updatedProduct;
};

const deleteProduct = (productId) => {
    const deletedProduct = products.find((product) => product.id === productId);

    products = products.filter((product) => product.id !== productId);

    if (currentFilter !== 'all') {
        const categories = getCategories();

        if (!categories.includes(currentFilter)) {
            currentFilter = 'all';
        }
    }

    if (deletedProduct) {
        showSnackbar(`Товар видалено: ID ${deletedProduct.id}, ${deletedProduct.name}`);
    } else {
        showSnackbar('Товар видалено');
    }

    render();
};

const editProduct = (id) => {
    const product = products.find((item) => item.id === id);

    if (!product) {
        return;
    }

    nameInput.value = product.name;
    priceInput.value = product.price;
    categoryInput.value = product.category;
    imageInput.value = product.image;

    editId = id;
    openModal(true);
};

addBtn.addEventListener('click', () => {
    form.reset();
    editId = null;
    openModal(false);
});

closeModalBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const productData = {
        name: nameInput.value.trim(),
        price: priceInput.value.trim(),
        category: categoryInput.value.trim(),
        image: imageInput.value.trim()
    };

    if (editId) {
        const updatedProduct = updateProduct(editId, productData);

        if (updatedProduct) {
            showSnackbar(`Товар оновлено: ID ${updatedProduct.id}, ${updatedProduct.name}`);
        }
    } else {
        const newProduct = addProduct(productData);
        showSnackbar(`Товар додано: ID ${newProduct.id}, ${newProduct.name}`);
    }

    closeModal();
    render();
});

const sortButtons = sortButtonsContainer.querySelectorAll('button[data-sort]');
sortButtons.forEach((button) => {
    button.addEventListener('click', () => {
        currentSort = button.dataset.sort;
        render();
    });
});

resetSortBtn.addEventListener('click', () => {
    currentSort = 'none';
    render();
});

categorySearchInput.addEventListener('input', () => {
    searchCategory = categorySearchInput.value.toLowerCase().trim();
    render();
});

const addTask = (text) => {
    const task = {
        id: generateId(),
        text,
        done: false,
        created: getCurrentDate(),
        updated: getCurrentDate()
    };

    tasks.push(task);
    return task;
};

const updateTask = (taskId, newText) => {
    const oldTask = tasks.find((task) => task.id === taskId);

    if (!oldTask) {
        return null;
    }

    const updatedTask = {
        ...oldTask,
        text: newText,
        updated: getCurrentDate()
    };

    tasks = tasks.map((task) =>
        task.id === taskId ? updatedTask : task
    );

    return updatedTask;
};

const deleteTask = (taskId) => {
    tasks = tasks.filter((task) => task.id !== taskId);
};

const getSortedTasks = () => {
    const sortedTasks = [...tasks];

    if (currentTaskSort === 'created') {
        sortedTasks.sort((a, b) => a.created - b.created);
    } else if (currentTaskSort === 'done') {
        sortedTasks.sort((a, b) => Number(a.done) - Number(b.done));
    } else if (currentTaskSort === 'updated') {
        sortedTasks.sort((a, b) => a.updated - b.updated);
    }

    return sortedTasks;
};

const updateTaskSortButtonsView = () => {
    const buttons = taskSortButtonsContainer.querySelectorAll('button[data-task-sort]');

    buttons.forEach((button) => {
        button.classList.toggle('active', button.dataset.taskSort === currentTaskSort);
    });
};

addTaskBtn.addEventListener('click', () => {
    const value = taskInput.value.trim();

    if (value === '') {
        return;
    }

    addTask(value);
    taskInput.value = '';
    showSnackbar('Завдання додано');
    renderTasks();
});

taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        addTaskBtn.click();
    }
});

const taskSortButtons = taskSortButtonsContainer.querySelectorAll('button[data-task-sort]');
taskSortButtons.forEach((button) => {
    button.addEventListener('click', () => {
        currentTaskSort = button.dataset.taskSort;
        renderTasks();
    });
});

resetTaskSortBtn.addEventListener('click', () => {
    currentTaskSort = 'none';
    renderTasks();
});

const renderTasks = () => {
    taskList.innerHTML = '';
    updateTaskSortButtonsView();

    const preparedTasks = getSortedTasks();

    preparedTasks.forEach((task) => {
        const li = document.createElement('li');

        if (task.done) {
            li.classList.add('done');
        }

        const textSpan = document.createElement('span');
        textSpan.className = 'task-text';
        textSpan.textContent = task.text;

        textSpan.addEventListener('click', () => {
            tasks = tasks.map((item) =>
                item.id === task.id
                    ? { ...item, done: !item.done, updated: getCurrentDate() }
                    : item
            );

            renderTasks();
        });

        const actions = document.createElement('span');
        actions.className = 'task-actions';

        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.textContent = 'Редагувати';
        editButton.addEventListener('click', () => {
            const newText = prompt('Введіть новий текст завдання:', task.text);

            if (newText === null) {
                return;
            }

            const trimmedText = newText.trim();

            if (trimmedText === '') {
                return;
            }

            updateTask(task.id, trimmedText);
            showSnackbar('Завдання оновлено');
            renderTasks();
        });

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = 'Видалити';
        deleteButton.addEventListener('click', () => {
            deleteTask(task.id);
            showSnackbar('Завдання видалено');
            renderTasks();
        });

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        li.appendChild(textSpan);
        li.appendChild(actions);

        taskList.appendChild(li);
    });
};

render();
renderTasks();
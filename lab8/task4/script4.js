const editBtn = document.getElementById('edit-btn');
const modeText = document.getElementById('mode-text');

const cardsGrid = document.getElementById('cards-grid');
let editMode = false;
let draggedCard = null;

editBtn.addEventListener('click', () => {

    editMode = !editMode;

    if (editMode) {

        cardsGrid.classList.add('edit-mode');

        editBtn.textContent = 'Готово';

        modeText.textContent =
            'Перетягуйте картки або натискайте × щоб видалити';

        enableDragging();

    } else {

        cardsGrid.classList.remove('edit-mode');

        editBtn.textContent = 'Редагувати';

        modeText.textContent =
            'Натисніть «Редагувати» для керування картками';

        disableDragging();
    }
});

function enableDragging() {

    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {

        card.draggable = true;

        const deleteBtn = card.querySelector('.delete-btn');

        deleteBtn.onclick = () => {
            card.remove();
        };

        card.addEventListener('dragstart', dragStart);

        card.addEventListener('dragend', dragEnd);
    });
}

function disableDragging() {

    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {

        card.draggable = false;

        card.removeEventListener('dragstart', dragStart);

        card.removeEventListener('dragend', dragEnd);
    });
}

function dragStart() {

    draggedCard = this;

    this.classList.add('dragging');

    setTimeout(() => {
        this.style.display = 'none';
    }, 0);
}

function dragEnd() {

    this.classList.remove('dragging');
    this.style.display = 'block';
    draggedCard = null;
    removePlaceholder();
}

cardsGrid.addEventListener('dragover', (event) => {

    if (!editMode) return;

    event.preventDefault();

    const afterElement = getDragAfterElement(
        cardsGrid,
        event.clientX,
        event.clientY
    );

    let placeholder = document.querySelector('.placeholder');

    if (!placeholder) {

        placeholder = document.createElement('div');

        placeholder.classList.add('placeholder');
    }

    if (afterElement == null) {

        cardsGrid.appendChild(placeholder);

    } else {

        cardsGrid.insertBefore(placeholder, afterElement);
    }
});

cardsGrid.addEventListener('drop', (event) => {

    event.preventDefault();

    const placeholder = document.querySelector('.placeholder');

    if (placeholder && draggedCard) {

        cardsGrid.insertBefore(draggedCard, placeholder);

        placeholder.remove();
    }
});

function removePlaceholder() {

    const placeholder = document.querySelector('.placeholder');

    if (placeholder) {
        placeholder.remove();
    }
}

function getDragAfterElement(container, x, y) {

    const elements = [
        ...container.querySelectorAll('.card:not(.dragging)')
    ];

    let closest = null;

    let closestDistance = Infinity;

    elements.forEach(child => {

        const box = child.getBoundingClientRect();

        const centerX = box.left + box.width / 2;

        const centerY = box.top + box.height / 2;

        const distance = Math.hypot(
            x - centerX,
            y - centerY
        );

        if (distance < closestDistance) {

            closestDistance = distance;

            closest = child;
        }
    });

    return closest;
}
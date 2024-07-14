document.getElementById('playButton').addEventListener('click', startGame);

const images = [];
for (let i = 1; i <= 20; i++) {
    images.push(`images/image${i}.png`);
}

function startGame() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';

    let doubledImages = [];
    images.forEach(image => {
        doubledImages.push(image, image);
    });

    let shuffledImages = shuffle(doubledImages);
    shuffledImages.forEach((src, index) => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        const img = document.createElement('img');
        img.src = src;
        img.draggable = true;
        img.addEventListener('dragstart', dragStart);
        img.addEventListener('touchstart', touchStart, { passive: true });
        img.addEventListener('touchmove', touchMove, { passive: true });
        img.addEventListener('touchend', touchEnd);
        cell.appendChild(img);
        gameBoard.appendChild(cell);
    });

    startTimer();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let dragSrcElement = null;

function dragStart(e) {
    dragSrcElement = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.target.src);
    setTimeout(() => this.classList.add('hidden'), 0);
}

function touchStart(e) {
    dragSrcElement = e.target;
    e.target.classList.add('hidden');
}

function touchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.tagName === 'IMG' && element !== dragSrcElement) {
        element.classList.add('over');
    }
}

function touchEnd(e) {
    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.tagName === 'IMG' && dragSrcElement) {
        if (dragSrcElement.src === element.src) {
            dragSrcElement.parentElement.innerHTML = '';
            element.parentElement.innerHTML = '';
        } else {
            dragSrcElement.classList.remove('hidden');
            const dragSrcParent = dragSrcElement.parentElement;
            const targetParent = element.parentElement;
            const temp = document.createElement('div');
            targetParent.replaceChild(temp, element);
            dragSrcParent.replaceChild(element, dragSrcElement);
            targetParent.replaceChild(dragSrcElement, temp);
        }
    }
    document.querySelectorAll('.over').forEach(el => el.classList.remove('over'));
    checkWin();
}

document.getElementById('gameBoard').addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
});

document.getElementById('gameBoard').addEventListener('drop', (e) => {
    e.preventDefault();
    let target = e.target;
    if (target && target.tagName === 'IMG' && dragSrcElement) {
        if (dragSrcElement.src === target.src) {
            dragSrcElement.parentElement.innerHTML = '';
            target.parentElement.innerHTML = '';
        } else {
            dragSrcElement.classList.remove('hidden');
            const dragSrcParent = dragSrcElement.parentElement;
            const targetParent = target.parentElement;
            const temp = document.createElement('div');
            targetParent.replaceChild(temp, target);
            dragSrcParent.replaceChild(target, dragSrcElement);
            targetParent.replaceChild(dragSrcElement, temp);
        }
    }
    checkWin();
});

function dragEnd(e) {
    e.preventDefault();
    this.classList.remove('hidden');
}

let timer;
let timeLeft = 30;

function startTimer() {
    timeLeft = 30;
    document.getElementById('time').textContent = timeLeft;
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert('Temps écoulé! Vous avez perdu.');
        }
    }, 1000);
}

function checkWin() {
    const images = document.querySelectorAll('#gameBoard img');
    if (images.length === 0) {
        clearInterval(timer);
        alert('Félicitations! Vous avez gagné.');
    }
}

class Windows {
    #backgroundColorHeader;
    #backgroundColorBody;
    #left;
    #top;
    #element;

    constructor(backgroundColorHeader, backgroundColorBody, left, top) {
        this.#backgroundColorHeader = backgroundColorHeader;
        this.#backgroundColorBody = backgroundColorBody;
        this.#left = left;
        this.#top = top;
        this.#element = null;
    }

    create() {
        let zIndex = 1;
        let parent = document.createElement('div');
        parent.style.backgroundColor = this.#backgroundColorBody;
        parent.style.left = this.#left + 'px';
        parent.style.top = this.#top + 'px';
        parent.classList.add('parent');

        let header = document.createElement('header');
        header.style.backgroundColor = this.#backgroundColorHeader;
        header.innerHTML = 'header';
        header.contentEditable = true;

        let div = document.createElement('div');
        div.style.backgroundColor = this.#backgroundColorBody;
        div.innerHTML = 'content';
        div.contentEditable = true;

        parent.appendChild(header);
        parent.appendChild(div);
        parent.style.zIndex = ++zIndex +'';
        this.#element = parent;
        document.body.appendChild(parent);

        let drag_and_drop = false;
        let elem;
        let startX;
        let startY;
        window.addEventListener('mousedown', function (event) {
            if (event.target.closest('.parent')) {
                drag_and_drop = true;
                elem = event.target;
                elem.style.zIndex = zIndex++ + '';

                startX = event.pageX;
                startY = event.pageY;
            }
        });
        window.addEventListener('mousemove', function (event) {
            if (drag_and_drop) {
                let newCoordX = event.pageX;
                let newCoordY = event.pageY;
                let dx = parseInt(getComputedStyle(elem).left) + (newCoordX - startX);
                let dy = parseInt(getComputedStyle(elem).top) + (newCoordY - startY);

                elem.style.left = newCoordX + 'px';
                elem.style.top = newCoordY + 'px';

                startX = newCoordX;
                startY = newCoordY;
            }
        });
        window.addEventListener('mouseup', function (event) {
            if (drag_and_drop) {
                drag_and_drop = false;
            }
        })
    }

    serialize() {
        let obj = {
            backgroundColorHeader: this.#backgroundColorHeader,
            backgroundColorBody: this.#backgroundColorBody,
            left: parseInt(getComputedStyle(this.#element).left),
            top: parseInt(getComputedStyle(this.#element).top),
            contentHeader: this.#element.querySelector('header').innerHTML,
            contentDiv: this.#element.querySelector('div').innerHTML,
            zIndex: this.#element.style.zIndex
        }
        return JSON.stringify(obj);

    }

    deserialize(obj) {
        this.create();
        this.#element.style.backgroundColor = this.#backgroundColorBody = obj.backgroundColorBody;
        this.#element.querySelector('header').style.backgroundColor = this.#backgroundColorHeader = obj.backgroundColorHeader;
        this.#element.style.left = obj.left + 'px';
        this.#element.style.top = obj.top + 'px';
        this.#element.querySelector('header').innerHTML = obj.contentHeader;
        this.#element.querySelector('div').innerHTML = obj.contentDiv;
        this.#element.style.zIndex = obj.zIndex;
    }
}

let windows = [];
window.addEventListener('contextmenu', function (event) {
    event.preventDefault();
    windows.push(new Windows(randomColor(), randomColor(), event.pageX, event.pageY));
    windows[windows.length - 1].create();
});

window.addEventListener('unload', function () {
    let newWindows = [];
    for (let elem of windows)
        newWindows.push(elem.serialize());

    localStorage.setItem('windows', JSON.stringify(newWindows));
});

window.addEventListener('load', function () {
    if (localStorage.getItem('windows')) {
        let strWindows = JSON.parse(localStorage.getItem('windows'));

        for (let elem of strWindows) {
            windows.push(new Windows());
            windows[windows.length - 1].deserialize(JSON.parse(elem));
        }
    }
});

function randomColor() {
    let colorsLetters = ['a', 'b', 'c', 'd', 'e', 'f'];
    let color = '';

    for (let i = 0; i < 3; i++) {
        let randomNumber = Math.round(Math.random() * 5);
        color += colorsLetters[randomNumber];
    }
    return '#' + color;
}
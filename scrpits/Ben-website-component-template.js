

//kartu-item
class KartuItem extends HTMLElement{
    constructor(){
        super()
        const shadow = this.attachShadow({mode:"open"});

        const style = document.createElement("style");
        style.textContent = `
        .card {
            display: flex;
            max-width: clamp(400px, 4rem, 600px);
            border: 1px solid #530404ff;
            border-radius: 10px;
            overflow: hidden;
            font-family: inherit;
            background: var(--companyLightNavy);
            box-shadow: 0 2px 7px  rgba(0,0,0,0.2)
        }
        .image {
            flex: 0 0 35%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #ffffffff;
            
        }
        .image img {
            display: block;
            width: 90%;
            height: 90%;
            object-fit: cover;
        
        }
        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            margin: 10px;
        }
        .title {
            font-size: 1.3rem;
            font-weight: bold;
            margin-bottom: 10px;
            background: #fff;
            padding: 10px ;
            border-radius: 10px;
        }
        .brand {
            font-size: 1rem;
            color: #888;
            margin-bottom: 4px;
        }
        .details {
            flex: 1;
            display: grid;
            grid-template-columns: auto 1fr;
            
            column-gap: 12px;
            font-size: 0.95rem;
            margin-bottom: 6px;
        }
        .details div {
            padding: 2px 0;
        }
        .label {
            font-weight: 600;
            color: #f8f2f2ff;
        }
        .value {
            color: #fff;
        }
        .info{
        display: flex;
        gap: 5px;
        align-items: center;
        }
        .info slot::slotted(img), .info slot::slotted(span) {
            width: 20px;
            
    

          
        }
        `;

        const wrapper = document.createElement("div");
        wrapper.classList.add("card");
        wrapper.innerHTML = `
        <div class="image">
            <img>
        </div>
        <div class="content">
            <div class="title">
                <slot name="title">Default Title</slot>
            </div>
            <div class="details">
                <div class="label">Brand</div>
                <div class="value">
                    <slot name="brand">-</slot>
                </div>
                <div class="label">ID</div>
                <div class="value">
                    <slot name="lot">-</slot>
                </div>
                <div class="label">Exp</div>
                <div class="value">
                    <slot name="exp">-</slot>
                </div>
                <div class="label">Masuk</div>
                <div class="value">
                    <slot name="masuk">-</slot>
                </div>
                <div class="label">Keluar</div>
                <div class="value">
                    <slot name="keluar">-</slot>
                </div>
            </div>
            <div class="info">
                <slot name="info"></slot>
            </div>
        </div>
        `;
        shadow.appendChild(style);
        shadow.appendChild(wrapper);
    }
    static get observedAttributes() {
        return ["src","alt"];
    }
    attributeChangedCallback(name, oldVal, newVal){
        const img = this.shadowRoot.querySelector("img");
        if (name === "src") img.src = newVal;
        if (name === "alt") img.alt = newVal;

        
    }
}
customElements.define("kartu-item",KartuItem);

// kartu-carousel
class KartuCarousel extends HTMLElement {
    constructor(){
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = `
        :host{
            display: block;

            box-sizing: border-box;
        }
        .carousel{
            position: relative;
            overflow: hidden;
            width: 100%;
        }
        .viewport{
            overflow: hidden;
            width: 100%;
        }
        .track{
            display: flex;
            transition: transform 300ms ease;
            will-change: transform;
        }
        ::slotted(*){
            flex: 0 0 100%;
            box-sizing: border-box;
            padding: 8px;
        }
        button.nav{
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0,0,0,0.5);
            color: #fff;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            z-index: 10;
        }
        button.prev{ left: 8px }
        button.next{ right: 8px }
        .dots{
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: 8px;
            display:flex;
            gap:6px;
            z-index: 11;
        }
        .dot{
            width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,0.5);cursor:pointer
        }
        .dot.active{ background: white }
        `;

        const wrapper = document.createElement('div');
        wrapper.classList.add('carousel');
        wrapper.innerHTML = `
            <button class="nav prev">‹</button>
            <div class="viewport">
                <div class="track"><slot></slot></div>
            </div>
            <button class="nav next">›</button>
            <div class="dots" part="dots"></div>
        `;

        shadow.appendChild(style);
        shadow.appendChild(wrapper);

        this._shadow = shadow;
        this._track = shadow.querySelector('.track');
        this._slot = shadow.querySelector('slot');
        this._prev = shadow.querySelector('.prev');
        this._next = shadow.querySelector('.next');
        this._dots = shadow.querySelector('.dots');

        this._index = 0;
        this._slides = [];
        this._onSlotChange = this._onSlotChange.bind(this);
        this._prevHandler = this.prev.bind(this);
        this._nextHandler = this.next.bind(this);
    }

    connectedCallback(){
        this._slot.addEventListener('slotchange', this._onSlotChange);
        this._prev.addEventListener('click', this._prevHandler);
        this._next.addEventListener('click', this._nextHandler);
        // initial population
        this._onSlotChange();
        // keyboard navigation
        this.addEventListener('keydown', e => {
            if(e.key === 'ArrowLeft') this.prev();
            if(e.key === 'ArrowRight') this.next();
        });
    }

    disconnectedCallback(){
        this._slot.removeEventListener('slotchange', this._onSlotChange);
        this._prev.removeEventListener('click', this._prevHandler);
        this._next.removeEventListener('click', this._nextHandler);
    }

    _onSlotChange(){
        const assigned = this._slot.assignedElements({flatten:true});
        this._slides = assigned.filter(n => n.nodeType === Node.ELEMENT_NODE);
        // ensure each slide is full width by setting style if needed
        this._slides.forEach(el => {
            // let the component control spacing; keep existing element styles
            el.style.boxSizing = 'border-box';
        });
        // build dots
        this._buildDots();
        // clamp index
        if(this._index >= this._slides.length) this._index = Math.max(0, this._slides.length - 1);
        this._update();
    }

    _buildDots(){
        this._dots.innerHTML = '';
        this._slides.forEach((_, i) => {
            const d = document.createElement('div');
            d.className = 'dot' + (i === this._index ? ' active' : '');
            d.addEventListener('click', () => { this.goTo(i); });
            this._dots.appendChild(d);
        });
    }

    _update(){
        const offset = -this._index * 100;
        this._track.style.transform = `translateX(${offset}%)`;
        // update dots
        Array.from(this._dots.children).forEach((d, i) => {
            d.classList.toggle('active', i === this._index);
        });
    }

    next(){
        if(this._slides.length === 0) return;
        this._index = (this._index + 1) % this._slides.length;
        this._update();
    }

    prev(){
        if(this._slides.length === 0) return;
        this._index = (this._index - 1 + this._slides.length) % this._slides.length;
        this._update();
    }

    goTo(i){
        if(i < 0 || i >= this._slides.length) return;
        this._index = i;
        this._update();
    }
}

customElements.define('kartu-carousel', KartuCarousel);
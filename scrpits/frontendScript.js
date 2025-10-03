// Legacy card script kept (but guarded) in case you use non-webcomponent card layout
const cards = document.querySelectorAll(".card");
let current = 0;

function renderCards(){
    cards.forEach((card, i) => {
        if (i == current) {
            card.style.transform = "translateY(0) translateZ(0)";
            card.style.zIndex = 10;
            card.style.opacity =  1
        } else if (i < current){
            card.style.transform = "translateY(-80px) translateZ(-150px)";
            card.style.zIndex = i;
            card.style.opacity = 0.3;
        } else {
            card.style.transform = "translateY(-40px) translateZ(-50px)";
            card.style.zIndex = i;
            card.style.opacity = 0.6;
        }
    })
}

const forwardBtn = document.querySelector(".forward");
const backwardBtn = document.querySelector(".backward");
if(forwardBtn) forwardBtn.addEventListener("click", () => {
    if (cards.length === 0) return;
    current = (current + 1) % cards.length;
    renderCards();
});

if(backwardBtn) backwardBtn.addEventListener("click", () => {
    if (cards.length === 0) return;
    current = (current - 1 + cards.length) % cards.length;
    renderCards();
});

// Cart toggle behavior: show/hide the kartu-carousel by toggling `.open`
const cartToggle = document.getElementById('cart-toggle');
const cartEl = document.getElementById('list-barang');
if(cartToggle && cartEl){
    cartToggle.addEventListener('click', () => {
        const isOpen = cartEl.classList.toggle('open');
        cartToggle.setAttribute('aria-expanded', String(isOpen));
        document.body.classList.toggle('cart-open', isOpen);
    });
}
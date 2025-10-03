async function loadKartu() {
    const res = await fetch("data.json");
    const items = await res.json();

    const container = document.getElementById("list-barang");

    items.forEach(item => {
        const card = document.createElement("kartu-item");
        card.setAttribute("src", item.src);
        card.setAttribute("alt", item.alt);

        card.innerHTML =
        `
            <span slot="title">${item.title}</span>
            <span slot="brand">${item.brand}</span>
            <span slot="lot">${item.lot}</span>
            <span slot="exp">${item.exp}</span>
            <span slot="masuk">${item.masuk}</span>
            <span slot="keluar">${item.keluar}</span>

        `;
        item.info.forEach(icon => {
            const img = document.createElement("img");
            img.setAttribute("slot","info");
            img.setAttribute("src", icon);
            img.setAttribute("alt", " ")
            card.appendChild(img);
        })
        container.appendChild(card);  
    });
}
loadKartu();
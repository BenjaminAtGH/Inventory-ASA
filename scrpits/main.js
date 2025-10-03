fetch("data.json").then(res => res.json()).then(items =>{

    const container = document.getElementById("list-barang");
    items.forEach(item => {
    const kartu = document.createElement("kartu-item");
    // data.json uses the key "src" for image path
    kartu.setAttribute("src", item.src);
    // prefer explicit alt if present, otherwise fall back to title
    kartu.setAttribute("alt", item.alt || item.title);
         kartu.innerHTML = `
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
            img.setAttribute("alt", " ");
            kartu.appendChild(img);
        })
        container.appendChild(kartu);
        
    });
})
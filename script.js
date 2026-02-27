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
// DATA MENU FRUIT
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
    // Kita cari container-nya
    const box = document.getElementById('fruit-list'); 
    if(!box) {
        console.error("Elemen fruit-list tidak ditemukan!");
        return;
    }
    
    box.innerHTML = ""; 
    
    MENU_FRUIT.forEach((item, index) => {
        if (item.header) {
            box.innerHTML += `<div class="item-header" style="background: #2c3e50; color: #fff; padding: 10px; margin-top: 10px; font-weight: bold; border-radius: 12px; text-align: center; margin-bottom: 8px; font-size:12px;">${item.n}</div>`;
        } else {
            const out = item.s <= 0;
            box.innerHTML += `
            <div class="item-joki-cart" id="item-${index}" style="display:flex; justify-content:space-between; align-items:center; padding:12px; background:${out ? '#161b22' : 'var(--inactive)'}; margin-bottom:8px; border-radius:15px; border:1px solid ${out ? '#21262d' : 'var(--border)'}; opacity:${out ? '0.6' : '1'}">
                <div style="flex:1">
                    <div style="font-weight:600; font-size:14px;">${item.n}</div>
                    <div style="color:var(--primary); font-size:12px;">Rp ${item.p.toLocaleString()} | Stock: ${item.s}</div>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <button onclick="updateCart(${index}, -1)" style="width:28px; height:28px; border-radius:8px; border:none; background:#30363d; color:white; cursor:pointer;">-</button>
                    <span id="qty-${index}" style="font-weight:800; min-width:15px; text-align:center;">0</span>
                    <button onclick="updateCart(${index}, 1)" style="width:28px; height:28px; border-radius:8px; border:none; background:${out ? '#21262d' : 'var(--primary)'}; color:${out ? '#484f58' : 'black'}; cursor:${out ? 'not-allowed' : 'pointer'}; font-weight:800;">${out ? 'X' : '+'}</button>
                </div>
            </div>`;
        }
    });
}

function updateCart(index, delta) {
    if (MENU_FRUIT[index].s <= 0 && delta > 0) return alert("Stok Habis Lek!");
    if (!cart[index]) cart[index] = 0;
    
    if (delta > 0 && cart[index] >= MENU_FRUIT[index].s) {
        return alert("Stok tidak mencukupi Lek!");
    }

    cart[index] += delta;
    if (cart[index] < 0) cart[index] = 0;

    document.getElementById(`qty-${index}`).innerText = cart[index];
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
    validasi();
}

function selectPay(m, el) {
    selectedPay = m;
    document.querySelectorAll('.pay-bar').forEach(p => p.classList.remove('selected'));
    el.classList.add('selected');
    validasi();
}

function validasi() {
    const u = document.getElementById('userRoblox').value;
    const w = document.getElementById('waUser').value;
    const hasItems = Object.values(cart).some(q => q > 0);
    const btn = document.getElementById('btnGas');
    if(btn) btn.disabled = !(u && w && hasItems && selectedPay);
}

// Tambahkan listener manual untuk input agar validasi real-time
document.addEventListener('input', validasi);

async function prosesPesanan() {
    document.getElementById('loading-overlay').style.display = 'flex';
    currentTid = "XZY-" + Math.floor(Math.random()*900000+100000);
    const u = document.getElementById('userRoblox').value;
    const w = document.getElementById('waUser').value;
    const itm = document.getElementById('detailText').value;
    const tot = document.getElementById('totalAkhir').innerText;

    try {
        await db.ref('orders/' + currentTid).set({
            tid: currentTid, status: "pending", user: u, wa: w, items: itm, total: tot, method: selectedPay, timestamp: Date.now()
        });
        
        const form = document.getElementById('hiddenForm');
        document.getElementById('f_subject').value = `PESANAN FRUIT [${currentTid}]`;
        document.getElementById('f_tid').value = currentTid;
        document.getElementById('f_user').value = u;
        document.getElementById('f_wa').value = w;
        document.getElementById('f_pesanan').value = itm;
        document.getElementById('f_total').value = tot;
        fetch(form.action, { method: "POST", body: new FormData(form) });

        setTimeout(() => {
            document.getElementById('loading-overlay').style.display = 'none';
            switchSlide(1, 2);
            document.getElementById('displayTid').innerText = currentTid;
            document.getElementById('payNominal').innerText = tot;
            document.getElementById('payMethodInfo').innerText = selectedPay;
            
            const gbrQR = document.getElementById('gambar-qris');
            if (selectedPay === "QRIS") {
                document.getElementById('qris-display').style.display = "block";
                gbrQR.src = "https://drive.google.com/uc?export=view&id=1LkkjYoIP_Iy_LQx4KEm8TtXiI5q57IfJ";
            } else {
                document.getElementById('qris-display').style.display = "none";
            }
        }, 1500);

        db.ref('orders/' + currentTid + '/status').on('value', snap => {
            if(snap.val() === 'success') tampilkanSlide3(currentTid, u, itm, tot);
        });

    } catch (e) { alert("Database Error!"); }
}

function switchSlide(from, to) {
    document.getElementById('slide-' + from).style.display = 'none';
    document.getElementById('slide-' + to).style.display = 'block';
    document.getElementById('slide-' + to).classList.add('active');
}

// PAKAI INI AGAR LEBIH AMAN
document.addEventListener('DOMContentLoaded', init);

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

// 2. UPDATE KERANJANG
function updateCart(index, delta) {
    if (!cart[index]) cart[index] = 0;
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

// 3. HITUNG TOTAL
function hitung() {
    let txt = ""; let subtotal = 0;
    DATA_PRODUK.forEach((item, index) => {
        if (cart[index] > 0) {
            txt += `${item.n} (${cart[index]}x), `;
            subtotal += (item.p * cart[index]);
        }
    });
    let finalTotal = subtotal - (subtotal * discount);
    document.getElementById('detailText').value = txt.slice(0, -2);
    document.getElementById('totalAkhir').innerText = "Rp " + finalTotal.toLocaleString();
    validasi(); // Panggil validasi tombol
}

// 4. VOUCHER SYSTEM
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

// 5. PILIH PEMBAYARAN
function selectPay(m, el) {
    selectedPay = m;
    document.querySelectorAll('.pay-bar').forEach(p => p.classList.remove('selected'));
    el.classList.add('selected');
    validasi();
}

// 6. VALIDASI TOMBOL (SINKRON DENGAN ONINPUT DI HTML)
function validasi() {
    const u = document.getElementById('userRoblox').value;
    const w = document.getElementById('waUser').value;
    const hasItems = Object.values(cart).some(q => q > 0);
    const btn = document.getElementById('btnGas');
    
    // Aktifkan tombol jika User, WA, Item, dan Payment sudah diisi
    btn.disabled = !(u && w && hasItems && selectedPay);
}

// 7. PROSES PESANAN
async function prosesPesanan() {
    const loader = document.getElementById('loading-overlay');
    loader.style.display = 'flex';

    currentTid = "XZY-" + Math.floor(Math.random()*900000+100000);
    const u = document.getElementById('userRoblox').value;
    const w = document.getElementById('waUser').value;
    const itm = document.getElementById('detailText').value;
    const tot = document.getElementById('totalAkhir').innerText;

    try {
        // Kirim ke Firebase (Tanpa Field Pass)
        await db.ref('orders/' + currentTid).set({
            tid: currentTid, status: "pending", user: u, wa: w, items: itm, total: tot, method: selectedPay, timestamp: Date.now()
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
            
            // Link QRIS kamu
            const linkQRIS = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=ISI_DENGAN_LINK_PEMBAYARAN_MU";

            if (selectedPay === "QRIS") {
                infoTeks.innerText = "SILAKAN SCAN QRIS DI BAWAH";
                gbrQR.src = linkQRIS;
                qrisBox.style.display = "block"; 
            } else {
                qrisBox.style.display = "none"; 
                if (selectedPay === "DANA") infoTeks.innerText = "DANA: 089677323404";
                else if (selectedPay === "OVO") infoTeks.innerText = "OVO: 089517154561";
                else if (selectedPay === "GOPAY") infoTeks.innerText = "GOPAY: 089517154561";
            }
        }, 1200);

        // Realtime Listener Status Sukses
        db.ref('orders/' + currentTid + '/status').on('value', snap => {
            if(snap.val() === 'success') {
                tampilkanSlide3(currentTid, u, itm, tot);
            }
        });

    } catch (err) {
        loader.style.display = 'none';
        alert("Gagal koneksi database! Periksa Firebase kamu.");
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

// FIX SWITCH SLIDE SUPAYA TIDAK TUMPUK
function switchSlide(from, to) {
    const f = document.getElementById('slide-' + from);
    const t = document.getElementById('slide-' + to);
    
    if(f) f.classList.remove('active');
    
    setTimeout(() => {
        if(t) {
            t.classList.add('active');
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    }, 100);
}

window.onload = init;

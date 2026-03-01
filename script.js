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
    { n: "✦ Control", p: 20000, s: 1 },
    { n: "✦ Gas", p: 15000, s: 1 },
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

// 1. Munculkan Daftar Fruit & Baca Stok dari Firebase
async function init() {
    const box = document.getElementById('joki-list');
    if(!box) return;
    
    box.innerHTML = "<p style='text-align:center; color:var(--primary);'>Mengecek stok di Firebase...</p>"; 

    try {
        const snapshot = await db.ref('fruit_stocks').once('value');
        const stokFirebase = snapshot.val() || {};

        box.innerHTML = ""; 
        MENU_FRUIT.forEach((item, index) => {
            if (item.header) {
                box.innerHTML += `<div class="item-header" style="background:#1c2128; color:var(--primary); padding:10px; margin-top:15px; font-weight:800; border-radius:12px; text-align:center; font-size:12px; border: 1px solid var(--border);">${item.n}</div>`;
            } else {
                let s = (stokFirebase[item.n] !== undefined) ? stokFirebase[item.n] : (item.s || 0);
                let isHabis = s <= 0;

                box.innerHTML += `
                <div class="item-joki-cart" id="item-${index}" style="${isHabis ? 'opacity:0.5; pointer-events:none;' : ''}">
                    <div style="flex:1">
                        <div style="font-weight:600; font-size:14px;">${item.n}</div>
                        <div style="color:var(--primary); font-size:12px; font-weight:800;">
                            Rp ${item.p.toLocaleString()} | 📦 Stok: <span style="color:${isHabis ? 'red' : 'inherit'}">${isHabis ? 'HABIS' : s}</span>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <button onclick="updateCart(${index}, -1)" class="btn-vouch" style="padding: 5px 12px;">-</button>
                        <span id="qty-${index}" style="font-weight:800; min-width:15px; text-align:center;">0</span>
                        <button onclick="updateCart(${index}, 1)" class="btn-vouch" style="padding: 5px 12px; background:var(--primary); color:black;" ${isHabis ? 'disabled' : ''}>+</button>
                    </div>
                </div>`;
                item.currentStock = s;
            }
        });
    } catch (err) {
        box.innerHTML = "<p style='text-align:center; color:red;'>Gagal koneksi stok database!</p>";
    }
}

// 2. Update Keranjang
function updateCart(index, delta) {
    if (!cart[index]) cart[index] = 0;
    
    const item = MENU_FRUIT[index];
    const stokTersedia = item.currentStock || 0;

    if (delta > 0 && cart[index] >= stokTersedia) {
        alert("Waduh Lek, stok " + item.n + " sisa " + stokTersedia + " aja!");
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

// 3. Hitung Total & Diskon
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

// 4. Voucher
function applyVoucher() {
    const code = document.getElementById('vouchCode').value.toUpperCase();
    const daftarVoucher = { "XZYOFRUIT": 0.10, "FEB2026": 0.15 };
    if (daftarVoucher[code] !== undefined) {
        discount = daftarVoucher[code];
        alert(`✅ Voucher Berhasil! Diskon ${discount * 100}%`);
    } else {
        discount = 0;
        alert("❌ Voucher Tidak Valid!");
    }
    hitung();
}

// 5. Pilih Pembayaran
function selectPay(m, el) {
    selectedPay = m;
    document.querySelectorAll('.pay-bar').forEach(p => p.classList.remove('selected'));
    el.classList.add('selected');
    validasi();
}

// 6. Validasi Tombol
function validasi() {
    const u = document.getElementById('userRoblox').value.trim();
    const w = document.getElementById('waUser').value.trim();
    const hasItems = Object.values(cart).some(q => q > 0);
    document.getElementById('btnGas').disabled = !(u && w && hasItems && selectedPay);
}

// 7. Proses Pesanan (DENGAN AUTO WA +62)
async function prosesPesanan() {
    const loader = document.getElementById('loading-overlay');
    loader.style.display = 'flex';

    currentTid = "XZY-" + Math.floor(Math.random()*900000+100000);
    const u = document.getElementById('userRoblox').value;
    
    // LOGIKA AUTO UBAH 0 KE 62
    let w = document.getElementById('waUser').value.trim();
    if (w.startsWith('0')) {
        w = '62' + w.substring(1);
    } else if (!w.startsWith('62') && w !== "") {
        w = '62' + w;
    }

    const itm = document.getElementById('detailText').value;
    const tot = document.getElementById('totalAkhir').innerText;

    try {
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
            const linkQRIS = "https://i.ibb.co.com/Y4bRyxjc/IMG-20260227-021950.png";

            if (selectedPay === "QRIS") {
                infoTeks.innerText = "SILAKAN SCAN QRIS DI BAWAH";
                gbrQR.src = linkQRIS; 
                qrisBox.style.display = "block"; 
            } else {
                qrisBox.style.display = "none"; 
                if (selectedPay === "DANA") { infoTeks.innerText = "DANA: 089677323404"; } 
                else if (selectedPay === "OVO") { infoTeks.innerText = "OVO: 089517154561"; } 
                else if (selectedPay === "GOPAY") { infoTeks.innerText = "GOPAY: 089517154561"; }
            }
        }, 1500);

        // AUTO POTONG STOK JIKA STATUS "SUCCESS"
        db.ref('orders/' + currentTid + '/status').on('value', snap => {
            if(snap.val() === 'success') {
                potongStokOtomatis(itm); 
                tampilkanSlide3(currentTid, u, itm, tot);
                db.ref('orders/' + currentTid + '/status').off();
            }
        });

    } catch (err) {
        loader.style.display = 'none';
        alert("Gagal koneksi database!");
    }
}

// 8. Kirim Data Ke Telegram
function kirimFormSubmit(tid, u, w, itm, tot) {
    const telegramToken = "7660131449:AAHatRgPbQBTbnvToAoKiXFYd4V4UhwcnsQ";
    const telegramChatId = "6076444140";
    const linkFirebase = `https://console.firebase.google.com/project/${firebaseConfig.projectId}/database/xzyo-s-default-rtdb/data/orders/${tid}`;

    const pesan = `🚀 *PESANAN BARU - XZYO STORE*%0A` +
                  `━━━━━━━━━━━━━━━━━━━━%0A` +
                  `🆔 *Order ID:* \`${tid}\` %0A` +
                  `👤 *Username:* ${u}%0A` +
                  `📱 *WA:* [Chat Customer](https://wa.me/${w})%0A` +
                  `📦 *Fruit:* ${itm}%0A` +
                  `💰 *Total:* *${tot}*%0A` +
                  `💳 *Metode:* ${selectedPay}%0A` +
                  `━━━━━━━━━━━━━━━━━━━━%0A` +
                  `✅ *[KLIK UNTUK KONFIRMASI](${linkFirebase})*%0A` +
                  `_(Ubah status jadi "success" di Firebase)_`;

    fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage?chat_id=${telegramChatId}&text=${pesan}&parse_mode=Markdown&disable_web_page_preview=true`);
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
    setTimeout(() => { 
        document.getElementById('slide-' + to).classList.add('active'); 
        window.scrollTo(0,0);
    }, 150);
}

// MESIN POTONG STOK
function potongStokOtomatis(itmString) {
    if (!itmString) return;
    const daftarOrder = itmString.split(', ');

    daftarOrder.forEach(order => {
        const namaBuah = order.split(' (')[0].trim();
        const match = order.match(/\d+/);
        if (match) {
            const jumlahBeli = parseInt(match[0]);
            const stokRef = db.ref('fruit_stocks/' + namaBuah);

            stokRef.transaction((currentStock) => {
                if (currentStock === null) return currentStock;
                let sisa = currentStock - jumlahBeli;
                return sisa < 0 ? 0 : sisa;
            });
        }
    });
}

window.onload = init;


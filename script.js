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

const MENU_JOKI = [
    //===== KEN HAKI =====//
    { n: "👁️ KEN HAKI (INSTINCT)", header: true },
    { n: "✦ 0 – 1.000", p: 5000 },
    { n: "✦ 1.000 – 2.000", p: 8000 },
    { n: "✦ 2.000 – 5.000 (MAX) + V2(Full)", p: 15000 },
    { n: "✦ 0 – 5.000 (MAX) + V2(Full)", p: 20000 },
    //===== BOUNTY =====//
    { n: "🏴‍☠️ JOKI BOUNTY / HONOR", p: 0, header: true },
    { n: "✦ 1M Bounty / Honor", p: 25000 },
    { n: "✦ 5M Bounty / Honor", p: 100000 },
    { n: "✦ 10M Bounty / Honor", p: 225000 },
    { n: "✦ 30M Bounty (MAX)", p: 700000 },
    //===== BELLY AND FRAGMENT =====//
    { n: "💸 JOKI BELLY & FRAGMENT", p: 0, header: true },
    { n: "✦ Belly 1M", p: 5000 },
    { n: "✦ Belly 5M", p: 20000 },
    { n: "✦ Fragment 1K", p: 1000 },
    { n: "✦ Fragment 20K", p: 20000 },
    //===== LEVEL AND SEA =====//
    { n: "🔥 JOKI LEVEL & SEA", p: 0, header: true },
    { n: "✦ Level 1 – 100", p: 15000 },
    { n: "✦ Level 1 – 700 (Free Unlock Sea 2)", p: 15000 },
    { n: "✦ Level 700 – 1500 (Free Unlock Sea 3)", p: 15000 },
    { n: "✦ Lexvel 1500 – MAX (Sea 3)", p: 20000 },
    { n: "✦ Paket Level 1 - MAX(Bonus GH)", p: 100000 },
    { n: "✦ Unlock Sea 2 / 3", p: 5000 },
    //===== FIGHTING STYLE =====//
    { n: "👊 FIGHTING STYLE (MELEE)", p: 0, header: true },
    { n: "✦ God Human (Full)", p: 30000 },
    { n: "✦ Superhuman", p: 15000 },
    { n: "✦ Sharkman Karate / Electric Claw", p: 5000 },
    { n: "✦ Death Step", p: 5000 },
    //===== PAKETAN =====//
    { n: "⚔️ BOSS • WEAPON • EXCLUSIVE", p: 0, header: true },
    { n: "✦ CDK (Cursed Dual Katana)", p: 20000 },
    { n: "✦ Soul Guitar (Full Quest)", p: 10000 },
    { n: "✦ TTK (True Triple Katana)", p: 25000 },
    { n: "✦ Shark Anchor (Full)", p: 30000 },
    { n: "✦ Fox Lamp (Kitsune)", p: 30000 },
    { n: "✦ Tushita / Yama", p: 8000 },
    { n: "✦ Hallow Scythe", p: 15000 },
    { n: "✦ Dark Dagger", p: 25000 },
    { n: "✦ Rip Indra / Dough King / DB", p: 10000 },
    { n: "✦ Koko", p: 10000 },
    { n: "✦ Saber / Rengoku", p: 5000 },
    //===== AWEKEN AND MASTERY =====//
    { n: "💥 AWEKENING FRUIT & MASTERY", p: 0, header: true },
    { n: "✦ Mastery Fruit/Sword/FS (per 100)", p: 5000 },
    { n: "✦ Mastery Max (600 Mastery)", p: 25000 },
    { n: "✦ Awekening Fruit biasa(Full)", p: 10000 },
    { n: "✦ Awekening Phoenix / Buddha / Dough (Full)", p: 10000 },
    //===== RACE =====//
    { n: "🧬 RACE EVOLUTION", p: 0, header: true },
    { n: "✦ Unlock Cyborg", p: 15000 },
    { n: "✦ Unlock Ghoul", p: 25000 },
    { n: "✦ Race V1 – V3 (All Race)", p: 8000 },
    { n: "✦ Blue Gear(Sudah Kill DK Dan Rip Indra)", p: 10000 },
    { n: "✦ 1x Trial", p: 10000 },
    { n: "✦ Full Gear", p: 30000 },
    { n: "✦ True Gear(All Race)", p: 10000 },
    //===== DRACO =====//
    { n: "🔱 RACE DRACO (PREMIUM)", p: 0, header: true },
    { n: "✦ Unlock Draco", p: 20000 },
    { n: "✦ Draco V1 – V3", p: 10000 },
    { n: "✦ 1x Trial Draco", p: 15000 },
    { n: "✦ Full Gear Draco", p: 40000 },
    //===== MATERIALS AND SEA EVEMNT =====//
    { n: "🌋 SEA EVENTS & MATERIALS", p: 0, header: true },
    { n: "✦ Leviathan Heart / Scale", p: 45000 },
    { n: "✦ Unlock V4 Draco(Freze Hydra)", p: 45000 },
    { n: "✦ Terror Shark Hunt (Eyes/Tooth)x1", p: 5000 },
    { n: "✦ Blaze Ember (99x)", p: 10000 },
    { n: "✦ Kitsune Mask / Ribbon", p: 10000 },
    { n: "✦ Bones / Ectoplasm Farming(100x)", p: 1000 },
    { n: "✦ Dragon Heart / Storm", p: 20000 },
    { n: "✦ TOTS (Tyrant Of The Sky)", p: 5000 }
];

let cart = {}; // Menyimpan jumlah per item
let selectedPay = "", currentTid = "", discount = 0;

function init() {
    const box = document.getElementById('joki-list');
    box.innerHTML = ""; 
    
    MENU_JOKI.forEach((item, index) => {
        if (item.header) {
            box.innerHTML += `<div class="item-header" style="background: #2c3e50; color: #fff; padding: 10px; margin-top: 10px; font-weight: bold; border-radius: 12px; text-align: center; margin-bottom: 8px;">${item.n}</div>`;
        } else {
            box.innerHTML += `
            <div class="item-joki-cart" id="item-${index}" style="display:flex; justify-content:space-between; align-items:center; padding:12px; background:var(--inactive); margin-bottom:8px; border-radius:15px; border:1px solid var(--border);">
                <div style="flex:1">
                    <div style="font-weight:600; font-size:14px;">${item.n}</div>
                    <div style="color:var(--primary); font-size:12px;">Rp ${item.p.toLocaleString()}</div>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <button onclick="updateCart(${index}, -1)" style="width:28px; height:28px; border-radius:8px; border:none; background:#30363d; color:white; cursor:pointer;">-</button>
                    <span id="qty-${index}" style="font-weight:800; min-width:15px; text-align:center;">0</span>
                    <button onclick="updateCart(${index}, 1)" style="width:28px; height:28px; border-radius:8px; border:none; background:var(--primary); color:black; cursor:pointer; font-weight:800;">+</button>
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

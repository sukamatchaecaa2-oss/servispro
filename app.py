import streamlit as st
import pandas as pd
import random
from datetime import datetime

# Set page configurations
st.set_page_config(
    page_title="ServisPro Premium - Sistem Manajemen Servis Elektronik",
    page_icon="🔧",
    layout="wide",
    initial_sidebar_state="expanded"
)

# -------------------------------------------------------------
# 1. INITIALIZE LOCAL DATABASE (st.session_state)
# -------------------------------------------------------------
if 'orders' not in st.session_state:
    st.session_state.orders = [
        {
            "id": "SP-2026-61842",
            "customerName": "Budi Santoso",
            "customerWhatsapp": "081234567811",
            "customerEmail": "budi.santoso@example.com",
            "category": "HP",
            "brandType": "Samsung Galaxy S23 Ultra",
            "complaint": "Layar berkedip hijau setelah jatuh ringan. Touchscreen masih responsif tapi sedikit bergaris putih di bagian bawah.",
            "method": "Antar ke Toko",
            "status": "Sedang Diperbaiki",
            "technicianNotes": "Perlu diganti modul LCD assembly original Samsung. Suku cadang sudah dipesan dan sedang dalam proses pemasangan presisi.",
            "repairCost": 1850000,
            "createdAt": "2026-06-01 10:15"
        },
        {
            "id": "SP-2026-42913",
            "customerName": "Siti Rahma",
            "customerWhatsapp": "085788992211",
            "customerEmail": "siti.rahma@example.com",
            "category": "Laptop",
            "brandType": "Asus ROG Strix G15",
            "complaint": "Suhu sangat panas (overheating) saat bermain game berat. Kipas terdengar sangat bising dan kadang mati mendadak.",
            "method": "Antar ke Toko",
            "status": "Selesai Siap Diambil",
            "technicianNotes": "Dilakukan repaste menggunakan thermal paste premium liquid metal, serta pembersihan debu tebal pada heatsink dan dual fan. Stress test suhu turun dari 95°C ke 78°C.",
            "repairCost": 450000,
            "createdAt": "2026-06-02 09:30"
        },
        {
            "id": "SP-2026-17382",
            "customerName": "Aditya Pratama",
            "customerWhatsapp": "089911223344",
            "customerEmail": "pelanggan@gmail.com",
            "category": "Konsol Game",
            "brandType": "PlayStation 5 Disc Edition",
            "complaint": "Drive optical tidak mau menarik piringan kaset (CD). Ada bunyi klik berulang ketika mencoba memasukkan kaset.",
            "method": "Antar ke Toko",
            "status": "Menunggu Antrean",
            "technicianNotes": "Menunggu antrean untuk dibongkar casing luar guna pengecekan mekanisme pengait internal optical drive.",
            "repairCost": 0,
            "createdAt": "2026-06-03 14:20"
        },
        {
            "id": "SP-2026-88541",
            "customerName": "Rina Wijaya",
            "customerWhatsapp": "087812123434",
            "customerEmail": "rina.wijaya@example.com",
            "category": "TV",
            "brandType": "Xiaomi TV A2 43 Inch",
            "complaint": "Suara siaran TV terdengar jernih, namun layar gelap gulita (tidak ada gambar sama sekali). Backlight mati.",
            "method": "Panggil Teknisi",
            "status": "Sedang Dicek",
            "technicianNotes": "Teknisi sedang melakukan investigasi apakah kerusakan terjadi pada papan mainboard backlight driver atau langsung pada rangkaian LED strip di dalam panel.",
            "repairCost": 0,
            "createdAt": "2026-06-03 16:45"
        },
        {
            "id": "SP-2026-31950",
            "customerName": "Dian Kusuma",
            "customerWhatsapp": "081399008877",
            "customerEmail": "dian.kusuma@example.com",
            "category": "HP",
            "brandType": "Apple iPhone 13 Pro",
            "complaint": "Kamera belakang bergetar hebat saat membuka aplikasi kamera bawaan maupun Instagram. Fokus tidak bisa mengunci.",
            "method": "Panggil Teknisi",
            "status": "Gagal Diperbaiki",
            "technicianNotes": "Sensor stabilizer OIS fisik pada kamera utama mengalami kerusakan mekanis parah akibat benturan keras. Pemilik memutuskan untuk tidak mengganti modul kamera karena biaya melebihi anggaran.",
            "repairCost": 150000,
            "createdAt": "2026-05-31 11:00"
        }
    ]

if 'spareparts' not in st.session_state:
    st.session_state.spareparts = [
        {"id": "SPART-001", "name": "LCD Screen iPhone 13 Pro", "price": 1200000, "stock": 5},
        {"id": "SPART-002", "name": "Battery Samsung S23 Ultra", "price": 350000, "stock": 12},
        {"id": "SPART-003", "name": "Liquid Metal Thermal Paste", "price": 150000, "stock": 25},
        {"id": "SPART-004", "name": "Joystick Analog PS5", "price": 90000, "stock": 18},
        {"id": "SPART-005", "name": "LED Backlight Strip TV 43\"", "price": 250000, "stock": 8},
        {"id": "SPART-006", "name": "Universal IC Power Chip", "price": 75000, "stock": 30}
    ]

if 'user' not in st.session_state:
    st.session_state.user = None

if 'tracked_id' not in st.session_state:
    st.session_state.tracked_id = ""

# -------------------------------------------------------------
# 2. CSS STYLING & COLORS (VIVID CONTRAST DESIGN)
# -------------------------------------------------------------
st.markdown(
    """
    <style>
    /* Google / Gmail Simulated Login CSS override to force vivid contrast */
    div.stButton > button {
        background-color: #1a73e8 !important;
        color: #ffffff !important;
        font-weight: bold !important;
        border-radius: 8px !important;
        border: none !important;
        padding: 10px 24px !important;
        width: 100% !important;
        cursor: pointer !important;
        font-size: 14px !important;
        box-shadow: 0 1px 3px rgba(60,64,67, 0.3), 0 4px 8px 3px rgba(60,64,67, 0.15) !important;
        transition: background-color 0.2s, box-shadow 0.2s !important;
    }
    div.stButton > button:hover {
        background-color: #155cb4 !important;
        box-shadow: 0 2px 6px rgba(60,64,67, 0.35), 0 6px 12px 4px rgba(60,64,67, 0.2) !important;
    }
    div.stButton > button:active {
        background-color: #0c47a1 !important;
    }
    /* Specific accent styling */
    .brand-logo {
        text-align: center;
        font-size: 32px;
        font-weight: 900;
        letter-spacing: -1px;
        margin-bottom: 5px;
    }
    .brand-g { color: #4285F4; }
    .brand-o1 { color: #EA4335; }
    .brand-o2 { color: #FBBC05; }
    .brand-g2 { color: #4285F4; }
    .brand-l { color: #34A853; }
    .brand-e { color: #EA4335; }
    
    .login-container {
        border: 1px solid #e0e0e0;
        border-radius: 20px;
        padding: 35px;
        background-color: #ffffff;
        box-shadow: 0 4px 15px rgba(0,0,0,0.06);
    }
    .user-pill {
        background-color: #e8f0fe;
        color: #1a73e8;
        font-weight: bold;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 11px;
        display: inline-block;
        border: 1px solid #aecbfa;
    }
    .admin-pill {
        background-color: #fce8e6;
        color: #c5221f;
        font-weight: bold;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 11px;
        display: inline-block;
        border: 1px solid #fad2cf;
    }
    .card-stat {
        background-color: #ffffff;
        border: 1px solid #e0e0e0;
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.02);
    }
    .card-stat h3 {
        margin: 0;
        font-size: 14px;
        color: #5f6368;
    }
    .card-stat p {
        margin: 5px 0 0 0;
        font-size: 28px;
        font-weight: bold;
        color: #202124;
    }
    </style>
    """,
    unsafe_allow_html=True
)

# -------------------------------------------------------------
# 3. HELPER FUNCTIONS
# -------------------------------------------------------------
def do_login(email_input, password_input, name_input=""):
    email_clean = email_input.strip().lower()
    if not email_clean:
        st.error("⚠️ Alamat email Gmail tidak boleh kosong!")
        return
    if not password_input.strip():
        st.error("⚠️ Kata sandi (password) tidak boleh kosong!")
        return
    if not email_clean.endswith("@gmail.com"):
        st.error("⚠️ Silakan gunakan alamat email dengan domain @gmail.com yang valid.")
        return
        
    role = "admin" if email_clean == "admin.servispro@gmail.com" else "customer"
    resolved_name = name_input.strip() if name_input.strip() else email_clean.split("@")[0].title()
    
    st.session_state.user = {
        "email": email_clean,
        "name": resolved_name,
        "role": role
    }
    st.success(f"🔓 Berhasil masuk sebagai **{resolved_name}** ({role.upper()})!")
    st.rerun()

def do_logout():
    st.session_state.user = None
    st.session_state.tracked_id = ""
    st.rerun()

# -------------------------------------------------------------
# 4. LOGIN SCREEN IF NOT AUTHENTICATED
# -------------------------------------------------------------
if st.session_state.user is None:
    # Centering structure using st.columns([1, 2, 1])
    col_left, col_mid, col_right = st.columns([1, 2, 1])
    
    with col_mid:
        st.markdown('<div class="login-container">', unsafe_allow_html=True)
        
        # Simulated multi-color Google logo
        st.markdown(
            '<div class="brand-logo">'
            '<span class="brand-g">G</span>'
            '<span class="brand-o1">o</span>'
            '<span class="brand-o2">o</span>'
            '<span class="brand-g2">g</span>'
            '<span class="brand-l">l</span>'
            '<span class="brand-e">e</span>'
            '</div>',
            unsafe_allow_html=True
        )
        
        st.markdown("<h2 style='text-align: center; margin-top:0px; font-weight: 800; color:#202124; font-size: 24px;'>🔑 ServisPro Login</h2>", unsafe_allow_html=True)
        st.markdown("<p style='text-align: center; color: #5f6368; font-size:13px; margin-top:-10px; margin-bottom: 25px;'>Gunakan akun Gmail Anda untuk mengakses sistem secara aman</p>", unsafe_allow_html=True)
        
        # Manual Form Fields
        with st.form("manual_login_form"):
            email_manual = st.text_input("📧 ALAMAT EMAIL GMAIL", placeholder="nama-anda@gmail.com", help="Gunakan admin.servispro@gmail.com untuk masuk sebagai Administrator.")
            password_manual = st.text_input("🔒 KATA SANDI (PASSWORD)", type="password", placeholder="••••••••••••")
            name_manual = st.text_input("👤 NAMA LENGKAP (OPSIONAL)", placeholder="Contoh: Aditya Pratama")
            
            submit_manual = st.form_submit_button("🚀 MASUK KE SISTEM", use_container_width=True)
            if submit_manual:
                do_login(email_manual, password_manual, name_manual)
        
        st.markdown(
            """
            <div style="background-color: #f8f9fa; border: 1px solid #dadce0; border-radius: 12px; padding: 15px; margin-top: 15px; font-size: 11.5px; color: #5f6368; line-height: 1.5;">
                📌 <b>Keterangan Hak Akses (Role):</b><br/>
                • Ketik <b>admin.servispro@gmail.com</b> untuk menduduki hak akses <b>Admin/Owner</b>.<br/>
                • Ketik alamat Gmail lainnya (misal: <i>pelanggan@gmail.com</i>) untuk hak akses <b>Pelanggan</b> biasa.
            </div>
            """,
            unsafe_allow_html=True
        )
                    
        st.markdown('</div>', unsafe_allow_html=True)

# -------------------------------------------------------------
# 5. DASHBOARD AREA IF AUTHENTICATED
# -------------------------------------------------------------
else:
    current_user = st.session_state.user
    
    # ----------------- SIDEBAR -----------------
    with st.sidebar:
        st.image("https://api.dicebear.com/7.x/initials/svg?seed=" + current_user['name'], width=70)
        st.markdown(f"### 👋 Halo, {current_user['name'].split()[0]}!")
        st.write(f"📧 **Email:** `{current_user['email']}`")
        
        if current_user['role'] == 'admin':
            st.markdown('<span class="admin-pill">🔨 AKSES: ADMIN/OWNER</span>', unsafe_allow_html=True)
            st.markdown("---")
            st.markdown("### 🧭 MENU NAVIGASI")
            menu = st.radio(
                "Pilih Halaman Kerja:",
                [
                    "👨💻 Panel Teknisi (Update Status & Potong Stok)",
                    "📊 Dashboard Keuangan & Inventaris Gudang"
                ]
            )
        else:
            st.markdown('<span class="user-pill">👤 AKSES: PELANGGAN</span>', unsafe_allow_html=True)
            st.markdown("---")
            st.markdown("### 🧭 MENU NAVIGASI")
            menu = st.radio(
                "Pilih Halaman Kerja:",
                [
                    "🏠 Beranda Jasa Servis",
                    "📝 Form Booking & Cek Status Order Real-Time"
                ]
            )
            
        st.markdown("---")
        if st.button("🚪 Keluar Akun Google"):
            do_logout()
            
    # ----------------- MAIN PAGES -----------------
    
    # APPLICATION HEADER
    st.markdown(
        f"""
        <div style='background: linear-gradient(135deg, #1e293b, #0f172a); padding: 25px; border-radius: 16px; color: white; display: flex; align-items: center; justify-content: space-between; margin-bottom: 25px;'>
            <div>
                <h1 style='color: white; margin: 0; font-size: 28px;'>🔮 ServisPro Premium</h1>
                <p style='color: #94a3b8; margin: 5px 0 0 0; font-size: 13px;'>Sistem Manajemen Bengkel Servis Elektronik Canggih & Transparan</p>
            </div>
            <div style='text-align: right;'>
                <span style='background-color: rgba(255,255,255,0.1); padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: bold;'>
                    Sesi: {current_user['name']} ({current_user['role'].upper()})
                </span>
            </div>
        </div>
        """,
        unsafe_allow_html=True
    )

    # 1. ADMIN MENU A: PANEL TEKNISI
    if menu == "👨💻 Panel Teknisi (Update Status & Potong Stok)":
        st.title("🛠&zwj;💻 Panel Operasional Teknisi")
        st.write("Kelola antrean servis barang elektronik, lakukan investigasi kerusakan, tentukan tarif, serta perbarui status pengerjaan secara real-time.")
        
        # Statistical counts
        c1, c2, c3, c4 = st.columns(4)
        total_servis = len(st.session_state.orders)
        sedang_kerja = len([o for o in st.session_state.orders if o['status'] == 'Sedang Diperbaiki'])
        selesai_siap = len([o for o in st.session_state.orders if o['status'] == 'Selesai Siap Diambil'])
        antre = len([o for o in st.session_state.orders if o['status'] == 'Menunggu Antrean'])
        
        c1.markdown(f'<div class="card-stat"><h3>📋 Total Order</h3><p>{total_servis}</p></div>', unsafe_allow_html=True)
        c2.markdown(f'<div class="card-stat"><h3>🕒 Menunggu Antrean</h3><p>{antre}</p></div>', unsafe_allow_html=True)
        c3.markdown(f'<div class="card-stat"><h3>⚡ Sedang Diperbaiki</h3><p>{sedang_kerja}</p></div>', unsafe_allow_html=True)
        c4.markdown(f'<div class="card-stat"><h3>✅ Selesai (Siap Diambil)</h3><p>{selesai_siap}</p></div>', unsafe_allow_html=True)
        st.markdown("<br>", unsafe_allow_html=True)

        # Tabbed workspace for orders list & edit actions
        search_q = st.text_input("🔍 Cari Berdasarkan ID Order, Nama, atau Merek Gadget:", "")
        
        # Render Order Table
        filtered_orders = []
        for o in st.session_state.orders:
            if (search_q.lower() in o['id'].lower() or 
                search_q.lower() in o['customerName'].lower() or 
                search_q.lower() in o['brandType'].lower() or 
                search_q.lower() in o['category'].lower()):
                filtered_orders.append(o)
                
        if filtered_orders:
            # Custom styled interactive header
            st.markdown("""
            <div style="background-color: #1e293b; padding: 12px; border-radius: 8px; margin-bottom: 12px; color: white;">
                <div style="display: flex; font-weight: bold; font-size: 13px; align-items: center;">
                    <div style="flex: 1.2;">ID / Tanggal</div>
                    <div style="flex: 2.5;">Rincian Pelanggan & Gadget</div>
                    <div style="flex: 1.8;">Status</div>
                    <div style="flex: 1.5; text-align: right; padding-right: 15px;">Biaya Toko</div>
                    <div style="flex: 2.2; text-align: center;">Tindakan Pekerjaan</div>
                </div>
            </div>
            """, unsafe_allow_html=True)
            
            import urllib.parse
            for o in filtered_orders:
                # Format WA link
                phone = o['customerWhatsapp']
                if phone.startswith('0'):
                    phone = '62' + phone[1:]
                elif phone.startswith('+'):
                    phone = phone.replace('+', '')
                
                if o['status'] == 'Selesai Siap Diambil':
                    wa_text = f"Halo Kak {o['customerName']}, unit [{o['category']}] {o['brandType']} Anda sudah SELESAI diperbaiki dan siap diambil ke toko. Total biaya: Rp {o['repairCost']:,}. Silakan datang membawa kode order: {o['id']}."
                elif o['status'] == 'Sedang Diperbaiki':
                    wa_text = f"Halo Kak {o['customerName']}, unit [{o['category']}] {o['brandType']} Anda saat ini sedang dalam proses REPARASI oleh teknisi kami. Kode order: {o['id']}."
                else:
                    wa_text = f"Halo Kak {o['customerName']}, produk/gadget {o['brandType']} Anda dengan kode order {o['id']} saat ini berstatus: {o['status']}. Total biaya: Rp {o['repairCost']:,}. Terima kasih telah menggunakan ServisPro Premium."
                
                wa_url = f"https://wa.me/{phone}?text={urllib.parse.quote(wa_text)}"
                
                row_col1, row_col2, row_col3, row_col4, row_col5 = st.columns([1.2, 2.5, 1.8, 1.5, 2.2])
                with row_col1:
                    st.markdown(f"**{o['id']}**\n\n<span style='font-size:11px; color:#64748b;'>{o['createdAt']}</span>", unsafe_allow_html=True)
                with row_col2:
                    st.markdown(f"👤 **{o['customerName']}**\n\n[{o['category']}] *{o['brandType']}*", unsafe_allow_html=True)
                with row_col3:
                    # Status styling
                    status_colors = {
                        "Menunggu Antrean": "#f59e0b",
                        "Sedang Dicek": "#3b82f6",
                        "Sedang Diperbaiki": "#f97316",
                        "Selesai Siap Diambil": "#10b981",
                        "Selesai Diambil": "#1d4ed8",
                        "Gagal Diperbaiki": "#ef4444"
                    }
                    bg_color = status_colors.get(o['status'], "#6b7280")
                    st.markdown(f"<span style='background-color: {bg_color}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: bold;'>{o['status']}</span>", unsafe_allow_html=True)
                with row_col4:
                    st.markdown(f"<div style='text-align: right; font-weight: bold; color: #0f172a;'>Rp {o['repairCost']:,}</div>", unsafe_allow_html=True)
                with row_col5:
                    col_btn_edit, col_btn_wa = st.columns(2)
                    with col_btn_edit:
                        if st.button("Kelola 🛠️", key=f"btn_edit_{o['id']}"):
                            st.session_state['selected_order_for_edit'] = o['id']
                            st.rerun()
                    with col_btn_wa:
                        st.markdown(f"<a href='{wa_url}' target='_blank' style='text-decoration:none;'><button style='background-color:#10b981; color:white; border:none; padding:6px 12px; border-radius:8px; font-size:11px; font-weight:bold; cursor:pointer; width:100%; transition:all;'>💬 WA</button></a>", unsafe_allow_html=True)
                st.markdown("<hr style='margin: 8px 0; border: 0; border-top: 1px dashed #cbd5e1;'>", unsafe_allow_html=True)
        else:
            st.warning("Tidak ada order servis yang cocok dengan kata pencarian Anda.")

        st.markdown("---")
        st.subheader("⚙️ Aksi Update Order Servis & Pemotongan Suku Cadang")
        
        if len(st.session_state.orders) > 0:
            order_ids = [o['id'] for o in st.session_state.orders]
            
            # Match preset selection from "Kelola" button
            default_index = 0
            if 'selected_order_for_edit' in st.session_state:
                if st.session_state['selected_order_for_edit'] in order_ids:
                    default_index = order_ids.index(st.session_state['selected_order_for_edit'])
            
            selected_order_id = st.selectbox("Pilih ID Order Servis yang ingin di-update:", order_ids, index=default_index)
            
            # Find the actual order object
            idx = next((i for (i, d) in enumerate(st.session_state.orders) if d["id"] == selected_order_id), None)
            
            if idx is not None:
                order_item = st.session_state.orders[idx]
                
                # Show layout side-by-side: edit attributes, and sparepart deduction
                edit_col1, edit_col2 = st.columns(2)
                
                with edit_col1:
                    st.markdown("### 📝 Atribut Servis")
                    st.write(f"👤 **Pelanggan:** {order_item['customerName']} ({order_item['customerWhatsapp']})")
                    st.write(f"📱 **Gadget:** [{order_item['category']}] {order_item['brandType']}")
                    st.write(f"❓ **Keluhan Utama:** *{order_item['complaint']}*")
                    
                    status_options = [
                        "Menunggu Antrean", 
                        "Sedang Dicek", 
                        "Sedang Diperbaiki", 
                        "Selesai Siap Diambil", 
                        "Selesai Diambil", 
                        "Gagal Diperbaiki"
                    ]
                    current_status_idx = status_options.index(order_item['status']) if order_item['status'] in status_options else 0
                    
                    new_status = st.selectbox("Ubah Status:", status_options, index=current_status_idx)
                    new_notes = st.text_area("Catatan Perkembangan Teknisi:", value=order_item['technicianNotes'])
                    new_cost = st.number_input("Estimasi / Total Biaya Perbaikan (Rp):", value=int(order_item['repairCost']), step=25000)
                    
                    col_save_action1, col_save_action2 = st.columns(2)
                    with col_save_action1:
                        if st.button("💾 Simpan Perubahan Status & Catatan"):
                            st.session_state.orders[idx]['status'] = new_status
                            st.session_state.orders[idx]['technicianNotes'] = new_notes
                            st.session_state.orders[idx]['repairCost'] = int(new_cost)
                            st.success(f"✔️ Berhasil meng-update status Order {selected_order_id}!")
                            st.rerun()
                    with col_save_action2:
                        if st.button("🖨️ Cetak Nota Resmi"):
                            st.session_state['show_invoice_id'] = selected_order_id
                            st.rerun()

                with edit_col2:
                    st.markdown("### 📦 Potong Suku Cadang (Inventory Deduction)")
                    st.write("Pilih suku cadang (sparepart) yang digunakan selama proses servis ini. Sistem akan otomatis memotong jumlah stok di gudang dan mengklaim biaya ke rincian servis.")
                    
                    # Generate options text
                    part_options = [f"{p['id']} - {p['name']} (Stok: {p['stock']} pcs)" for p in st.session_state.spareparts]
                    selected_part_str = st.selectbox("Pilih Sparepart yang Digunakan:", part_options)
                    
                    part_id = selected_part_str.split(" - ")[0]
                    part_idx = next((i for (i, d) in enumerate(st.session_state.spareparts) if d["id"] == part_id), None)
                    
                    if part_idx is not None:
                        target_part = st.session_state.spareparts[part_idx]
                        st.info(f"💵 **Harga Satuan:** Rp {target_part['price']:,} | **Tersedia:** {target_part['stock']} unit")
                        
                        qty_to_use = st.number_input("Jumlah yang Digunakan (Unit):", min_value=1, max_value=int(target_part['stock']) if int(target_part['stock']) > 0 else 1, value=1)
                        
                        if int(target_part['stock']) <= 0:
                            st.error("❌ Stok habis! Silakan lakukan restock di Dashboard Keuangan & Inventaris.")
                        else:
                            if st.button("⚡ Gunakan & Potong Stok Suku Cadang"):
                                # Deduct logic
                                st.session_state.spareparts[part_idx]['stock'] -= qty_to_use
                                
                                # Auto calculate cost increment + append notes
                                total_addition = int(target_part['price'] * qty_to_use)
                                st.session_state.orders[idx]['repairCost'] += total_addition
                                
                                clean_note_append = f" [Auto-Log: Digunakan {qty_to_use}x {target_part['name']} (+Rp {total_addition:,})]"
                                st.session_state.orders[idx]['technicianNotes'] = order_item['technicianNotes'] + clean_note_append
                                
                                st.success(f"✔️ Berhasil menggunakan suku cadang! Stok {target_part['name']} dipotong {qty_to_use} unit. Biaya servis bertambah Rp {total_addition:,}.")
                                st.rerun()

                # Visualizing the Printable Invoice / Receipt Section
                if 'show_invoice_id' in st.session_state and st.session_state['show_invoice_id'] == selected_order_id:
                    st.markdown("---")
                    st.markdown("<h3 style='text-align: center; color: #1e293b; margin-bottom: 10px;'>🖨️ Pratinjau Nota Resmi Servis</h3>", unsafe_allow_html=True)
                    
                    inv_item = order_item
                    st.markdown(f"""
                    <div id="invoice-print-area" style="background-color: #ffffff; color: #1e293b; border: 2px solid #0f172a; border-radius: 12px; padding: 30px; font-family: Courier, monospace; line-height: 1.5; box-shadow: 0 4px 15px rgba(0,0,0,0.1); max-width: 650px; margin-left: auto; margin-right: auto;">
                        <div style="text-align: center; border-bottom: 2px dashed #0f172a; padding-bottom: 15px; margin-bottom: 15px;">
                            <h2 style="margin: 0; color: #0f172a; font-weight: bold;">🔧 SERVISPRO PREMIUM SERVICES</h2>
                            <p style="margin: 5px 0; font-size: 11px;">Kavling Tekno No. 102, Jakarta Selatan</p>
                            <p style="margin: 3px 0; font-size: 11px;">WA: 0812-3456-7890 | Email: office@servispro.id</p>
                            <p style="margin: 3px 0; font-size: 11px; font-weight: bold; color: #1a73e8;">SISTEM LOG TRANSAKSI RESMI</p>
                        </div>
                        
                        <div style="font-size: 11px; margin-bottom: 15px;">
                            <div style="display: flex; justify-content: space-between;">
                                <span><b>NO. ORDER :</b> {inv_item['id']}</span>
                                <span><b>TANGGAL REG :</b> {inv_item['createdAt']}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-top: 5px;">
                                <span><b>PELANGGAN:</b> {inv_item['customerName']}</span>
                                <span><b>NO. WA    :</b> {inv_item['customerWhatsapp']}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-top: 5px;">
                                <span><b>AKUN USER:</b> {inv_item['customerEmail']}</span>
                                <span><b>METODE   :</b> {inv_item['method']}</span>
                            </div>
                        </div>
                        
                        <div style="border-bottom: 1px solid #1e293b; padding-bottom: 5px; margin-bottom: 10px; font-weight: bold; font-size: 11px; color:#1e293b;">
                            RINCIAN DIAGNOSA & SPESIFIKASI PEKERJAAN
                        </div>
                        
                        <table style="width: 100%; font-size: 11px; border-collapse: collapse; margin-bottom: 15px;">
                            <thead>
                                <tr style="border-bottom: 1px dashed #1e293b;">
                                    <th style="text-align: left; padding: 4px 0;">Item Deskripsi Pekerjaan</th>
                                    <th style="text-align: right; padding: 4px 0;">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style="padding: 6px 0;">[{inv_item['category']}] {inv_item['brandType']} - Biaya Total (Ganti Part & Jasa Teknisi)</td>
                                    <td style="text-align: right; padding: 6px 0; font-weight: bold;">Rp {inv_item['repairCost']:,}</td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="padding: 4px 0; color: #555555; font-size: 10px; font-style: italic;">
                                        <b>Keluhan Utama:</b> "{inv_item['complaint']}"<br/>
                                        <b>Update Teknisi:</b> "{inv_item['technicianNotes']}"
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <div style="border-top: 2px dashed #0f172a; padding-top: 10px; font-size: 12px; font-weight: bold; display: flex; justify-content: space-between; margin-bottom: 15px;">
                            <span>TOTAL TAGIHAN (NETTO)</span>
                            <span>Rp {inv_item['repairCost']:,}</span>
                        </div>
                        
                        <div style="font-size: 10px; background-color: #f8f9fa; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; margin-bottom: 20px; color: #475569; line-height: 1.4;">
                            <b>📜 SYARAT & KETENTUAN GARANSI WORKSPACE:</b><br/>
                            1. Garansi <b>90 Hari</b> terhitung sejak barang selesai diambil oleh pelanggan.<br/>
                            2. Garansi tidak menanggung kerusakan baru akibat kesalahan pemakaian pelanggan (segel garansi robek, kesalahan tegangan, kena air, atau benturan keras fisik).<br/>
                            3. Lampirkan nota cetak resmi ini sebagai bukti pendaftaran klaim garansi tanpa ribet.
                        </div>
                        
                        <div style="display: flex; justify-content: space-between; font-size: 11px; padding-top: 10px;">
                            <div style="text-align: center; width: 170px;">
                                <p style="margin-bottom: 60px;">Penanggung Jawab Teknisi</p>
                                <p style="border-top: 1px solid #1e293b; padding-top: 5px; font-weight: bold;">( ServisPro Tech-Team )</p>
                            </div>
                            <div style="text-align: center; width: 170px;">
                                <p style="margin-bottom: 60px;">Pelanggan Penerima</p>
                                <p style="border-top: 1px solid #1e293b; padding-top: 5px; font-weight: bold;">( {inv_item['customerName']} )</p>
                            </div>
                        </div>
                        
                        <div style="text-align: center; font-size: 9px; margin-top: 30px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 10px;">
                            Terima kasih atas kunjungan dan kepercayaan Anda di ServisPro. Selesai Cepat & Berkualitas!
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 15px;">
                        <span style="font-size:11px; color:#64748b; font-weight:bold; display:block; margin-bottom:10px;">Tips: Ambil screenshot atau tekan tombol cetak fisik di bawah:</span>
                    </div>
                    """, unsafe_allow_html=True)
                    
                    # Beautiful print or reset preview buttons side-by-side
                    btn_pr_col1, btn_pr_col2 = st.columns(2)
                    with btn_pr_col1:
                        st.button("❌ Tutup Pratinjau Nota", on_click=lambda: st.session_state.pop('show_invoice_id', None))
                    with btn_pr_col2:
                        st.markdown("""
                        <div style="text-align: center;">
                            <button onclick="window.print();" style="width:100%; background-color:#1e293b; color:white; font-weight:extrabold; border:none; padding:10px 20px; border-radius:8px; cursor:pointer; font-size:13px; line-height:1.5;">🖨️ Cetak / Unduh PDF</button>
                        </div>
                        """, unsafe_allow_html=True)
                                
    # 2. ADMIN MENU B: DASHBOARD KEUANGAN & INVENTARIS
    elif menu == "📊 Dashboard Keuangan & Inventaris Gudang":
        st.title("📈 Dashboard Keuangan & Gudang")
        st.write("Analisa omzet bisnis dari tagihan reparasi yang selesai, serta kelola ketersediaan suku cadang pada gudang induk.")
        
        # Financial metric computations
        completed_orders = [o for o in st.session_state.orders if o['status'] in ['Selesai Siap Diambil', 'Selesai Diambil']]
        total_revenue = sum([o['repairCost'] for o in completed_orders])
        active_unpaid = sum([o['repairCost'] for o in st.session_state.orders if o['status'] not in ['Selesai Siap Diambil', 'Selesai Diambil', 'Gagal Diperbaiki']])
        
        f_col1, f_col2, f_col3 = st.columns(3)
        f_col1.markdown(f'<div class="card-stat"><h3>💰 Total Omzet (Selesai Servis)</h3><p style="color: #137333;">Rp {total_revenue:,}</p></div>', unsafe_allow_html=True)
        f_col2.markdown(f'<div class="card-stat"><h3>⏳ Potensi Omzet Berjalan</h3><p style="color: #b06000;">Rp {active_unpaid:,}</p></div>', unsafe_allow_html=True)
        f_col3.markdown(f'<div class="card-stat"><h3>📦 Total Jenis Sparepart</h3><p style="color: #1a73e8;">{len(st.session_state.spareparts)} jenis</p></div>', unsafe_allow_html=True)
        st.markdown("<br>", unsafe_allow_html=True)

        st.subheader("📦 Pengelolaan Stok Suku Cadang Gudang Induk")
        
        # Show actual status in tabular pandas view
        parts_df = pd.DataFrame(st.session_state.spareparts)
        st.write("### Daftar Inventaris")
        
        # Add warning styles for low stock
        parts_df['Status'] = parts_df['stock'].apply(lambda x: '⚠️ STOK MENIPIS' if x < 10 else '✅ Aman')
        st.dataframe(parts_df, use_container_width=True)
        
        # Add/Restock sparepart form
        st.markdown("---")
        st.subheader("➕ Tambah Baru atau Restock Suku Cadang")
        
        col_part_f1, col_part_f2 = st.columns(2)
        
        with col_part_f1:
            st.markdown("##### 📌 Restock Suku Cadang yang Sudah Ada")
            selected_ref_name = st.selectbox("Pilih Suku Cadang:", [p['name'] for p in st.session_state.spareparts])
            add_qty = st.number_input("Jumlah Stok Tambahan (Pcs):", min_value=1, max_value=500, value=10)
            
            if st.button("➕ Tambah Stok"):
                p_idx = next((i for (i, d) in enumerate(st.session_state.spareparts) if d["name"] == selected_ref_name), None)
                if p_idx is not None:
                    st.session_state.spareparts[p_idx]['stock'] += add_qty
                    st.success(f"✔️ Stok {selected_ref_name} sukses ditambah sebanyak {add_qty} pcs!")
                    st.rerun()

        with col_part_f2:
            st.markdown("##### 🆕 Tambah Master Suku Cadang Baru")
            new_p_name = st.text_input("Nama Suku Cadang Baru:", placeholder="Contoh: Battery iPad Pro m2")
            new_p_price = st.number_input("Harga Master Suku Cadang (Rp):", min_value=10000, max_value=10000000, value=150000, step=10000)
            new_p_stock = st.number_input("Init Stok Awal (Pcs):", min_value=1, max_value=200, value=10)
            
            if st.button("✨ Daftarkan Suku Cadang"):
                if not new_p_name:
                    st.error("Nama suku cadang tidak boleh kosong!")
                else:
                    new_ref_id = f"SPART-{random.randint(100, 999)}"
                    st.session_state.spareparts.append({
                        "id": new_ref_id,
                        "name": new_p_name,
                        "price": int(new_p_price),
                        "stock": int(new_p_stock)
                    })
                    st.success(f"✔️ Suku cadang {new_p_name} dengan ID {new_ref_id} berhasil didaftarkan ke database!")
                    st.rerun()

        # Database Master Log Transactions & Excel/CSV Export
        st.markdown("---")
        st.subheader("📋 Dokumen Log Transaksi & Master Data Servis (Owner View)")
        st.write("Unduh seluruh riwayat perbaikan gadget di toko Anda untuk keperluan audit finansial, laporan pajak, atau analisis pembukuan bulanan:")
        
        df_master = pd.DataFrame(st.session_state.orders)
        if not df_master.empty:
            df_csv = df_master.to_csv(index=False).encode('utf-8')
            
            # Download trigger button
            st.download_button(
                label="📥 Ekspor Laporan Transaksi (CSV)",
                data=df_csv,
                file_name=f"ServisPro_Premium_DataMaster_Report_{datetime.now().strftime('%Y%m%d')}.csv",
                mime='text/csv',
                key="owner_download_csv_key_app"
            )
            
            # Show a nice interactive filter log table in the st container
            st.dataframe(df_master[["id", "customerName", "category", "brandType", "status", "repairCost", "createdAt"]], use_container_width=True)

    # 3. CUSTOMER MENU A: BERANDA JASA SERVIS
    elif menu == "🏠 Beranda Jasa Servis":
        st.title("🌟 Selamat Datang di ServisPro Premium")
        st.markdown("**Solusi Cepat, Transparan, & Bergaransi untuk Gadget Anda**")
        st.write("Kami melayani perbaikan bermacam barang elektronik modern seperti HP (iPhone & Android), Laptop (Asus, MacBook, Lenovo, Dell), Smart TV, dan berbagai Konsol Game dengan jaminan garansi hingga 90 hari.")
        
        st.markdown("---")
        st.subheader("💎 Keunggulan ServisPro")
        
        adv_col1, adv_col2, adv_col3, adv_col4 = st.columns(4)
        adv_col1.markdown(
            """
            <div style="background-color: #f8f9fa; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; height: 100%;">
                <h4 style="color: #1e293b; margin-top: 0;">🛡️ Garansi Resmi</h4>
                <p style="color: #64748b; font-size: 12px;">Setiap reparasi suku cadang mendapatkan kover garansi tertulis maksimal 90 hari tanpa dipersulit.</p>
            </div>
            """, 
            unsafe_allow_html=True
        )
        adv_col2.markdown(
            """
            <div style="background-color: #f8f9fa; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; height: 100%;">
                <h4 style="color: #1e293b; margin-top: 0;">👨‍🔧 Teknisi Ahli</h4>
                <p style="color: #64748b; font-size: 12px;">Ditangani langsung oleh teknisi micro-soldering yang memiliki sertifikasi standar industri resmi.</p>
            </div>
            """, 
            unsafe_allow_html=True
        )
        adv_col3.markdown(
            """
            <div style="background-color: #f8f9fa; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; height: 100%;">
                <h4 style="color: #1e293b; margin-top: 0;">👁️ 100% Transparan</h4>
                <p style="color: #64748b; font-size: 12px;">Biaya transparan dihitung di muka sebelum bongkar, tidak ada manipulasi kerusakan atau ongkos fiktif.</p>
            </div>
            """, 
            unsafe_allow_html=True
        )
        adv_col4.markdown(
            """
            <div style="background-color: #f8f9fa; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; height: 100%;">
                <h4 style="color: #1e293b; margin-top: 0;">🚚 Layanan Panggilan</h4>
                <p style="color: #64748b; font-size: 12px;">Mager ke luar? Teknisi kami siap dipanggil ke kantor atau tempat tinggal Anda untuk reparasi langsung.</p>
            </div>
            """, 
            unsafe_allow_html=True
        )

        st.markdown("---")
        st.subheader("💬 Testimoni Pelanggan Setia")
        
        t_col1, t_col2, t_col3 = st.columns(3)
        t_col1.markdown(
            """
            <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
                <span style="color: #fbbf24;">★★★★★</span>
                <p style="font-style: italic; font-size: 12.5px; color: #475569;">"Puas banget servis Laptop Asus di sini. Penjelasan detail, pengerjaan cepat dibanding service center resmi, harganya bersahabat!"</p>
                <div style="font-weight: bold; font-size: 12px; color: #1e293b; margin-top: 10px;">Hendra Wijaya - Karyawan Swasta</div>
            </div>
            """, 
            unsafe_allow_html=True
        )
        t_col2.markdown(
            """
            <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
                <span style="color: #fbbf24;">★★★★★</span>
                <p style="font-style: italic; font-size: 12.5px; color: #475569;">"Nyobain servis iPhone ganti baterai, teknisinya langsung datang ke kosan, pengerjaan rapi dan dikasih garansi 3 bulan. Recomended!"</p>
                <div style="font-weight: bold; font-size: 12px; color: #1e293b; margin-top: 10px;">Siska Amelia - Mahasiswi UI</div>
            </div>
            """, 
            unsafe_allow_html=True
        )
        t_col3.markdown(
            """
            <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
                <span style="color: #fbbf24;">★★★★★</span>
                <p style="font-style: italic; font-size: 12.5px; color: #475569;">"PS5 stick analog drift sembuh total dalam hitungan jam. Teknisi pinter ngerti kelistrikan papan pcb."</p>
                <div style="font-weight: bold; font-size: 12px; color: #1e293b; margin-top: 10px;">Rahmat Hidayat - Gamer & Streamer</div>
            </div>
            """, 
            unsafe_allow_html=True
        )

        st.markdown("---")
        st.subheader("❓ FAQ & Kebijakan Toko")
        st.markdown(
            """
            * **Berapa lama waktu pengerjaan servis?**  
              Kerusakan ringan (ganti baterai/LCD) selesai sekitar 1-3 jam. Kerusakan berat mesin motherboard laptop memerlukan analisa menyeluruh antara 1-3 hari kerja.
            * **Apakah dikenakan biaya cek jika barang batal diperbaiki?**  
              Kami hanya menarik biaya analisa Rp 50.000 untuk HP/Konsol dan Rp 100.000 untuk Laptop jika barang akhirnya batal diservis. Jika setuju diperbaiki, biaya diagnosa tersebut GRATIS.
            * **Bagaimana metode Panggil Teknisi bekerja?**  
              Tim admin akan memverifikasi alamat Anda lewat WhatsApp, lalu mendatangkan teknisi bersertifikasi beserta peralatan diagnostic lengkap ke alamat Anda.
            """
        )

    # 4. CUSTOMER MENU B: BOOKING & TRACK STATUS
    elif menu == "📝 Form Booking & Cek Status Order Real-Time":
        st.title("📋 Booking Servis & Pelacak Progres Status")
        st.write("Silakan daftarkan gadget baru Anda yang bermasalah, atau masukkan ID Antrean Anda untuk memantau pengerjaan oleh teknisi.")
        
        # Split workspace: Track status, and Register booking
        col_track, col_booking = st.columns([1, 1])
        
        with col_track:
            st.markdown("### 🔍 Lacak Status Antrean Servis Anda")
            st.write("Masukkan kode pelacak tiket servis Anda (contoh: `SP-2026-61842`) untuk membaca update langsung:")
            
            track_input = st.text_input("KODE PELACAK ORDER (ID):", value=st.session_state.tracked_id, placeholder="SP-2026-XXXXX")
            
            if track_input:
                st.session_state.tracked_id = track_input.strip()
                
                # Look up in state orders
                ord_found = next((o for o in st.session_state.orders if o["id"] == track_input.strip()), None)
                
                if ord_found:
                    st.success("✔️ Tiket Order Ditemukan!")
                    
                    # Simulated elegant status timeline
                    status_now = ord_found['status']
                    
                    # Style based status markers
                    color_status = {
                        "Menunggu Antrean": "🟠 Menunggu Antrean",
                        "Sedang Dicek": "🟡 Sedang Diinvestigasi",
                        "Sedang Diperbaiki": "⚡ Sedang Diperbaiki",
                        "Selesai Siap Diambil": "🟢 Selesai (Dapat Diambil)",
                        "Selesai Diambil": "🔵 Sudah Diambil Pemilik",
                        "Gagal Diperbaiki": "🔴 Gagal Diperbaiki"
                    }
                    
                    st.markdown(
                        f"""
                        <div style="background-color: #ffffff; border: 1px solid #aecbfa; border-radius: 12px; padding: 25px; margin-top: 15px;">
                            <h4 style="margin: 0; color:#1e293b;">📌 Tiket Ref: {ord_found['id']}</h4>
                            <p style="font-size:12px; color: #64748b; margin: 3px 0 15px 0;">Terdaftar Pada: {ord_found['createdAt']}</p>
                            
                            <table style="width:100%; font-size:12.5px; line-height:2;">
                                <tr>
                                    <td><b>Nama Pemilik:</b></td>
                                    <td>{ord_found['customerName']}</td>
                                </tr>
                                <tr>
                                    <td><b>Merek & Tipe Gadget:</b></td>
                                    <td>[{ord_found['category']}] {ord_found['brandType']}</td>
                                </tr>
                                <tr>
                                    <td><b>Pilihan Antar:</b></td>
                                    <td>{ord_found['method']}</td>
                                </tr>
                                <tr>
                                    <td><b>Biaya Layanan:</b></td>
                                    <td style="color:#d93025; font-weight:bold;">Rp {ord_found['repairCost']:,}</td>
                                </tr>
                                <tr>
                                    <td><b>Keluhan:</b></td>
                                    <td><i>"{ord_found['complaint']}"</i></td>
                                </tr>
                            </table>
                            
                            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 15px 0;">
                            
                            <p style="font-size: 13px; margin-bottom: 2px;"><b>⚙️ Status Terakhir:</b></p>
                            <span style="font-size: 14px; font-weight: bold; background-color:#f1f5f9; padding: 6px 12px; border-radius:6px; display:inline-block; border-left: 4px solid #1a73e8;">
                                {color_status.get(status_now, status_now)}
                            </span>
                            
                            <p style="font-size: 13px; margin: 15px 0 2px 0;"><b>🛠️ Catatan Kerusakan & Update Teknisi:</b></p>
                            <p style="font-size: 12.5px; background-color: #fafafa; border: 1px solid #e1e1e1; padding: 12px; border-radius:6px; font-style: italic; color:#334155; margin:0;">
                                "{ord_found['technicianNotes']}"
                            </p>
                        </div>
                        """, 
                        unsafe_allow_html=True
                    )
                else:
                    st.error("❌ Maaf, ID Ref tidak ditemukan. Silakan periksa kembali kombinasi huruf atau angka tiket Anda.")
            
            else:
                # Provide clickable quick hints to test Immediately
                st.markdown("##### 💡 ID Antrean Contoh (Ketik untuk Uji Coba):")
                st.write("- `SP-2026-61842` - Berstatus Sedang Diperbaiki")
                st.write("- `SP-2026-42913` - Berstatus Selesai Siap Diambil")
                st.write("- `SP-2026-17382` - Berstatus Menunggu Antrean")

        with col_booking:
            st.markdown("### 📝 Pendaftaran Order Jasa Servis Baru")
            st.write("Isi formulir ini secara akurat untuk mendaftarkan perbaikan gadget Anda secara cepat:")
            
            with st.form("new_booking_form"):
                b_name = st.text_input("👤 Nama Lengkap Pemilik:", value=current_user['name'])
                b_wa = st.text_input("📞 No. WhatsApp Aktif (Format: 08xx):", placeholder="08xxxxxxxxxx")
                
                b_cat = st.selectbox(
                    "📱 Kategori Gadget Elektronik:",
                    ["HP", "Laptop", "TV", "Konsol Game", "Lainnya"]
                )
                
                b_brand = st.text_input("🏷️ Merek & Tipe Gadget:", placeholder="Sebutkan merek tipe (Contoh: Apple MacBook M1 Air, Xiaomi TV A2)")
                b_complaint = st.text_area("🔧 Keluhan Gangguan / Suku Cadang Rusak:", placeholder="Deskripsikan sedetail mungkin kronologi kejadian kerusakan...")
                
                b_method = st.radio(
                    "🚀 Metode Penyerahan Barang:",
                    ["Antar ke Toko", "Panggil Teknisi"]
                )
                
                submit_booking = st.form_submit_button("📢 DAFTARKAN SEKARANG")
                
                if submit_booking:
                    if not b_name or not b_wa or not b_brand or not b_complaint:
                        st.error("⚠️ Seluruh form wajib diisikan lengkap kecuali Anda membatalkan pendaftaran.")
                    else:
                        rand_id = f"SP-2026-{random.randint(10000, 99999)}"
                        time_now_str = datetime.now().strftime("%Y-%m-%d %H:%M")
                        
                        new_order_data = {
                            "id": rand_id,
                            "customerName": b_name,
                            "customerWhatsapp": b_wa,
                            "customerEmail": current_user['email'],
                            "category": b_cat,
                            "brandType": b_brand,
                            "complaint": b_complaint,
                            "method": b_method,
                            "status": "Menunggu Antrean",
                            "technicianNotes": "Menunggu antrean pengecekan fisik menyeluruh oleh tim teknisi bersertifikasi kami.",
                            "repairCost": 0,
                            "createdAt": time_now_str
                        }
                        
                        st.session_state.orders.insert(0, new_order_data)
                        st.session_state.tracked_id = rand_id
                        
                        st.success(f"🎉 SUKSES! Gadget Anda terdaftar dengan ID Referensi Pelacak: **{rand_id}**")
                        st.info("ℹ️ ID ini dipindahkan ke input pelacak di samping kiri. Catat ID tersebut untuk melihat status terupdate!")
                        st.rerun()

    # FOOTER LOGO CREDITS
    st.markdown("<br><hr>", unsafe_allow_html=True)
    st.markdown(
        """
        <div style="text-align: center; font-size: 11px; color:#94a3b8; padding-bottom: 20px;">
            Sistem Manajemen Servis Elektronik ServisPro Premium • Didukung Simulasi Keamanan Google Identity Cloud Core
        </div>
        """,
        unsafe_allow_html=True
    )

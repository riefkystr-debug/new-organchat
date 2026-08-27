// =====================================================
// ORGACHAT - JAVASCRIPT LENGKAP
// Versi lokal: HTML + CSS + JavaScript + localStorage
// =====================================================


// =====================================================
// DATA
// =====================================================

let currentUser =
    localStorage.getItem("orgachatUser") || null;

let messages =
    JSON.parse(
        localStorage.getItem("orgachatMessages")
    ) || [];

let activeChat = "group:Umum";

let selectedImage = null;


// =====================================================
// ELEMENTS
// =====================================================

const loginPage =
    document.getElementById("loginPage");

const registerPage =
    document.getElementById("registerPage");

const app =
    document.getElementById("app");

const loginForm =
    document.getElementById("loginForm");

const registerForm =
    document.getElementById("registerForm");

const usernameInput =
    document.getElementById("username");

const passwordInput =
    document.getElementById("password");

const messageForm =
    document.getElementById("messageForm");

const messageInput =
    document.getElementById("messageInput");

const messagesContainer =
    document.getElementById("messages");

const toast =
    document.getElementById("toast");


// =====================================================
// START WEBSITE
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        createImageUploader();

        setupMenu();

        setupChat();

        setupSearch();

        setupRegister();

        setupLogin();

        setupDarkMode();

        setupLogout();

        setupProfile();

        setupExtraButtons();

        if (currentUser) {

            showApp();

        } else {

            showLogin();

        }

        updateStats();

    }
);


// =====================================================
// LOGIN
// =====================================================

function setupLogin() {

    if (!loginForm) return;

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const username =
                usernameInput.value.trim();

            const password =
                passwordInput.value;

            if (!username || !password) {

                showToast(
                    "Username dan password wajib diisi!"
                );

                return;
            }


            const users =
                getUsers();


            const user =
                users.find(
                    account =>

                        account.username
                            .toLowerCase() ===
                        username.toLowerCase()

                        &&

                        account.password ===
                        password
                );


            if (!user) {

                showToast(
                    "Username atau password salah!"
                );

                return;
            }


            currentUser =
                user.username;


            localStorage.setItem(
                "orgachatUser",
                currentUser
            );


            localStorage.setItem(
                "orgachatCurrentUser",
                JSON.stringify(user)
            );


            showApp();


            showToast(
                "Selamat datang, " +
                user.name +
                "!"
            );

        }
    );

}


// =====================================================
// REGISTER
// =====================================================

function setupRegister() {

    const showRegister =
        document.getElementById(
            "showRegister"
        );

    const showLoginButton =
        document.getElementById(
            "showLogin"
        );


    if (showRegister) {

        showRegister.addEventListener(
            "click",
            function () {

                loginPage.classList.add(
                    "hidden"
                );

                registerPage.classList.remove(
                    "hidden"
                );

            }
        );

    }


    if (showLoginButton) {

        showLoginButton.addEventListener(
            "click",
            function () {

                registerPage.classList.add(
                    "hidden"
                );

                loginPage.classList.remove(
                    "hidden"
                );

            }
        );

    }


    if (!registerForm) return;


    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById(
                        "registerName"
                    )
                    .value
                    .trim();


            const username =
                document
                    .getElementById(
                        "registerUsername"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "registerPassword"
                    )
                    .value;


            const confirmPassword =
                document
                    .getElementById(
                        "registerConfirmPassword"
                    )
                    .value;


            const division =
                document
                    .getElementById(
                        "registerDivision"
                    )
                    .value;


            const role =
                document
                    .getElementById(
                        "registerRole"
                    )
                    .value;


            // Validasi

            if (
                !name ||
                !username ||
                !password
            ) {

                showToast(
                    "Semua data wajib diisi!"
                );

                return;
            }


            if (
                username.length < 3
            ) {

                showToast(
                    "Username minimal 3 karakter!"
                );

                return;
            }


            if (
                password.length < 6
            ) {

                showToast(
                    "Password minimal 6 karakter!"
                );

                return;
            }


            if (
                password !==
                confirmPassword
            ) {

                showToast(
                    "Password tidak sama!"
                );

                return;
            }


            const users =
                getUsers();


            const exists =
                users.some(
                    user =>

                        user.username
                            .toLowerCase() ===
                        username.toLowerCase()
                );


            if (exists) {

                showToast(
                    "Username sudah digunakan!"
                );

                return;
            }


            const newUser = {

                id:
                    "ORG-" +
                    Date.now(),

                name:
                    name,

                username:
                    username,

                password:
                    password,

                division:
                    division,

                role:
                    role,

                joinedAt:
                    new Date()
                        .toLocaleDateString(
                            "id-ID"
                        )

            };


            users.push(
                newUser
            );


            saveUsers(users);


            registerForm.reset();


            showToast(
                "Registrasi berhasil!"
            );


            setTimeout(
                function () {

                    registerPage.classList.add(
                        "hidden"
                    );

                    loginPage.classList.remove(
                        "hidden"
                    );

                },
                1000
            );

        }
    );

}


// =====================================================
// USER DATABASE LOCAL
// =====================================================

function getUsers() {

    return JSON.parse(
        localStorage.getItem(
            "orgachatUsers"
        )
    ) || [];

}


function saveUsers(users) {

    localStorage.setItem(
        "orgachatUsers",
        JSON.stringify(users)
    );

}


// =====================================================
// CURRENT USER
// =====================================================

function getCurrentUser() {

    const user =
        localStorage.getItem(
            "orgachatCurrentUser"
        );

    if (!user) {

        return null;

    }

    try {

        return JSON.parse(user);

    } catch {

        return null;

    }

}


// =====================================================
// SHOW APP
// =====================================================

function showApp() {

    loginPage.classList.add(
        "hidden"
    );

    registerPage.classList.add(
        "hidden"
    );

    app.classList.remove(
        "hidden"
    );


    setUserData();

    loadMembers();

    loadMemberChats();

    renderActiveChat();

    updateStats();

}


// =====================================================
// SHOW LOGIN
// =====================================================

function showLogin() {

    loginPage.classList.remove(
        "hidden"
    );

    registerPage.classList.add(
        "hidden"
    );

    app.classList.add(
        "hidden"
    );

}


// =====================================================
// USER DATA
// =====================================================

function setUserData() {

    const user =
        getCurrentUser();

    if (!user) return;


    const letter =
        user.name
            .charAt(0)
            .toUpperCase();


    setText(
        "displayUsername",
        user.name
    );

    setText(
        "topUsername",
        user.name
    );

    setText(
        "welcomeName",
        user.name
    );

    setText(
        "userAvatar",
        letter
    );

    setText(
        "topAvatar",
        letter
    );


    loadProfile();

}


// =====================================================
// SAFE SET TEXT
// =====================================================

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value;

    }

}


// =====================================================
// MENU
// =====================================================

function setupMenu() {

    const menuItems =
        document.querySelectorAll(
            ".menu-item[data-page]"
        );


    menuItems.forEach(
        item => {

            item.addEventListener(
                "click",
                function () {

                    menuItems.forEach(
                        menu =>
                            menu.classList.remove(
                                "active"
                            )
                    );


                    item.classList.add(
                        "active"
                    );


                    showPage(
                        item.dataset.page
                    );

                }
            );

        }
    );

}


// =====================================================
// PAGE
// =====================================================

function showPage(page) {

    document
        .querySelectorAll(".page")
        .forEach(
            pageElement => {

                pageElement.classList.add(
                    "hidden"
                );

            }
        );


    const selected =
        document.getElementById(
            page + "Page"
        );


    if (selected) {

        selected.classList.remove(
            "hidden"
        );

    }


    const titles = {

        dashboard: [
            "Dashboard",
            "Ringkasan aktivitas organisasi"
        ],

        chat: [
            "Chat",
            "Komunikasi anggota organisasi"
        ],

        announcement: [
            "Pengumuman",
            "Informasi organisasi"
        ],

        agenda: [
            "Agenda",
            "Jadwal kegiatan"
        ],

        members: [
            "Anggota",
            "Daftar anggota"
        ],

        profile: [
            "Profil Saya",
            "Informasi akun"
        ],

        settings: [
            "Pengaturan",
            "Pengaturan website"
        ]

    };


    if (titles[page]) {

        setText(
            "pageTitle",
            titles[page][0]
        );

        setText(
            "pageDescription",
            titles[page][1]
        );

    }


    if (
        page === "profile"
    ) {

        loadProfile();

    }


    if (
        page === "members"
    ) {

        loadMembers();

    }


    if (
        page === "chat"
    ) {

        renderActiveChat();

    }

}


// =====================================================
// PROFILE
// =====================================================

function loadProfile() {

    const user =
        getCurrentUser();

    if (!user) return;


    const letter =
        user.name
            .charAt(0)
            .toUpperCase();


    setText(
        "profileAvatar",
        letter
    );

    setText(
        "profileName",
        user.name
    );

    setText(
        "profileUsername",
        "@" + user.username
    );

    setText(
        "profileRole",
        user.role
    );


    const fullName =
        document.getElementById(
            "profileFullName"
        );

    const profileUsername =
        document.getElementById(
            "profileUsernameInput"
        );

    const division =
        document.getElementById(
            "profileDivision"
        );

    const role =
        document.getElementById(
            "profileRoleInput"
        );

    const id =
        document.getElementById(
            "profileId"
        );


    if (fullName)
        fullName.value =
            user.name;


    if (profileUsername)
        profileUsername.value =
            user.username;


    if (division)
        division.value =
            user.division;


    if (role)
        role.value =
            user.role;


    if (id)
        id.value =
            user.id;

}


// =====================================================
// SAVE PROFILE
// =====================================================

function setupProfile() {

    const saveButton =
        document.getElementById(
            "saveProfile"
        );


    if (!saveButton) return;


    saveButton.addEventListener(
        "click",
        function () {

            const user =
                getCurrentUser();

            if (!user) return;


            const name =
                document
                    .getElementById(
                        "profileFullName"
                    )
                    .value
                    .trim();


            const division =
                document
                    .getElementById(
                        "profileDivision"
                    )
                    .value;


            if (!name) {

                showToast(
                    "Nama tidak boleh kosong!"
                );

                return;
            }


            user.name =
                name;

            user.division =
                division;


            localStorage.setItem(
                "orgachatCurrentUser",
                JSON.stringify(user)
            );


            const users =
                getUsers();


            const updated =
                users.map(
                    account => {

                        if (
                            account.username ===
                            user.username
                        ) {

                            return user;

                        }

                        return account;

                    }
                );


            saveUsers(
                updated
            );


            setUserData();

            loadMembers();

            loadMemberChats();


            showToast(
                "Profil berhasil diperbarui!"
            );

        }
    );

}


// =====================================================
// MEMBERS
// =====================================================

function loadMembers() {

    const container =
        document.getElementById(
            "membersGrid"
        );


    if (!container) return;


    const users =
        getUsers();


    container.innerHTML = "";


    if (
        users.length === 0
    ) {

        container.innerHTML = `
            <div class="card">
                Belum ada anggota.
            </div>
        `;

        return;
    }


    users.forEach(
        user => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "member-card";


            const letter =
                user.name
                    .charAt(0)
                    .toUpperCase();


            card.innerHTML = `

                <div class="member-avatar">
                    ${escapeHTML(letter)}
                </div>

                <h3>
                    ${escapeHTML(user.name)}
                </h3>

                <span>
                    ${escapeHTML(user.division)}
                </span>

                <p>
                    👤
                    ${escapeHTML(user.role)}
                </p>

            `;


            container.appendChild(
                card
            );

        }
    );

}


// =====================================================
// MEMBER CHAT LIST
// =====================================================

function loadMemberChats() {

    const container =
        document.getElementById(
            "memberChatList"
        );


    if (!container) return;


    const users =
        getUsers();


    container.innerHTML = "";


    users.forEach(
        user => {

            if (
                user.username ===
                currentUser
            ) {

                return;

            }


            const contact =
                document.createElement(
                    "div"
                );


            contact.className =
                "chat-contact";


            contact.dataset.chat =
                user.username;


            const letter =
                user.name
                    .charAt(0)
                    .toUpperCase();


            contact.innerHTML = `

                <div class="avatar">
                    ${escapeHTML(letter)}
                </div>

                <div class="chat-contact-info">

                    <strong>
                        ${escapeHTML(
                            user.name
                        )}
                    </strong>

                    <p>
                        ${escapeHTML(
                            user.division
                        )}
                    </p>

                </div>

            `;


            contact.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(
                            ".chat-contact"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );


                    contact.classList.add(
                        "active"
                    );


                    changeChat(
                        user
                    );

                }
            );


            container.appendChild(
                contact
            );

        }
    );

}


// =====================================================
// CHAT SETUP
// =====================================================

function setupChat() {

    if (!messageForm) return;


    messageForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const text =
                messageInput.value.trim();


            if (
                !text &&
                !selectedImage
            ) {

                showToast(
                    "Tulis pesan atau pilih gambar!"
                );

                return;
            }


            const user =
                getCurrentUser();


            if (!user) {

                showToast(
                    "Silakan login terlebih dahulu."
                );

                return;
            }


            let imageData =
                null;


            // ============================
            // GAMBAR
            // ============================

            if (selectedImage) {

                try {

                    imageData =
                        await imageToDataURL(
                            selectedImage
                        );

                } catch (error) {

                    console.error(
                        error
                    );

                    showToast(
                        "Gagal membaca gambar."
                    );

                    return;
                }

            }


            const now =
                new Date();


            const message = {

                id:
                    "MSG-" +
                    Date.now(),

                chatId:
                    activeChat,

                username:
                    user.username,

                name:
                    user.name,

                text:
                    text,

                image:
                    imageData,

                time:
                    now.toLocaleTimeString(
                        "id-ID",
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    ),

                createdAt:
                    now.toISOString()

            };


            messages.push(
                message
            );


            saveMessages();


            // Reset input

            messageInput.value =
                "";

            clearSelectedImage();


            renderActiveChat();

            updateStats();


            showToast(
                "Pesan berhasil dikirim!"
            );

        }
    );


    // Grup

    document
        .querySelectorAll(
            '.chat-contact[data-chat="Umum"],' +
            '.chat-contact[data-chat="Pengurus"],' +
            '.chat-contact[data-chat="IT"]'
        )
        .forEach(
            contact => {

                contact.addEventListener(
                    "click",
                    function () {

                        document
                            .querySelectorAll(
                                ".chat-contact"
                            )
                            .forEach(
                                item =>
                                    item.classList.remove(
                                        "active"
                                    )
                            );


                        contact.classList.add(
                            "active"
                        );


                        changeGroupChat(
                            contact.dataset.chat
                        );

                    }
                );

            }
        );

}


// =====================================================
// GROUP CHAT
// =====================================================

function changeGroupChat(name) {

    activeChat =
        "group:" +
        name;


    setText(
        "currentChatName",
        name
    );


    setText(
        "currentChatStatus",
        "Grup organisasi"
    );


    const avatars = {

        Umum: "🌐",

        Pengurus: "👑",

        IT: "💻"

    };


    setText(
        "currentChatAvatar",
        avatars[name] || "💬"
    );


    renderActiveChat();

}


// =====================================================
// PERSONAL CHAT
// =====================================================

function changeChat(user) {

    activeChat =
        "user:" +
        user.username;


    setText(
        "currentChatName",
        user.name
    );


    setText(
        "currentChatStatus",
        "🟢 Online"
    );


    setText(
        "currentChatAvatar",
        user.name
            .charAt(0)
            .toUpperCase()
    );


    renderActiveChat();

}


// =====================================================
// RENDER ACTIVE CHAT
// =====================================================

function renderActiveChat() {

    if (!messagesContainer)
        return;


    messagesContainer.innerHTML = `

        <div class="message-date">
            Hari ini
        </div>

    `;


    const chatMessages =
        messages.filter(
            message =>
                message.chatId ===
                activeChat
        );


    if (
        chatMessages.length === 0
    ) {

        const empty =
            document.createElement(
                "div"
            );


        empty.style.textAlign =
            "center";

        empty.style.padding =
            "30px";

        empty.style.opacity =
            "0.6";


        empty.textContent =
            "Belum ada pesan di chat ini.";


        messagesContainer.appendChild(
            empty
        );

        return;
    }


    chatMessages.forEach(
        message => {

            if (
                message.username ===
                currentUser
            ) {

                addSentMessage(
                    message
                );

            } else {

                addReceivedMessage(
                    message
                );

            }

        }
    );


    messagesContainer.scrollTop =
        messagesContainer.scrollHeight;

}


// =====================================================
// SENT MESSAGE
// =====================================================

function addSentMessage(message) {

    const element =
        document.createElement(
            "div"
        );


    element.className =
        "message sent";


    const wrapper =
        document.createElement(
            "div"
        );


    // Gambar

    if (message.image) {

        const image =
            createChatImage(
                message.image
            );


        wrapper.appendChild(
            image
        );

    }


    // Teks

    if (message.text) {

        const bubble =
            document.createElement(
                "div"
            );


        bubble.className =
            "message-bubble";


        bubble.textContent =
            message.text;


        wrapper.appendChild(
            bubble
        );

    }


    const time =
        document.createElement(
            "span"
        );


    time.className =
        "message-time";


    time.textContent =
        message.time +
        " ✓✓";


    wrapper.appendChild(
        time
    );


    element.appendChild(
        wrapper
    );


    messagesContainer.appendChild(
        element
    );

}


// =====================================================
// RECEIVED MESSAGE
// =====================================================

function addReceivedMessage(message) {

    const element =
        document.createElement(
            "div"
        );


    element.className =
        "message received";


    const avatar =
        document.createElement(
            "div"
        );


    avatar.className =
        "message-avatar";


    avatar.textContent =
        message.name
            .charAt(0)
            .toUpperCase();


    const wrapper =
        document.createElement(
            "div"
        );


    const name =
        document.createElement(
            "div"
        );


    name.className =
        "message-name";


    name.textContent =
        message.name;


    wrapper.appendChild(
        name
    );


    if (message.image) {

        wrapper.appendChild(
            createChatImage(
                message.image
            )
        );

    }


    if (message.text) {

        const bubble =
            document.createElement(
                "div"
            );


        bubble.className =
            "message-bubble";


        bubble.textContent =
            message.text;


        wrapper.appendChild(
            bubble
        );

    }


    const time =
        document.createElement(
            "span"
        );


    time.className =
        "message-time";


    time.textContent =
        message.time;


    wrapper.appendChild(
        time
    );


    element.appendChild(
        avatar
    );


    element.appendChild(
        wrapper
    );


    messagesContainer.appendChild(
        element
    );

}


// =====================================================
// CREATE CHAT IMAGE
// =====================================================

function createChatImage(src) {

    const image =
        document.createElement(
            "img"
        );


    image.src =
        src;


    image.alt =
        "Gambar pesan";


    image.style.display =
        "block";

    image.style.width =
        "280px";

    image.style.maxWidth =
        "100%";

    image.style.maxHeight =
        "350px";

    image.style.objectFit =
        "cover";

    image.style.borderRadius =
        "12px";

    image.style.marginBottom =
        "7px";

    image.style.cursor =
        "pointer";


    image.addEventListener(
        "click",
        function () {

            openImageViewer(
                src
            );

        }
    );


    return image;

}


// =====================================================
// IMAGE UPLOADER
// =====================================================

function createImageUploader() {

    // Jangan dibuat dua kali

    if (
        document.getElementById(
            "orgachatImageInput"
        )
    ) {

        return;

    }


    const input =
        document.createElement(
            "input"
        );


    input.type =
        "file";


    input.id =
        "orgachatImageInput";


    input.accept =
        "image/jpeg,image/png,image/webp";


    input.style.display =
        "none";


    document.body.appendChild(
        input
    );


    // Cari tombol lampiran

    const attachButton =
        document.querySelector(
            ".attach-btn"
        );


    if (!attachButton) {

        console.warn(
            "Tombol 📎 tidak ditemukan."
        );

        return;

    }


    attachButton.addEventListener(
        "click",
        function () {

            input.click();

        }
    );


    input.addEventListener(
        "change",
        function () {

            const file =
                input.files[0];


            if (!file)
                return;


            // Validasi tipe

            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                showToast(
                    "File harus berupa gambar!"
                );

                input.value =
                    "";

                return;
            }


            // Maksimal 5 MB

            if (
                file.size >
                5 * 1024 * 1024
            ) {

                showToast(
                    "Ukuran gambar maksimal 5 MB!"
                );

                input.value =
                    "";

                return;
            }


            selectedImage =
                file;


            showImagePreview(
                file
            );


            showToast(
                "Gambar dipilih. Klik ➤ untuk mengirim."
            );

        }
    );

}


// =====================================================
// IMAGE PREVIEW
// =====================================================

function showImagePreview(file) {

    let preview =
        document.getElementById(
            "orgachatImagePreview"
        );


    if (!preview) {

        preview =
            document.createElement(
                "div"
            );


        preview.id =
            "orgachatImagePreview";


        preview.style.position =
            "fixed";

        preview.style.bottom =
            "80px";

        preview.style.left =
            "20px";

        preview.style.zIndex =
            "9998";

        preview.style.background =
            "white";

        preview.style.padding =
            "8px";

        preview.style.borderRadius =
            "12px";

        preview.style.boxShadow =
            "0 5px 25px rgba(0,0,0,.25)";


        document.body.appendChild(
            preview
        );

    }


    preview.innerHTML =
        "";


    const image =
        document.createElement(
            "img"
        );


    image.style.width =
        "160px";

    image.style.height =
        "120px";

    image.style.objectFit =
        "cover";

    image.style.borderRadius =
        "8px";


    const reader =
        new FileReader();


    reader.onload =
        function (event) {

            image.src =
                event.target.result;

        };


    reader.readAsDataURL(
        file
    );


    const close =
        document.createElement(
            "button"
        );


    close.textContent =
        "✕";


    close.style.position =
        "absolute";

    close.style.top =
        "-10px";

    close.style.right =
        "-10px";

    close.style.width =
        "28px";

    close.style.height =
        "28px";

    close.style.border =
        "none";

    close.style.borderRadius =
        "50%";

    close.style.cursor =
        "pointer";


    close.addEventListener(
        "click",
        function () {

            clearSelectedImage();

        }
    );


    preview.appendChild(
        image
    );


    preview.appendChild(
        close
    );

}


// =====================================================
// CLEAR IMAGE
// =====================================================

function clearSelectedImage() {

    selectedImage =
        null;


    const input =
        document.getElementById(
            "orgachatImageInput"
        );


    if (input) {

        input.value =
            "";

    }


    const preview =
        document.getElementById(
            "orgachatImagePreview"
        );


    if (preview) {

        preview.remove();

    }

}


// =====================================================
// FILE TO DATA URL
// =====================================================

function imageToDataURL(file) {

    return new Promise(
        function (resolve, reject) {

            const reader =
                new FileReader();


            reader.onload =
                function () {

                    resolve(
                        reader.result
                    );

                };


            reader.onerror =
                function () {

                    reject(
                        new Error(
                            "Gagal membaca gambar."
                        )
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


// =====================================================
// IMAGE VIEWER
// =====================================================

function openImageViewer(src) {

    const viewer =
        document.createElement(
            "div"
        );


    viewer.style.position =
        "fixed";

    viewer.style.inset =
        "0";

    viewer.style.background =
        "rgba(0,0,0,.88)";

    viewer.style.display =
        "flex";

    viewer.style.alignItems =
        "center";

    viewer.style.justifyContent =
        "center";

    viewer.style.zIndex =
        "10000";


    const image =
        document.createElement(
            "img"
        );


    image.src =
        src;


    image.style.maxWidth =
        "90%";

    image.style.maxHeight =
        "90%";

    image.style.objectFit =
        "contain";

    image.style.borderRadius =
        "12px";


    const close =
        document.createElement(
            "button"
        );


    close.textContent =
        "✕";


    close.style.position =
        "absolute";

    close.style.top =
        "20px";

    close.style.right =
        "20px";

    close.style.width =
        "45px";

    close.style.height =
        "45px";

    close.style.border =
        "none";

    close.style.borderRadius =
        "50%";

    close.style.cursor =
        "pointer";

    close.style.fontSize =
        "20px";


    close.addEventListener(
        "click",
        function () {

            viewer.remove();

        }
    );


    viewer.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                viewer
            ) {

                viewer.remove();

            }

        }
    );


    viewer.appendChild(
        image
    );


    viewer.appendChild(
        close
    );


    document.body.appendChild(
        viewer
    );

}


// =====================================================
// SAVE MESSAGES
// =====================================================

function saveMessages() {

    localStorage.setItem(
        "orgachatMessages",
        JSON.stringify(
            messages
        )
    );

}


// =====================================================
// STATS
// =====================================================

function updateStats() {

    const totalMessages =
        document.getElementById(
            "totalMessages"
        );


    const totalMembers =
        document.getElementById(
            "totalMembers"
        );


    const chatBadge =
        document.getElementById(
            "chatBadge"
        );


    if (totalMessages) {

        totalMessages.textContent =
            messages.length;

    }


    if (totalMembers) {

        totalMembers.textContent =
            getUsers().length;

    }


    if (chatBadge) {

        chatBadge.textContent =
            messages.length;

    }


    updateRecentMessages();

}


// =====================================================
// RECENT MESSAGES
// =====================================================

function updateRecentMessages() {

    const container =
        document.getElementById(
            "recentMessages"
        );


    if (!container)
        return;


    const recent =
        messages
            .slice(-5)
            .reverse();


    if (
        recent.length === 0
    ) {

        return;

    }


    container.innerHTML =
        "";


    recent.forEach(
        message => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "message-preview";


            const letter =
                message.name
                    .charAt(0)
                    .toUpperCase();


            const content =
                message.image
                    ? "🖼️ Gambar"
                    : message.text;


            item.innerHTML = `

                <div class="avatar">
                    ${escapeHTML(letter)}
                </div>

                <div>

                    <strong>
                        ${escapeHTML(
                            message.name
                        )}
                    </strong>

                    <p>
                        ${escapeHTML(
                            content || ""
                        )}
                    </p>

                </div>

                <small>
                    ${escapeHTML(
                        message.time
                    )}
                </small>

            `;


            container.appendChild(
                item
            );

        }
    );

}


// =====================================================
// SEARCH
// =====================================================

function setupSearch() {

    const searchChat =
        document.getElementById(
            "searchChat"
        );


    if (searchChat) {

        searchChat.addEventListener(
            "input",
            function () {

                const keyword =
                    this.value
                        .toLowerCase()
                        .trim();


                document
                    .querySelectorAll(
                        ".chat-contact"
                    )
                    .forEach(
                        contact => {

                            const text =
                                contact
                                    .textContent
                                    .toLowerCase();


                            contact.style.display =
                                text.includes(
                                    keyword
                                )
                                    ? "flex"
                                    : "none";

                        }
                    );

            }
        );

    }


    const memberSearch =
        document.getElementById(
            "memberSearch"
        );


    if (memberSearch) {

        memberSearch.addEventListener(
            "input",
            function () {

                const keyword =
                    this.value
                        .toLowerCase()
                        .trim();


                document
                    .querySelectorAll(
                        ".member-card"
                    )
                    .forEach(
                        card => {

                            const text =
                                card
                                    .textContent
                                    .toLowerCase();


                            card.style.display =
                                text.includes(
                                    keyword
                                )
                                    ? "block"
                                    : "none";

                        }
                    );

            }
        );

    }

}


// =====================================================
// DARK MODE
// =====================================================

function setupDarkMode() {

    const darkMode =
        localStorage.getItem(
            "orgachatDarkMode"
        );


    if (
        darkMode === "true"
    ) {

        document.body.classList.add(
            "dark"
        );

    }


    const darkModeBtn =
        document.getElementById(
            "darkModeBtn"
        );


    const settingDarkMode =
        document.getElementById(
            "settingDarkMode"
        );


    if (darkModeBtn) {

        darkModeBtn.addEventListener(
            "click",
            toggleDarkMode
        );

    }


    if (settingDarkMode) {

        settingDarkMode.addEventListener(
            "click",
            toggleDarkMode
        );

    }

}


function toggleDarkMode() {

    document.body.classList.toggle(
        "dark"
    );


    const active =
        document.body.classList.contains(
            "dark"
        );


    localStorage.setItem(
        "orgachatDarkMode",
        active
    );


    showToast(
        active
            ? "Mode gelap aktif"
            : "Mode terang aktif"
    );

}


// =====================================================
// LOGOUT
// =====================================================

function setupLogout() {

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if (!logoutBtn)
        return;


    logoutBtn.addEventListener(
        "click",
        function () {

            const confirmLogout =
                confirm(
                    "Apakah kamu yakin ingin keluar?"
                );


            if (!confirmLogout)
                return;


            localStorage.removeItem(
                "orgachatUser"
            );


            localStorage.removeItem(
                "orgachatCurrentUser"
            );


            currentUser =
                null;


            selectedImage =
                null;


            showLogin();


            showToast(
                "Berhasil logout."
            );

        }
    );

}


// =====================================================
// EXTRA BUTTONS
// =====================================================

function setupExtraButtons() {

    // Notifikasi

    const notification =
        document.querySelector(
            ".notification"
        );


    if (notification) {

        notification.addEventListener(
            "click",
            function () {

                showToast(
                    "Belum ada notifikasi baru."
                );

            }
        );

    }


    // Tombol titik tiga pada chat

    const chatAction =
        document.querySelector(
            ".chat-actions button"
        );


    if (chatAction) {

        chatAction.addEventListener(
            "click",
            function () {

                showToast(
                    "Menu chat akan dikembangkan."
                );

            }
        );

    }


    // Tombol buat pengumuman

    document
        .querySelectorAll(
            ".primary-btn"
        )
        .forEach(
            button => {

                const text =
                    button.textContent
                        .toLowerCase();


                if (
                    text.includes(
                        "pengumuman"
                    )
                ) {

                    button.addEventListener(
                        "click",
                        function () {

                            showToast(
                                "Fitur pengumuman akan dikembangkan."
                            );

                        }
                    );

                }


                if (
                    text.includes(
                        "agenda"
                    )
                ) {

                    button.addEventListener(
                        "click",
                        function () {

                            showToast(
                                "Fitur agenda akan dikembangkan."
                            );

                        }
                    );

                }

            }
        );

}


// =====================================================
// TOAST
// =====================================================

function showToast(text) {

    if (!toast)
        return;


    toast.textContent =
        text;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.orgaToastTimer
    );


    window.orgaToastTimer =
        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}


// =====================================================
// SECURITY
// =====================================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(
            text ?? ""
        );


    return div.innerHTML;

}


// =====================================================
// DEBUG
// =====================================================

console.log(
    "ORGAChat JavaScript berhasil dimuat."
);
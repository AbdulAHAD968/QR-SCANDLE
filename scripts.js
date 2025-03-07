// DATA FIELDS TO BE DISPLAYED ON FORM.
function DISPLAY_FORM(type) {
            
    let formContent = "";
    
    switch(type){
        case "url":{
            formContent = `<input type="text" id="qrInput" placeholder="Enter URL">`;
            break;
        }
        case "text":{
            formContent = `<input type="text" id="qrInput" placeholder="Enter Text">`;
            break;
        }
        case "email":{
            formContent = `<input type="text" id="emailTo" placeholder="Email Address">` +
                          `<input type="text" id="emailSubject" placeholder="Subject">` +
                          `<input type="text" id="emailBody" placeholder="Message">`;
            break;
        }
        case "phone":{
            formContent = `<input type="text" id="qrInput" placeholder="Enter Phone Number">`;
            break;
        }
        case "sms":{
            formContent = `<input type="text" id="smsNumber" placeholder="Phone Number">` +
                          `<input type="text" id="smsMessage" placeholder="Message">`;
            break;
        }
        case "wifi":{
            formContent = `<input type="text" id="wifiSSID" placeholder="WiFi Name">` +
                          `<input type="text" id="wifiPassword" placeholder="Password">` +
                          `<select id="wifiEncryption">` +
                          `<option value="WPA">WPA</option><option value="WEP">WEP</option><option value="nopass">None</option></select>`;
            break;
        }
        case "vcard":{
            formContent = `<input type="text" id="vcName" placeholder="Full Name">` +
                          `<input type="text" id="vcPhone" placeholder="Phone Number">` +
                          `<input type="text" id="vcEmail" placeholder="Email">`;
            break;
        }
        case "mecard":{
            formContent = `<input type="text" id="mecardName" placeholder="Name">` +
                          `<input type="text" id="mecardPhone" placeholder="Phone">`;
            break;
        }
        case "location":{
            formContent = `<input type="text" id="lat" placeholder="Latitude">` +
                          `<input type="text" id="lon" placeholder="Longitude">`;
            break;
        }
        case "event":{
            formContent = `<input type="text" id="eventTitle" placeholder="Event Title">` +
                          `<input type="date" id="eventDate" placeholder="YYYY-MM-DD">`;
            break;
        }
    }
    document.getElementById("dynamicForm").innerHTML = formContent;
    document.getElementById("qrcode").innerHTML = "";
    document.getElementById("overlay").style.display = "block";
    document.getElementById("modal").style.display = "block";
}


// JUST HIDE BY DEFAULT...
function HIDDEN(){
    document.getElementById("overlay").style.display = "none";
    document.getElementById("modal").style.display = "none";
}


// GENERATE QR CODE USING QRENCODE LIBRARY
function GEN_QR(){
    let data = "";
    let color = document.getElementById("colorInput").value.replace("#", "");
    let form = document.getElementById("dynamicForm").firstElementChild;
    
    if(!form){
        return alert("Please select a QR type!");
    }
    
    if(form.id === "qrInput"){
        data = form.value;
    }
    else if(form.id === "emailTo"){
        data = `mailto:${document.getElementById("emailTo").value}`;
    }
    else if(form.id === "smsNumber"){
        data = `sms:${document.getElementById("smsNumber").value}?body=${encodeURIComponent(document.getElementById("smsMessage").value)}`;
    }
    else if(form.id === "wifiSSID"){
        data = `WIFI:S:${document.getElementById("wifiSSID").value};
        T:${document.getElementById("wifiEncryption").value};
        P:${document.getElementById("wifiPassword").value};;`;
    }
    else if(form.id === "vcName"){
        data = `BEGIN:VCARD\nFN:${document.getElementById("vcName").value}\n
        TEL:${document.getElementById("vcPhone").value}\n
        EMAIL:${document.getElementById("vcEmail").value}\n
        END:VCARD`;
    }
    else if(form.id === "lat"){
        data = `geo:${document.getElementById("lat").value},${document.getElementById("lon").value}`;
    }
    else if(form.id === "urlInput"){
        data = document.getElementById("urlInput").value;
    }
    else if(form.id === "textInput"){
        data = document.getElementById("textInput").value;
    }
    else if(form.id === "phoneNumber"){
        data = `tel:${document.getElementById("phoneNumber").value}`;
    }
    else if(form.id === "eventTitle") {
        const eventTitle = document.getElementById("eventTitle").value;
        const eventDate = document.getElementById("eventDate").value;
        data = `BEGIN:EVENT\nSUMMARY:${eventTitle}\nDTSTART:${eventDate}\nEND:EVENT`;
    }

    if(!data){
        return alert("Please enter valid data!");
    }

    document.getElementById("qrcode").innerHTML = "";
    let qr = new QRCode(document.getElementById("qrcode"), {
        text: data,
        width: 300,
        height: 300,
        colorDark: "#" + color,
        correctLevel: QRCode.CorrectLevel.H
    });

    setTimeout(() => {
        document.getElementById("downloadQR").style.display = "inline-block";
        document.getElementById("shareQR").style.display = "inline-block";
    }, 500);
}


// DOQNLOAD QR CODE [Not working]
function DOWNLOAD_QR(){
    let qrCanvas = document.querySelector("#qrcode canvas");
    if (!qrCanvas) {
        alert("Please generate a QR code first!");
        return;
    }

    let tempCanvas = document.createElement("canvas");
    let ctx = tempCanvas.getContext("2d");
    tempCanvas.width = 2000;  // Ultra high resolution
    tempCanvas.height = 2000;
    ctx.drawImage(qrCanvas, 0, 0, 2000, 2000);  

    let link = document.createElement("a");
    link.href = tempCanvas.toDataURL("image/png");
    link.download = "qrcode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


// SHARE QR CODE [Not working]
function SHARE_QR(){
    let qrCanvas = document.querySelector("#qrcode canvas");
    if (!qrCanvas) {
        alert("Please generate a QR code first!");
        return;
    }

    qrCanvas.toBlob(blob => {
        let file = new File([blob], "qrcode.png", { type: "image/png" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            navigator.share({
                title: "QR Code",
                text: "Scan this QR Code!",
                files: [file]
            }).catch(err => console.log("Error sharing:", err));
        } else {
            alert("Sharing not supported on this device.");
        }
    }, "image/png", 1.0); // Max quality
}


// 3D MOVEMENT SUPPORT
document.querySelectorAll("#master-dev > div").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
        let rect = card.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        let centerX = rect.width / 2;
        let centerY = rect.height / 2;

        let rotateX = (centerY - y) / 8;
        let rotateY = (x - centerX) / 8;

        card.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transition = "transform 0.3s ease-out";
        card.style.transform = "perspective(500px) rotateX(0deg) rotateY(0deg)";
        setTimeout(() => {
            card.style.transition = "";
        }, 300);
    });
});

// THEME TOGGLE
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    document.querySelector(".theme-switch").classList.toggle("active");
}



//    <!-- STOP RIGHT CLICK. -->
document.addEventListener("contextmenu", function(event) {
    event.preventDefault();
});


//    <!-- DISABLE ALL THE KEYBOARD SHORTCUTS [FOR NON TECHNICAL PEOPLE, TECHNICAL PEOPLE DO HAVE ACCESS USING ADVANCE TOOLS] -->
document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && (event.key === "u" || event.key === "s" || event.key === "i" || event.key === "j")) {
        event.preventDefault();
    }
    if (event.key === "F12") {
        event.preventDefault();
    }
});

document.addEventListener("keydown", function(event) {
    if (
        (event.ctrlKey && event.shiftKey && (event.key === "I" || event.key === "J" || event.key === "C")) || // Ctrl+Shift+I/J/C
        (event.ctrlKey && event.key === "U") || // Ctrl+U
        (event.key === "F12") // F12
    ) {
        event.preventDefault();
    }
});
var host = "https://localhost:";
var port = "44329/";
var paketiEndpoint = "api/Paketi/";
var kuririEndpoint = "api/Kuriri/";
var loginEndpoint = "api/authentication/login";
var registerEndpoint = "api/authentication/register";
var formAction = "Create";
var editingId;
var jwt_token;

function loadPage() {
    loadPaketi();
}

function showLogin() {
    document.getElementById("formDiv").style.display = "none";
    document.getElementById("loginFormDiv").style.display = "block";
    document.getElementById("registerFormDiv").style.display = "none";
    document.getElementById("logout").style.display = "none";
}

function validateRegisterForm(username, email, password, confirmPassword) {
    if (username.length === 0) {
        alert("Username field can not be empty.");
        return false;
    } else if (email.length === 0) {
        alert("Email field can not be empty.");
        return false;
    } else if (password.length === 0) {
        alert("Password field can not be empty.");
        return false;
    } else if (confirmPassword.length === 0) {
        alert("Confirm password field can not be empty.");
        return false;
    } else if (password !== confirmPassword) {
        alert("Password value and confirm password value should match.");
        return false;
    }
    return true;
}

function registerUser() {
    var username = document.getElementById("usernameRegister").value;
    var email = document.getElementById("emailRegister").value;
    var password = document.getElementById("passwordRegister").value;
    var confirmPassword = document.getElementById(
        "confirmPasswordRegister"
    ).value;

    if (validateRegisterForm(username, email, password, confirmPassword)) {
        var url = host + port + registerEndpoint;
        var sendData = { Username: username, Email: email, Password: password };
        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sendData),
        })
            .then((response) => {
                if (response.status === 200) {
                    document.getElementById("registerForm").reset();
                    console.log("Successful registration");
                    alert("Successful registration");
                    showLogin();
                } else {
                    console.log("Error occured with code " + response.status);
                    console.log(response);
                    alert("Error occured!");
                    response.text().then((text) => {
                        console.log(text);
                    });
                }
            })
            .catch((error) => console.log(error));
    }
    return false;
}

// prikaz forme za registraciju
function showRegistration() {
    document.getElementById("formDiv").style.display = "none";
    document.getElementById("loginFormDiv").style.display = "none";
    document.getElementById("registerFormDiv").style.display = "block";
    document.getElementById("logout").style.display = "none";
}

function validateLoginForm(username, password) {
    if (username.length === 0) {
        alert("Username field can not be empty.");
        return false;
    } else if (password.length === 0) {
        alert("Password field can not be empty.");
        return false;
    }
    return true;
}

function loginUser() {
    var username = document.getElementById("usernameLogin").value;
    var password = document.getElementById("passwordLogin").value;

    if (validateLoginForm(username, password)) {
        var url = host + port + loginEndpoint;
        var sendData = { Username: username, Password: password };
        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sendData),
        })
            .then((response) => {
                if (response.status === 200) {
                    document.getElementById("loginForm").reset();
                    console.log("Successful login");
                    alert("Successful login");
                    response.json().then(function (data) {
                        console.log(data);
                        document.getElementById("info").innerHTML =
                            "Currently logged in user: <i>" + data.username + "<i/>.";
                        document.getElementById("logout").style.display = "block";
                        document.getElementById("btnLogin").style.display = "none";
                        document.getElementById("btnRegister").style.display = "none";
                        document.getElementById("searchForm").style.display = "block";
                        jwt_token = data.token;
                        loadPaketi();
                        loadKuririForDropdown();
                    });
                } else {
                    console.log("Error occured with code " + response.status);
                    console.log(response);
                    alert("Error occured!");
                    response.text().then((text) => {
                        console.log(text);
                    });
                }
            })
            .catch((error) => console.log(error));
    }
    return false;
}

function loadPaketi() {
    document.getElementById("loginFormDiv").style.display = "none";
    document.getElementById("registerFormDiv").style.display = "none";

    // ucitavanje prodavaca
    var requestUrl = host + port + paketiEndpoint;
    console.log("URL zahteva: " + requestUrl);
    var headers = {};
    if (jwt_token) {
        headers.Authorization = "Bearer " + jwt_token;
    }
    console.log(headers);
    fetch(requestUrl, { headers: headers })
        .then((response) => {
            if (response.status === 200) {
                response.json().then(setPaketi);
            } else {
                console.log("Error occured with code " + response.status);
                showError();
            }
        })
        .catch((error) => console.log(error));
}
//////-SHOW ERROR-//////
function showError() {
    var container = document.getElementById("data");
    container.innerHTML = "";

    var div = document.createElement("div");
    var h1 = document.createElement("h1");
    var errorText = document.createTextNode(
        "Error occured while retrieving data!"
    );

    h1.appendChild(errorText);
    div.appendChild(h1);
    container.append(div);
}

function setPaketi(data) {
    var container = document.getElementById("data");
    container.innerHTML = "";

    console.log("SetPaket fja");
    console.log(data);

    // ispis naslova
    var div = document.createElement("div");
    var h1 = document.createElement("h1");
    var headingText = document.createTextNode("Paketi");
    h1.appendChild(headingText);
    div.appendChild(h1);

    // ispis tabele
    var table = document.createElement("table");
    table.className = "table table-hover";

    var header = createHeader();
    table.append(header);

    var tableBody = document.createElement("tbody");

    for (var i = 0; i < data.length; i++) {
        // prikazujemo novi red u tabeli
        var row = document.createElement("tr");
        // prikaz podataka
        row.appendChild(createTableCell(data[i].id));

        if (jwt_token) {
            row.appendChild(createTableCell(data[i].posiljalac));
            row.appendChild(createTableCell(data[i].primalac));
            row.appendChild(createTableCell(data[i].tezina));
            row.appendChild(createTableCell(data[i].postarina));
            row.appendChild(createTableCell(data[i].kurirIme));
            row.appendChild(createTableCell(data[i].dostavljen ? "Da" : "Ne"));

            // prikaz dugmadi za izmenu i brisanje
            var stringId = data[i].id.toString();

            var buttonEdit = document.createElement("button");
            buttonEdit.name = stringId;
            buttonEdit.addEventListener("click", editPaket);
            buttonEdit.className = "btn btn-warning";
            var buttonEditText = document.createTextNode("Edit");
            buttonEdit.appendChild(buttonEditText);
            var buttonEditCell = document.createElement("td");
            buttonEditCell.appendChild(buttonEdit);
            row.appendChild(buttonEditCell);

            var buttonDelete = document.createElement("button");
            buttonDelete.name = stringId;
            buttonDelete.addEventListener("click", deletePaket);
            buttonDelete.className = "btn btn-danger";
            var buttonDeleteText = document.createTextNode("Delete");
            buttonDelete.appendChild(buttonDeleteText);
            var buttonDeleteCell = document.createElement("td");
            buttonDeleteCell.appendChild(buttonDelete);
            row.appendChild(buttonDeleteCell);
        }
        tableBody.appendChild(row);
    }

    table.appendChild(tableBody);
    div.appendChild(table);

    // prikaz forme
    if (jwt_token) {
        document.getElementById("formDiv").style.display = "block";
    }
    // ispis novog sadrzaja
    container.appendChild(div);
}

function createHeader() {
    var thead = document.createElement("thead");
    var row = document.createElement("tr");

    row.appendChild(createTableHeaderCell("Id"));

    if (jwt_token) {
        row.appendChild(createTableHeaderCell("Posiljalac"));
        row.appendChild(createTableHeaderCell("Primalac"));
        row.appendChild(createTableHeaderCell("Tezina"));
        row.appendChild(createTableHeaderCell("Postarina"));
        row.appendChild(createTableHeaderCell("Kurir"));
        row.appendChild(createTableHeaderCell("Dostavljen"));
        row.appendChild(createTableHeaderCell("Edit"));
        row.appendChild(createTableHeaderCell("Delete"));
    }

    thead.appendChild(row);
    return thead;
}

function createTableHeaderCell(text) {
    var cell = document.createElement("th");
    var cellText = document.createTextNode(text);
    cell.appendChild(cellText);
    return cell;
}

function createTableCell(text) {
    var cell = document.createElement("td");
    var cellText = document.createTextNode(text);
    cell.appendChild(cellText);
    return cell;
}
function loadKuririForDropdown() {
    // ucitavanje prodavnica
    var requestUrl = host + port + kuririEndpoint;
    console.log("URL zahteva: " + requestUrl);

    var headers = {};
    if (jwt_token) {
        headers.Authorization = "Bearer " + jwt_token;
    }

    fetch(requestUrl, { headers: headers })
        .then((response) => {
            if (response.status === 200) {
                response.json().then(setKuririInDropdown);
            } else {
                console.log("Error occured with code " + response.status);
            }
        })
        .catch((error) => console.log(error));
}
function setKuririInDropdown(data) {
    var dropdown = document.getElementById("paketKurir");
    dropdown.innerHTML = "";
    for (var i = 0; i < data.length; i++) {
        var option = document.createElement("option");
        option.value = data[i].id;
        var text = document.createTextNode(data[i].ime);
        option.appendChild(text);
        dropdown.appendChild(option);
    }
}

function submitPaketForm() {
    var posiljalac = document.getElementById("posiljalac").value;
    var primalac = document.getElementById("primalac").value;
    var tezina = document.getElementById("tezina").value;
    var postarina = document.getElementById("postarina").value;
    var kurir = document.getElementById("paketKurir").value;
    var dostavljenCheckbox = document.getElementById("dostavljen");
    var dostavljen = dostavljenCheckbox.checked;
    var httpAction;
    var sendData;
    var url;

    // u zavisnosti od akcije pripremam objekat
    if (formAction === "Create") {
        httpAction = "POST";
        url = "https://localhost:44329/api/Paketi";
        sendData = {
            posiljalac: posiljalac,
            primalac: primalac,
            tezina: tezina,
            postarina: postarina,
            dostavljen: dostavljen,
            kurirId: kurir,
        };
    } else {
        httpAction = "PUT";
        url = host + port + paketiEndpoint + editingId.toString();
        sendData = {
            Id: editingId,
            posiljalac: posiljalac,
            primalac: primalac,
            tezina: tezina,
            postarina: postarina,
            dostavljen: dostavljen,
            kurirId: kurir,
        };
    }

    console.log("Objekat za slanje");
    console.log(sendData);
    var headers = { "Content-Type": "application/json" };
    if (jwt_token) {
        headers.Authorization = "Bearer " + jwt_token;
    }
    fetch(url, {
        method: httpAction,
        headers: headers,
        body: JSON.stringify(sendData),
    })
        .then((response) => {
            if (response.status === 200 || response.status === 201) {
                console.log("Successful action");
                formAction = "Create";
                refreshTable();
            } else {
                console.log("Error occured with code " + response.status);
                alert("Error occured!");
            }
        })
        .catch((error) => console.log(error));
    return false;
}

function deletePaket() {
    // izvlacimo {id}
    var deleteID = this.name;
    // saljemo zahtev
    var url = host + port + paketiEndpoint + deleteID.toString();
    var headers = { "Content-Type": "application/json" };
    if (jwt_token) {
        headers.Authorization = "Bearer " + jwt_token;
    }

    fetch(url, { method: "DELETE", headers: headers })
        .then((response) => {
            if (response.status === 204) {
                console.log("Successful action");
                refreshTable();
            } else {
                console.log("Error occured with code " + response.status);
                alert("Error occured!");
            }
        })
        .catch((error) => console.log(error));
}

function editPaket() {

    var editId = this.name;

    function renderDostavljen(dostavljen) {
        if (dostavljen) {
            return (document.getElementById("dostavljen").checked = true);
        } else {
            return (document.getElementById("dostavljen").checked = false);
        }
    }

    var url = host + port + paketiEndpoint + editId.toString();
    var headers = {};
    if (jwt_token) {
        headers.Authorization = "Bearer " + jwt_token;
    }

    fetch(url, { headers: headers })
        .then((response) => {
            if (response.status === 200) {
                console.log("Successful action");
                response.json().then((data) => {
                    document.getElementById("posiljalac").value = data.posiljalac;
                    document.getElementById("primalac").value = data.primalac;
                    document.getElementById("tezina").value = data.tezina;
                    document.getElementById("postarina").value = data.postarina;
                    document.getElementById("paketKurir").value = data.mestoId;
                    renderDostavljen(data.dostavljen);
                    editingId = data.id;
                    formAction = "Update";
                });
            } else {
                formAction = "Create";
                console.log("Error occured with code " + response.status);
                alert("Error occured!");
            }
        })
        .catch((error) => console.log(error));
}

function refreshTable() {
    // cistim formu
    document.getElementById("PaketForm").reset();
    // osvezavam
    loadPaketi();
}

function logout() {
    jwt_token = undefined;
    document.getElementById("info").innerHTML = "";
    document.getElementById("data").innerHTML = "";
    document.getElementById("formDiv").style.display = "none";
    document.getElementById("loginFormDiv").style.display = "block";
    document.getElementById("registerFormDiv").style.display = "none";
    document.getElementById("logout").style.display = "none";
    document.getElementById("btnLogin").style.display = "initial";
    document.getElementById("btnRegister").style.display = "initial";
}

function cancelPaketForm() {
    formAction = "Create";
}




function submitSearchPaketForm() {
    var minTezina = document.getElementById("minTezina").value;
    var maxTezina = document.getElementById("maxTezina").value;
    var sendData = {
        minTezina: minTezina,
        maxTezina: maxTezina
      }
    var url = "https://localhost:44329/api/pretraga";
  
    console.log("Objekat za slanje");
    console.log(sendData);
  
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sendData),
    })
      .then((response) => {
        if (response.status === 200) {
          response.json().then(setPaketi);
          document.getElementById("searchPaketForm").reset();
        } else {
          console.log("Error occured with code " + response.status);
          showError();
        }
      })
      .catch((error) => console.log(error));
    return false;
  }

  function undoSearch() {
    
    document.getElementById("minTezina").value = "";
    document.getElementById("maxTezina").value = "";

    loadPaketi()
}
  

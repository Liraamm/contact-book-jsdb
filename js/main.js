const contactContainer = document.querySelector(".contact-container");
const addForm = document.querySelector(".add-contact");
const addName = document.querySelector("#add-name");
const addSurname = document.querySelector("#add-surname");
const addPicture = document.querySelector("#add-url");
const addNumber = document.querySelector("#add-number");
const editModal = document.querySelector("#edit-modal");
const closeModalBtn = document.querySelector("#close-modal");
const editInputName = document.querySelector("#edit-input-name");
const editInputSurname = document.querySelector("#edit-input-surname");
const editInputNumber = document.querySelector("#edit-input-number");
const editInputPicture = document.querySelector("#edit-input-picture");
const editCancel = document.querySelector("#edit-cancel");
const editSubmit = document.querySelector(".edit-submit");

// let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

const API = "http://localhost:8000/contacts";

//! GET
async function getContacts() {
  const res = await fetch(API);
  const data = await res.json();
  return data;
}

//! GET ONE

async function getOneContact(id) {
  const res = await fetch(`${API}/${id}`);
  const data = await res.json();
  return data;
}

//! POST
async function addContact(newContact) {
  const res = await fetch(API, {
    method: "POST",
    body: JSON.stringify(newContact),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

//! DELETE

async function deleteContact(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
}

//! PATCH

async function editContact(newData, id) {
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(newData),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

render();

//! read
async function render() {
  const data = await getContacts();
  contactContainer.innerHTML = "";
  data.forEach((item) => {
    contactContainer.innerHTML += `
    <div class="contact-item" style="background-color:white">
    <img src="${item.picture}" alt="" style="width: 50px; height: 50px; border-radius: 50px;">
    <span>${item.name}</span>
    <span>${item.surname}</span>
    <span>${item.number}</span>
    <div>
      <button id="${item.id}" class="edit-btn">edit</button
      ><button id="${item.id}" class="delete-btn">delete</button>
    </div>
  </div>`;
  });
}

//! add
addForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (
    !addName.value.trim() ||
    !addNumber.value.trim() ||
    !addSurname.value.trim()
  ) {
    addName.value = "";
    addNumber.value = "";
    return;
  }
  const contact = {
    name: addName.value,
    surname: addSurname.value,
    picture: addPicture.value,
    number: addNumber.value,
  };
  addName.value = "";
  addSurname.value = "";
  addPicture.value = "";
  addNumber.value = "";
  await addContact(contact);
  render();
});

//! delete

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    await deleteContact(e.target.id);
    render();
  }
});

//! edit

let id = null;

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("edit-btn")) {
    editModal.style.visibility = "visible";
    const contact = await getOneContact(e.target.id);
    id = e.target.id;
    editInputName.value = contact.name;
    editInputNumber.value = contact.number;
    editInputPicture.value = contact.picture;
    editInputSurname.value = contact.surname;
    editInputName.focus();
  }
});

function handleCloseModal() {
  editModal.style.visibility = "hidden";
}

closeModalBtn.addEventListener("click", handleCloseModal);
editCancel.addEventListener("click", handleCloseModal);

editSubmit.addEventListener("click", async () => {
  if (
    !editInputName.value.trim() ||
    !editInputNumber.value.trim() ||
    !editInputSurname.value.trim()
  ) {
    return;
  }
  const newData = {
    name: editInputName.value,
    surname: editInputSurname.value,
    picture: editInputPicture.value,
    number: editInputNumber.value,
  };
  await editContact(newData, id);
  render();
  handleCloseModal();
});

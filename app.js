const API = 'https://jsonplaceholder.typicode.com/posts';

const lista = document.querySelector('#postari');
const status = document.querySelector('#status');
const form = document.querySelector('#form-postare');
const mesajForm = document.querySelector('#mesaj-form');

// afiseaza un mesaj; tip poate fi 'eroare' sau 'succes'
function afiseazaMesaj(element, text, tip) {
  element.textContent = text;
  element.classList.remove('eroare', 'succes');
  if (tip) {
    element.classList.add(tip);
  }
}

// creeaza un <li> pentru o postare
function creeazaElement(postare) {
  const li = document.createElement('li');
  li.className = 'card';
  li.dataset.id = postare.id;

  const titlu = document.createElement('h3');
  titlu.textContent = postare.title;

  const continut = document.createElement('p');
  continut.textContent = postare.body;

  const buton = document.createElement('button');
  buton.type = 'button';
  buton.className = 'sterge';
  buton.textContent = 'Șterge';

  li.append(titlu, continut, buton);
  return li;
}

// cate postari sunt in lista
function actualizeazaStatus() {
  const numar = lista.children.length;
  if (numar === 0) {
    afiseazaMesaj(status, 'Nicio postare.');
  } else {
    afiseazaMesaj(status, `Postări: ${numar}`);
  }
}

// mesajul de eroare trimis de server, daca exista
async function mesajServer(r) {
  try {
    const date = await r.json();
    return date.error ?? `Eroare ${r.status}`;
  } catch (err) {
    return `Eroare ${r.status}`;
  }
}

// GET - lista de postari
async function incarcaPostari() {
  afiseazaMesaj(status, 'Se încarcă...');
  try {
    const r = await fetch(`${API}?_limit=10`);
    if (!r.ok) {
      afiseazaMesaj(status, await mesajServer(r), 'eroare');
      return;
    }
    const postari = await r.json();
    lista.innerHTML = '';
    postari.forEach(postare => lista.append(creeazaElement(postare)));
    actualizeazaStatus();
  } catch (err) {
    console.error(err);
    afiseazaMesaj(status, 'Nu există conexiune la server.', 'eroare');
  }
}

// POST - adauga o postare noua
async function trimitePostare(e) {
  e.preventDefault();
  const date = Object.fromEntries(new FormData(form));
  date.userId = 1;

  try {
    const r = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(date)
    });
    if (!r.ok) {
      afiseazaMesaj(mesajForm, await mesajServer(r), 'eroare');
      return;
    }
    const postare = await r.json();
    lista.prepend(creeazaElement(postare));
    actualizeazaStatus();
    form.reset();
    afiseazaMesaj(mesajForm, `Postare creată cu id ${postare.id}`, 'succes');
  } catch (err) {
    console.error(err);
    afiseazaMesaj(mesajForm, 'Nu există conexiune la server.', 'eroare');
  }
}

// DELETE - listener pe lista, nu pe fiecare buton
async function stergePostare(e) {
  const buton = e.target.closest('.sterge');
  if (!buton) {
    return;
  }
  const li = buton.closest('li');

  try {
    const r = await fetch(`${API}/${li.dataset.id}`, { method: 'DELETE' });
    // 404 = nu exista pe server, o scot si din pagina
    if (!r.ok && r.status !== 404) {
      afiseazaMesaj(status, await mesajServer(r), 'eroare');
      return;
    }
    li.remove();
    actualizeazaStatus();
  } catch (err) {
    console.error(err);
    afiseazaMesaj(status, 'Nu există conexiune la server.', 'eroare');
  }
}

form.addEventListener('submit', trimitePostare);
lista.addEventListener('click', stergePostare);
incarcaPostari();

const productForm = document.querySelector("#form-produto");
const productList = document.querySelector("#lista-produtos");
const productCounter = document.querySelector("#contador-produtos");
const totalValueDisplay = document.querySelector("#valor-total-estoque");
const emptyListMessage = document.querySelector("#lista-vazia");
const errorMessage = document.querySelector("#mensagem-erro");
const submitButton = document.querySelector("#botao-enviar");
const formTitle = document.querySelector("#titulo-form");

const nameField = document.querySelector("#nome");
const priceField = document.querySelector("#preco");
const quantityField = document.querySelector("#quantidade");
const supplierField = document.querySelector("#fornecedor");

let products = [
  { id: 1, name: "Skol Lata 350ml", price: 3.5, quantity: 48, supplier: "Ambev Distribuidora" },
  { id: 2, name: "Brahma Long Neck 355ml", price: 4.5, quantity: 36, supplier: "Ambev Distribuidora" },
  { id: 3, name: "Heineken Long Neck 330ml", price: 6.5, quantity: 24, supplier: "Heineken Brasil" },
  { id: 4, name: "Corona Extra 330ml", price: 7.5, quantity: 24, supplier: "Grupo Modelo" },
];

let nextId = 5;

let editingId = null;

function renderList() {
  productList.innerHTML = "";

  products.forEach(function (product) {
    const item = document.createElement("li");
    item.dataset.id = product.id;

    if (product.quantity < 5) {
      item.classList.add("estoque-baixo");
    }

    const productText = document.createElement("span");
    productText.textContent = `${product.name} - R$ ${product.price.toFixed(2)} (${product.quantity} un.) - Fornecedor: ${product.supplier}`;

    if (product.quantity < 5) {
      const aviso = document.createElement("span");
      aviso.className = "aviso-estoque";
      aviso.textContent = "⚠ Estoque baixo";
      productText.appendChild(document.createElement("br"));
      productText.appendChild(aviso);
    }

    const buttonArea = document.createElement("div");
    buttonArea.className = "area-botoes";

    const editButton = document.createElement("button");
    editButton.textContent = "Editar";
    editButton.type = "button";
    editButton.className = "botao-editar";
    editButton.addEventListener("click", function () {
      startEditing(product.id);
    });

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remover";
    removeButton.type = "button";
    removeButton.className = "botao-remover";
    removeButton.addEventListener("click", function () {
      removeProduct(product.id);
    });

    buttonArea.appendChild(editButton);
    buttonArea.appendChild(removeButton);

    item.appendChild(productText);
    item.appendChild(buttonArea);
    productList.appendChild(item);
  });

  updateCounter();
  updateTotalValue();
  updateEmptyListMessage();
}

function updateCounter() {
  productCounter.textContent = `Produtos cadastrados: ${products.length}`;
}

function updateTotalValue() {
  const total = products.reduce(function (soma, product) {
    return soma + product.price * product.quantity;
  }, 0);

  const totalFormatado = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  totalValueDisplay.textContent = `Valor total em estoque: ${totalFormatado}`;
}

function updateEmptyListMessage() {
  emptyListMessage.hidden = products.length !== 0;
}

function showError(text) {
  errorMessage.textContent = text;
  errorMessage.hidden = false;
}

function hideError() {
  errorMessage.textContent = "";
  errorMessage.hidden = true;
}

function startEditing(id) {
  const product = products.find(function (p) {
    return p.id === id;
  });

  if (!product) return;

  nameField.value = product.name;
  priceField.value = product.price;
  quantityField.value = product.quantity;
  supplierField.value = product.supplier;

  editingId = product.id;

  formTitle.textContent = "Editar produto";
  submitButton.textContent = "Salvar alterações";
  nameField.focus();
}

function stopEditing() {
  editingId = null;
  formTitle.textContent = "Novo produto";
  submitButton.textContent = "Adicionar produto";
  productForm.reset();
}

function removeProduct(id) {
  products = products.filter(function (p) {
    return p.id !== id;
  });

  if (editingId === id) {
    stopEditing();
  }

  renderList();
}

productForm.addEventListener("submit", function (event) {
  event.preventDefault();

  hideError();

  const name = nameField.value.trim();
  const price = Number(priceField.value);
  const quantity = Number(quantityField.value);
  const supplier = supplierField.value.trim();

  if (quantity <= 0) {
    showError("A quantidade deve ser maior que zero.");
    return;
  }

  if (supplier === "") {
    showError("Informe o fornecedor do produto.");
    return;
  }

  if (editingId !== null) {
    const product = products.find(function (p) {
      return p.id === editingId;
    });

    product.name = name;
    product.price = price;
    product.quantity = quantity;
    product.supplier = supplier;

    stopEditing();
  } else {
    products.push({
      id: nextId,
      name: name,
      price: price,
      quantity: quantity,
      supplier: supplier,
    });
    nextId++;

    productForm.reset();
  }

  renderList();
});

renderList();
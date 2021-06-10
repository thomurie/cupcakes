$cupcakesList = $(".cupcakes-list");
$newCupcakeForm = $(".new-cupcake-form");
$initalState = $("body").html();

const API_URL = "http://127.0.0.1:5000";
// get current values from the form
function getValues() {
  let $flavor = $("#flavor").val();
  let $size = $("#size").val();
  let $rating = $("#rating").val();
  let $image = $("#image").val();

  return {
    flavor: $flavor,
    size: $size,
    rating: $rating,
    image: $image,
  };
}
// show all cupcakes
async function show_all_cupcakes() {
  response = await axios.get(`${API_URL}/api/cupcakes`);

  for (const cupcake of response.data.cupcakes) {
    let cupcakeHTML = createCupcakeHTML(cupcake);
    $cupcakesList.append(cupcakeHTML);
  }
}

// Get cupcake by id
async function show_cupcake_by_id(cupcake_id) {
  response = await axios.get(`${API_URL}/api/cupcakes/${cupcake_id}`);

  return response.data.cupcake;
}

// create new cupcake when form is submitted
async function create_new_cupcake(data) {
  console.log(data);
  response = await axios.post(`${API_URL}/api/cupcakes`, {
    flavor: data.flavor,
    size: data.size,
    rating: data.rating,
    image: data.image,
  });

  return response.data.cupcake;
}

// update cupcake details on form submittal
async function update_existing_cupcake(cupcake_id, obj) {
  await axios.patch(`${API_URL}/api/cupcakes/${cupcake_id}`, obj);
}

// remove a cupcake
async function remove_cupcake(cupcake_id) {
  response = await axios.delete(`${API_URL}/api/cupcakes/${cupcake_id}`);

  return response.data.message;
}

// create Cupcake HTML
function createCupcakeHTML(obj) {
  return `
    <div data-cupcake-id = ${obj.id}>
        <p> ${obj.flavor} | ${obj.size} | ${obj.rating} </p>
        <img src="${obj.image}" alt="Cupcake Image">
        <button class = "edit">Edit</button>
        <button class = "delete">Delete</button>
    </div>
    `;
}

// create Edit Form
function editCupcakeForm(obj) {
  return `<form class="edit-cupcake-form" id='${obj.id}'>
  
    <label for="flavor">Flavor</label>
    <input type="text" name="flavor" id="edit-flavor" value= '${obj.flavor}' />

    <label for="size">Size</label>
    <input type="text" name="size" id="edit-size" value = '${obj.size}'/>

    <label for="rating">Rating</label>
    <input type="text" name="rating" id="edit-rating" value = '${obj.rating}' />

    <label for="image">Image</label>
    <input type="text" name="image" id="edit-image" value = '${obj.image}' />

    <button class = 'save'>Save</button>
  </form>`;
}

// handle edit button click

async function editButtonClick(evt) {
  evt.preventDefault();
  $cupcakesList.html("");

  cupcake = $(evt.target).closest("div");
  cupcakeID = cupcake.attr("data-cupcake-id");
  cupcakeData = await show_cupcake_by_id(cupcakeID);
  cucakeEditForm = editCupcakeForm(cupcakeData);

  return $cupcakesList.append(cucakeEditForm);
}

$cupcakesList.on("click", ".edit", editButtonClick);

// handle changes made to cupcakes
function getEditedValues() {
  let $flavor = $("#edit-flavor").val();
  let $size = $("#edit-size").val();
  let $rating = $("#edit-rating").val();
  let $image = $("#iedit-mage").val();

  return {
    flavor: $flavor,
    size: $size,
    rating: $rating,
    image: $image,
  };
}

async function saveButtonClick(evt) {
  evt.preventDefault();
  cupcake = $(evt.target).parent();
  cupcakeID = cupcake.attr("id");
  await update_existing_cupcake(cupcakeID, getEditedValues());
  $cupcakesList.html("");
  return show_all_cupcakes();
}

$cupcakesList.on("click", ".save", saveButtonClick);

// add new cupcake
async function addButtonClick(evt) {
  evt.preventDefault();
  await create_new_cupcake(getValues());
  $cupcakesList.html("");
  $("#flavor").val("");
  $("#size").val("");
  $("#rating").val("");
  $("#image").val("");
  await show_all_cupcakes();
}
$newCupcakeForm.on("click", ".add", addButtonClick);

// handle delete
async function deleteButtonClick(evt) {
  evt.preventDefault();
  cupcake = $(evt.target).closest("div");
  cupcakeID = cupcake.attr("data-cupcake-id");
  await remove_cupcake(cupcakeID);
  $cupcakesList.html("");
  return show_all_cupcakes();
}
$cupcakesList.on("click", ".delete", deleteButtonClick);

// initalize home page
show_all_cupcakes();

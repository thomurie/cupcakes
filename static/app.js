$cupcakesList = $(".cupcakes-list");
$newCupcakeForm = $(".new-cupcake-form");

// get current values from the form
function getValues(params) {
  let flavor = $(".flavor").val();
  let size = $(".size").val();
  let rating = $(".rating").val();
  let image = $(".image").val();

  return {
    flavor: flavor,
    size: size,
    rating: rating,
    image: image,
  };
}
// show all cupcakes
async function show_all_cupcakes(params) {
  await axios.get("/api/cupcakes");
  return response.data.cupcakes;
}

// show cupcake by id
async function show_cupcake_by_id(cupcake_id) {
  response = await axios.get(`/api/cupcakes/${cupcake_id}`);

  return response.data.cupcake;
}

// create new cupcake when form is submitted
async function create_new_cupcake(data) {
  response = await axios.post(`'/api/cupcake`, {
    flavor: data.flavor,
    size: data.size,
    rating: data.rating,
    image: data.image,
  });

  return response.data.cupcake;
}

// update cupcake details on form submittal
async function update_existing_cupcake(cupcake_id) {
  response = await axios.patch(`/api/cupcakes/${cupcake_id}`);

  return response.data.cupcake;
}

// remove a cupcake
async function remove_cupcake(cupcake_id) {
  response = await axios.delete(`/api/cupcakes/${cupcake_id}`);

  return response.data.message;
}

import express from 'express';
import fetch from 'node-fetch';
const planets = (await import('npm-solarsystem')).default;
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

//for render
const port = process.env.PORT || 4000;

//routes
app.get('/', async (req, res) => {
  let apiKey = "7756a1e81f817c186cf57294e1c19b37b49c54b8f34e7c499ee0ce5cd86cd16e";
  let url = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&featured=true&query=solar-system`;
  let response = await fetch(url);
  let data = await response.json();
  let randomImage;
  if (!data.urls.full) {

    console.log("API rate limited switching to default")
    randomImage = "https://images.rawpixel.com/image_social_square/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA3L3BkbWlzYzEzLXdrMzY4ODE4MDYtaW1hZ2UuanBn.jpg"
  } else {
    randomImage = data.urls.full;
  }
  //api limited
  res.render("index", { "image": randomImage })

});

app.get('/planet', (req, res) => {
  let planetName = req.query.planetName;
  let planetInfo = planets[`get${planetName}`]();
  res.render('planet', { planetInfo, planetName });
});

app.get('/nasa', async (req, res) => {
  //https://www.geeksforgeeks.org/javascript/how-to-format-javascript-date-as-yyyy-mm-dd/
  const formateDate = (date) => {
    return date.toLocaleDateString('en-CA');
  }
  const currentDate = new Date();

  let date = formateDate(currentDate);
  console.log(date);
  let url = `https://api.nasa.gov/planetary/apod?api_key=9mUzIkhlZCZaOoMfspg7jMmwZCZ4LiRHtkgkambD&date=${date}`;
  let response = await fetch(url);
  let data = await response.json();
  let POD = data;
  res.render('nasa', { POD });

});



// app.get('/earth', (req, res) => {
//   let planetEarth = planets.getEarth();
//   res.render('earth', {planetEarth});
// });

// app.get('/mars', (req, res) => {
//   let planetMars = planets.getMars();
//   res.render('mars', {planetMars});
// });


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

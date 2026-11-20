/*
"Talk is cheap. Show me the code."
—Linus Torvalds
*/

// Palabas · WS1 TV Show Search code-along (TVmaze API, no key needed)
// Open DevTools (F12): keep the Console AND the Network tab open.
// Sample or live mode: see config.js.

// ---------- Given: page elements ----------
const form = document.getElementById("searchForm");
const input = document.getElementById("query");
const statusText = document.getElementById("status");
const results = document.getElementById("results");
const dialog = document.getElementById("details");
const detailsBody = document.getElementById("detailsBody");
const closeBtn = document.getElementById("closeDetails");
const modeBadge = document.getElementById("modeBadge");

// ---------- Given: the API's URLs ----------
const API = "https://api.tvmaze.com";

// Turns "Breaking Bad" into "breaking-bad" (used for the sample-data file names)
function slug(text) {
  return text.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// e.g. https://api.tvmaze.com/search/shows?q=breaking%20bad
function searchURL(query) {
  if (USE_SAMPLE_DATA) return `data/search/${slug(query)}.json`;
  return `${API}/search/shows?q=${encodeURIComponent(query)}`;
}

// e.g. https://api.tvmaze.com/shows/169
function showURL(id) {
  return USE_SAMPLE_DATA ? `data/shows/${id}.json` : `${API}/shows/${id}`;
}

// e.g. https://api.tvmaze.com/shows/169/cast
function castURL(id) {
  return USE_SAMPLE_DATA ? `data/cast/${id}.json` : `${API}/shows/${id}/cast`;
}

// e.g. https://api.tvmaze.com/shows/169/seasons
function seasonsURL(id) {
  return USE_SAMPLE_DATA ? `data/seasons/${id}.json` : `${API}/shows/${id}/seasons`;
}

// ---------- Given: helpers (no need to change) ----------

// Shows a message under the search box. type: "info", "loading" or "error"
function setStatus(message, type = "info") {
  statusText.textContent = message;
  statusText.className = "status " + type;
}

// Makes an element with an optional class and text: el("span", "year", "2008")
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// A poster <img>, or a placeholder when the show has no image (image is null)
function createPoster(show, size = "medium") {
  if (!show.image) {
    return el("span", "poster none", "No poster");
  }
  const img = el("img", "poster");
  img.src = show.image[size] || show.image.medium;
  img.alt = `Poster: ${show.name}`;
  img.loading = "lazy";
  img.addEventListener("error", () => img.replaceWith(el("span", "poster none", "No poster")));
  return img;
}

// "2008–2013", or "2016–" for a show that is still running
function yearRange(show) {
  const start = show.premiered ? show.premiered.slice(0, 4) : "?";
  const end = show.ended ? show.ended.slice(0, 4) : "";
  return `${start}–${end}`;
}

// TVmaze summaries contain HTML like "<p><b>Friends</b> follows…</p>".
// This keeps only the text. (Never put text from an API into innerHTML:
// if it contained a <script> or an onerror, it could run on your page.)
function stripTags(html) {
  if (!html) return "No summary yet.";
  return new DOMParser().parseFromString(html, "text/html").body.textContent;
}

// Close the details pop-up (Step 4) with the × button or by clicking outside it
closeBtn.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

// Show which mode we're in
modeBadge.textContent = USE_SAMPLE_DATA ? "Sample data" : "Live · TVmaze";
modeBadge.classList.toggle("live", !USE_SAMPLE_DATA);

// STEP 1 — Your first API request
// TODO: async function testRequest(): fetch searchURL("friends"), log the status and the JSON array

/*
async function testRequest() {
  const url = searchURL("friends");
  console.log("Request:", url); // live mode: open this URL in a new tab to see the raw JSON

  const response = await fetch(url); // 1st await: the response arrives
  console.log("Status:", response.status, "ok?", response.ok);

  const data = await response.json(); // 2nd await: the body is read as JSON
  console.log(data); // an ARRAY of { score, show }
  console.log("How many:", data.length);
  console.log("First show:", data[0].show.name, data[0].show.premiered);
}

testRequest(); // makes a request for the search "friends" and prints what comes back
*/

// STEP 2 — Search and show the results
// TODO: renderResults(items), searchShows(query), and a submit listener on the form

function renderResults(items) { //clears the results, then for each show it builds a <button class="card"> with the contents then adds it to the page
  results.innerHTML = ""; 

  items.forEach((item) => {
    const show = item.show;

    const card = el("button", "card");
    card.type = "button";
    card.dataset.id = show.id;

    const rating = show.rating.average;

    card.append(
      createPoster(show),
      el("span", "title", show.name),
      el("span", "year", yearRange(show)),
      el("span", "genres", show.genres.join(", ")),
      el("span", "rating", rating ? `★ ${rating}` : "Not rated yet")
    );

    results.appendChild(card);
  });
}

async function searchShows(query) { //gets the data for a search, fetches searchURL(query), reads it as json then passes to renderResults
  const response = await fetch(searchURL(query));
  const data = await response.json();
  renderResults(data);
}

form.addEventListener("submit", (event) => { //stops the page reload with event.preventDefault(), reads and trims the input, nothing happens if empty, otherwise calls searchShows
  event.preventDefault();
  const query = input.value.trim();
  if (query === "") return;
  searchShows(query);
});

// STEP 3 — getJSON(): one careful helper for every request
// TODO: catch network errors, check 429 and response.ok; rewrite searchShows with try / catch and an empty-array check

async function getJSON(url) { //tries fetch, if it rejects (no internet) shows "can't reach tvmaze...". I also tried to make the 429 request work by changing (response.status === 429) to 200 and it did show "Too many requests (429..."
  let response;
  try {
    response = await fetch(url);
  } catch (networkError) {
    throw new Error("Can't reach TVmaze. Check your internet, or set USE_SAMPLE_DATA = true in config.js.");
  }

  if (response.status === 429) {
    throw new Error("Too many requests (429). Wait 10 seconds and try again.");
  }

  if (!response.ok) {
    throw new Error(
      USE_SAMPLE_DATA
        ? "Sample mode only knows: friends, office, breaking bad, stranger things, sherlock, thrones, sample."
        : `Request failed (HTTP ${response.status}).`
    );
  }

  return response.json();
}

async function searchShows(query) { //shows "searching for.." with the spinner
  setStatus(`Searching for "${query}"…`, "loading");
  results.innerHTML = "";

  try {
    const data = await getJSON(searchURL(query));

    if (data.length === 0) {
      setStatus(`No shows found for "${query}". Check the spelling.`, "error");
      return;
    }

    renderResults(data);
    setStatus(`${data.length} ${data.length === 1 ? "show" : "shows"} found for "${query}"`);
  } catch (error) {
    setStatus(error.message, "error");
  }
}

// STEP 4 — Click a show to see its details
// TODO: one click listener on #results, showDetails(id), renderDetails(show)

results.addEventListener("click", (event) => {
  const card = event.target.closest(".card");
  if (card) showDetails(card.dataset.id);
});

async function showDetails(id) { //shows "loading details" and the spinner pop up.
  detailsBody.replaceChildren(el("p", "status loading", "Loading details…"));
  dialog.showModal();

  try {
    const show = await getJSON(showURL(id));
    renderDetails(show);
  } catch (error) {
    detailsBody.replaceChildren(el("p", "status error", error.message));
  }
}

function renderDetails(show) {
  const where = show.network ? show.network.name : show.webChannel ? show.webChannel.name : "";
  const minutes = show.runtime || show.averageRuntime;

  const info = el("div", "info");
  info.append(
    el("h2", "", show.name),
    el("p", "meta", [yearRange(show), where, show.genres.join(", "), minutes ? `${minutes} min` : ""].filter(Boolean).join(" · ")),
    el("p", "score", show.rating.average ? `★ ${show.rating.average} / 10` : "Not rated yet"),
    el("p", "plot", stripTags(show.summary))
  );

  const links = el("p", "links");
  const tvmaze = el("a", "", "View on TVmaze ↗");
  tvmaze.href = show.url;
  tvmaze.target = "_blank";
  links.append(tvmaze);
  info.append(links);

  detailsBody.replaceChildren(createPoster(show, "original"), info);
}

// STEP 5 — Promise.all: show + cast + seasons at the same time
// TODO: rewrite showDetails with Promise.all, and renderDetails(show, cast, seasons)

async function showDetails(id) { // shows "loading details", notes thestart time with performance.now. uses Promise.all to start 3 requests; show,cast,seasons. 
  detailsBody.replaceChildren(el("p", "status loading", "Loading details…"));
  dialog.showModal();

  try {
    const start = performance.now();

    const [show, cast, seasons] = await Promise.all([
      getJSON(showURL(id)),
      getJSON(castURL(id)),
      getJSON(seasonsURL(id)),
    ]);

    console.log(`3 requests in ${Math.round(performance.now() - start)} ms`);
    renderDetails(show, cast, seasons); //builds pop-up content
  } catch (error) {
    detailsBody.replaceChildren(el("p", "status error", error.message));
  }
}

function renderDetails(show, cast, seasons) {
  const where = show.network ? show.network.name : show.webChannel ? show.webChannel.name : "";
  const minutes = show.runtime || show.averageRuntime;
  const seasonText = seasons.length === 1 ? "1 season" : `${seasons.length} seasons`;

  const info = el("div", "info");
  info.append(
    el("h2", "", show.name),
    el("p", "meta", [yearRange(show), where, seasonText, minutes ? `${minutes} min` : ""].filter(Boolean).join(" · ")),
    el("p", "meta", show.genres.join(", ")),
    el("p", "score", show.rating.average ? `★ ${show.rating.average} / 10` : "Not rated yet"),
    el("p", "plot", stripTags(show.summary))
  );

  if (cast.length > 0) {
    const list = el("ul", "cast");
    cast.slice(0, 6).forEach((member) => {
      const li = el("li", "", member.person.name + " ");
      li.append(el("span", "", "as " + member.character.name));
      list.append(li);
    });
    info.append(el("h3", "", "Cast"), list);
  }

  const links = el("p", "links");
  const tvmaze = el("a", "", "View on TVmaze ↗");
  tvmaze.href = show.url;
  tvmaze.target = "_blank";
  links.append(tvmaze);
  info.append(links);

  detailsBody.replaceChildren(createPoster(show, "original"), info);
}

// extend B · Search as you type	Searching starts 500 ms after the user stops typing (setTimeout + clearTimeout on the input event). Typing "friends" quickly sends one request, not seven (prove it with the Network tab).

let typingTimer;

input.addEventListener("input", () => { // input event triggers everytime its content changes being each key press
  clearTimeout(typingTimer);

  typingTimer = setTimeout(() => { // basically says "run this code after a delay", that being 500ms
    const query = input.value.trim();
    if (query === "") return;
    searchShows(query);
  }, 500);
});
// Sample flight data
const sampleFlights = [
  {
    id: 1,
    airline: "IndiGo",
    code: "6E",
    flightNumber: "6E-123",
    departure: { time: "06:30", code: "DEL" },
    arrival: { time: "08:45", code: "BOM" },
    duration: "2h 15m",
    price: 4500,
    stops: "Non-stop",
  },
  {
    id: 2,
    airline: "Air India",
    code: "AI",
    flightNumber: "AI-456",
    departure: { time: "09:15", code: "DEL" },
    arrival: { time: "11:45", code: "BOM" },
    duration: "2h 30m",
    price: 5200,
    stops: "Non-stop",
  },
  {
    id: 3,
    airline: "SpiceJet",
    code: "SG",
    flightNumber: "SG-789",
    departure: { time: "14:20", code: "DEL" },
    arrival: { time: "16:50", code: "BOM" },
    duration: "2h 30m",
    price: 3800,
    stops: "Non-stop",
  },
  {
    id: 4,
    airline: "Vistara",
    code: "UK",
    flightNumber: "UK-012",
    departure: { time: "18:45", code: "DEL" },
    arrival: { time: "21:15", code: "BOM" },
    duration: "2h 30m",
    price: 6200,
    stops: "Non-stop",
  },
];

// Theme toggle 
const themeToggle = document.getElementById("themeToggle");
const body = document.body;
const icon = themeToggle.querySelector("i");

function toggleTheme() {
  const currentTheme = body.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  body.setAttribute("data-theme", newTheme);
  icon.className = newTheme === "dark" ? "fas fa-sun" : "fas fa-moon";

  // theme added in local
  const searchData = JSON.parse(
    localStorage.getItem("flightSearchData") || "{}"
  );
  searchData.theme = newTheme;
  localStorage.setItem("flightSearchData", JSON.stringify(searchData));
}

themeToggle.addEventListener("click", toggleTheme);





function loadSavedTheme() {
  const savedData = JSON.parse(
    localStorage.getItem("flightSearchData") || "{}"
  );
  if (savedData.theme === "dark") {
    body.setAttribute("data-theme", "dark");
    icon.className = "fas fa-sun";
  }
}

function setMinDate() {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("departureDate").min = today;
  document.getElementById("returnDate").min = today;
}


function loadSavedData() {
  const savedData = JSON.parse(
    localStorage.getItem("flightSearchData") || "{}"
  );

  if (savedData.fromCity)
    document.getElementById("fromCity").value = savedData.fromCity;
  if (savedData.toCity)
    document.getElementById("toCity").value = savedData.toCity;
  if (savedData.departureDate)
    document.getElementById("departureDate").value = savedData.departureDate;
  if (savedData.returnDate)
    document.getElementById("returnDate").value = savedData.returnDate;
  if (savedData.passengers)
    document.getElementById("passengers").value = savedData.passengers;
  if (savedData.travelClass)
    document.getElementById("travelClass").value = savedData.travelClass;
}


function saveSearchData() {
  const searchData = {
    fromCity: document.getElementById("fromCity").value,
    toCity: document.getElementById("toCity").value,
    departureDate: document.getElementById("departureDate").value,
    returnDate: document.getElementById("returnDate").value,
    passengers: document.getElementById("passengers").value,
    travelClass: document.getElementById("travelClass").value,
    theme: body.getAttribute("data-theme") || "light",
  };

  localStorage.setItem("flightSearchData", JSON.stringify(searchData));
}

// Generate flight results
function generateFlightResults(fromCity, toCity) {
  const results = sampleFlights.map((flight, index) => ({
    ...flight,
    id: index + 1,
    departure: { ...flight.departure, code: fromCity },
    arrival: { ...flight.arrival, code: toCity },
    price: Math.max(
      3000,
      flight.price + Math.floor(Math.random() * 2000) - 1000
    ),
  }));

  return results.sort((a, b) => a.price - b.price);
}


function renderFlightResults(flights) {
  const resultsContainer = document.getElementById("flightResults");

  resultsContainer.innerHTML = flights
    .map(
      (flight) => `
        <div class="col-12">
            <div class="flight-card p-4 d-flex flex-column flex-md-row align-items-center justify-content-between gap-4">
                <div class="d-flex flex-column align-items-center flex-shrink-0" style="min-width:100px;">
                    <div class="airline-logo mb-2">
                        ${flight.code}
                    </div>
                    <div class="text-center">
                        <small style="color: var(--text-muted);">${
                          flight.airline
                        }</small><br>
                        <small style="color: var(--text-muted);">${
                          flight.flightNumber
                        }</small>
                    </div>
                </div>
                <div class="flex-grow-1 d-flex flex-column flex-md-row align-items-center justify-content-center gap-4">
                    <div class="text-center">
                        <div class="flight-time">${flight.departure.time}</div>
                        <div class="flight-code">${flight.departure.code}</div>
                    </div>
                    <div class="flight-duration text-center mx-3">
                        <i class="fas fa-plane flight-arrow mb-2"></i>
                        <div>${flight.duration}</div>
                        <small style="color: var(--text-muted);">${
                          flight.stops
                        }</small>
                    </div>
                    <div class="text-center">
                        <div class="flight-time">${flight.arrival.time}</div>
                        <div class="flight-code">${flight.arrival.code}</div>
                    </div>
                </div>
                <div class="d-flex flex-column align-items-center flex-shrink-0 mt-3 mt-md-0" style="min-width:180px;">
                    <div class="price-tag mb-3 w-100 text-center" style="font-size:1.3rem;">
                        ₹${flight.price.toLocaleString()}
                    </div>
                    <button class="btn btn-primary btn-book w-100" style="font-size:1.1rem;" onclick="showFlightDetails(${
                      flight.id
                    })">
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    `
    )
    .join("");
}


function showFlightDetails(flightId) {
  // Find flight in current results or use sample data
  const currentResults = window.currentFlights || sampleFlights;
  const flight =
    currentResults.find((f) => f.id === flightId) ||
    sampleFlights.find((f) => f.id === flightId);

  if (!flight) {
    console.error("Flight not found:", flightId);
    return;
  }

  const modalBody = document.getElementById("modalBody");

  modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <h6>Flight Information</h6>
                <p><strong>Airline:</strong> ${flight.airline}</p>
                <p><strong>Flight Number:</strong> ${flight.flightNumber}</p>
                <p><strong>Duration:</strong> ${flight.duration}</p>
                <p><strong>Stops:</strong> ${flight.stops}</p>
            </div>
            <div class="col-md-6">
                <h6>Timing</h6>
                <p><strong>Departure:</strong> ${flight.departure.time} (${
    flight.departure.code
  })</p>
                <p><strong>Arrival:</strong> ${flight.arrival.time} (${
    flight.arrival.code
  })</p>
                <p><strong>Price:</strong> ₹${flight.price.toLocaleString()}</p>
            </div>
        </div>
        <hr>
        <div class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>
            <strong>Note:</strong> Price includes all taxes and fees. Baggage allowance: 15kg check-in + 7kg cabin baggage.
        </div>
    `;

  const modal = new bootstrap.Modal(document.getElementById("flightModal"));
  modal.show();
}



document
  .getElementById("flightSearchForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const fromCity = document.getElementById("fromCity").value.trim();
    const toCity = document.getElementById("toCity").value.trim();
    const departureDate = document.getElementById("departureDate").value;

    console.log("Form submitted:", { fromCity, toCity, departureDate });

    // Validation
    if (!fromCity || !toCity || !departureDate) {
      alert(
        "Please fill in all required fields (From, To, and Departure Date)"
      );
      return;
    }

    if (fromCity === toCity) {
      alert("Departure and destination cities cannot be the same!");
      return;
    }

    // Save search data
    saveSearchData();

    // Show loading
    const loadingSection = document.getElementById("loadingSection");
    const resultsSection = document.getElementById("resultsSection");

    loadingSection.style.display = "block";
    resultsSection.style.display = "none";

    console.log("Showing loading, generating flights...");


    setTimeout(() => {
      try {
        const flights = generateFlightResults(fromCity, toCity);
        console.log("Generated flights:", flights);

        
        window.currentFlights = flights;

        renderFlightResults(flights);

        
        loadingSection.style.display = "none";
        resultsSection.style.display = "block";

        console.log("Results displayed");

      
        resultsSection.scrollIntoView({
          behavior: "smooth",
        });
      } catch (error) {
        console.error("Error generating flights:", error);
        loadingSection.style.display = "none";
        alert("Error searching for flights. Please try again.");
      }
    }, 1500);
  });


document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing...");
  setMinDate();
  loadSavedTheme();
  loadSavedData();

  
  const form = document.getElementById("flightSearchForm");
  const fromCity = document.getElementById("fromCity");
  const toCity = document.getElementById("toCity");

  console.log("Form elements:", {
    form: !!form,
    fromCity: !!fromCity,
    toCity: !!toCity,
  });
});


document
  .getElementById("departureDate")
  .addEventListener("change", function () {
    document.getElementById("returnDate").min = this.value;
  });
 
window.showFlightDetails = showFlightDetails;

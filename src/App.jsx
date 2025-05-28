import { useRef, useState, useEffect, useCallback } from "react";
import Flag from "react-world-flags";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES, AVAILABLE_PLACES_IT } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
const storedPlaces = storedIds.map((id) =>
  AVAILABLE_PLACES.find((place) => place.id === id)
);

const storedIdsIT = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
const storedPlacesIT = storedIdsIT.map((id) =>
  AVAILABLE_PLACES_IT.find((place) => place.id === id)
);

function App() {
  const selectedPlace = useRef();
  const [modalisOpen, setModalIsOpen] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);
  const [pickedPlacesIT, setPickedPlacesIT] = useState(storedPlacesIT);
  const [isItalian, setIsItalian] = useState(false);
  const [isEnglish, setIsEnglish] = useState(true); //Default language is english

  const switchAvailablePlaces = () => {
    if (!isItalian && isEnglish) {
      return AVAILABLE_PLACES;
    } else if (isItalian && !isEnglish) {
      return AVAILABLE_PLACES_IT;
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        switchAvailablePlaces(),
        position.coords.latitude,
        position.coords.longitude
      );
      console.log(switchAvailablePlaces());
      setAvailablePlaces(sortedPlaces);
    });
  }, []);

  useEffect(() => {
    if (isItalian && !isEnglish) {
      setPickedPlaces(pickedPlacesIT);
    } else {
      setPickedPlaces(pickedPlaces);
    }
  }, [isItalian]);
  function handleStartRemovePlace(id) {
    setModalIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }
  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = switchAvailablePlaces().find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    if (storedIds.indexOf(id) === -1) {
      localStorage.setItem(
        "selectedPlaces",
        JSON.stringify([id, ...storedIds])
      );
    }
  }

  const handleRemovePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setModalIsOpen(false);

    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    localStorage.setItem(
      "selectedPlaces",
      JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current))
    );
  }, []);

  function handleSelectPlaceIT(id) {
    setPickedPlacesIT((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES_IT.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    const storedIdsIT =
      JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    if (storedIdsIT.indexOf(id) === -1) {
      localStorage.setItem(
        "selectedPlaces",
        JSON.stringify([id, ...storedIdsIT])
      );
    }
  }

  const handleRemovePlaceIT = useCallback(function handleRemovePlace() {
    setPickedPlacesIT((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setModalIsOpen(false);

    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    localStorage.setItem(
      "selectedPlaces",
      JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current))
    );
  }, []);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <button
          onClick={() => {
            setIsEnglish(false);
            setIsItalian(true);
          }}
          className="place-item"
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "2px",
            height: "30px",
            width: "auto",
          }}
        >
          <Flag code="IT" />
        </button>
        <button
          className="place-item"
          onClick={() => {
            setIsItalian(false);
            setIsEnglish(true);
          }}
          style={{
            display: "flex",
            margin: "2px",
            height: "30px",
            width: "auto",
          }}
        >
          <Flag code="US" />
        </button>
      </div>
      <Modal open={modalisOpen}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
          onConfirmIT={handleRemovePlaceIT}
          stateItalian={isItalian}
          stateEnglish={isEnglish}
        />
      </Modal>
      {isEnglish && !isItalian ? (
        <header>
          <img src={logoImg} alt="Stylized globe" />
          <h1>PlacePicker!</h1>
          <p>
            Create your personal collection of places you would like to visit or
            you have visited.
          </p>
        </header>
      ) : (
        <header>
          <img src={logoImg} alt="Stylized globe" />
          <h1>Scegli la località!</h1>
          <p>
            Crea la tua personale collezione di posti che ti piacerebbe visitare
            o che hai già visitato.
          </p>
        </header>
      )}
      {isEnglish && !isItalian ? (
        <main>
          <Places
            title="I'd like to visit ..."
            fallbackText={"Select the places you would like to visit below."}
            places={pickedPlaces}
            onSelectPlace={handleStartRemovePlace}
          />
          <Places
            title="Available Places"
            places={availablePlaces}
            fallbackText="Sorting places by distance..."
            onSelectPlace={handleSelectPlace}
          />
        </main>
      ) : (
        <main>
          <Places
            title="Mi piacerebbe visitare ..."
            fallbackText={
              "Seleziona le località che ti piacerebbe visitare quà sotto."
            }
            places={pickedPlacesIT}
            onSelectPlace={handleStartRemovePlace}
          />
          <Places
            title="Località disponibili"
            places={availablePlaces}
            fallbackText="Caricamento delle località in base alla distanza..."
            onSelectPlace={handleSelectPlaceIT}
          />
        </main>
      )}
    </>
  );
}

export default App;

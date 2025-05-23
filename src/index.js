import React, { useState, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import { LoadScript, GoogleMap, Polygon } from "@react-google-maps/api";
import MapComponent from "./MapComponent";
import "./styles.css";

// This example presents a way to handle editing a Polygon
// The objective is to get the new path on every editing event :
// - on dragging the whole Polygon
// - on moving one of the existing points (vertex)
// - on adding a new point by dragging an edge point (midway between two vertices)

// We achieve it by defining refs for the google maps API Polygon instances and listeners with `useRef`
// Then we bind those refs to the currents instances with the help of `onLoad`
// Then we get the new path value with the `onEdit` `useCallback` and pass it to `setPath`
// Finally we clean up the refs with `onUnmount`

function App() {
  return <MapComponent />;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

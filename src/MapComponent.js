import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  LoadScript,
  GoogleMap,
  Polygon,
  DrawingManager,
  Polyline,
} from "@react-google-maps/api";

const libraries = ["drawing", "places"];

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: 52.52047739093263,
  lng: 13.36653284549709,
};

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [polygons, setPolygons] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [mousePosition, setMousePosition] = useState(null);
  const [currentPath, setCurrentPath] = useState([]);

  const polygonRefs = useRef({});
  const listenersRefs = useRef({});

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && isDrawing) {
        setIsDrawing(false);
        setCurrentPath([]);
        setMousePosition(null);
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isDrawing]);

  const onMapLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const generateId = () => `polygon_${Date.now()}`;

  const savePolygonsToStorage = (polygonsToSave) => {
    try {
      const polygonsForStorage = polygonsToSave.map((polygon) => ({
        ...polygon,
        editable: false,
      }));
      const polygonsData = JSON.stringify(polygonsForStorage);
      localStorage.setItem("savedPolygons", polygonsData);
      console.log("Polygons saved successfully");
    } catch (error) {
      console.error("Error saving polygons:", error);
    }
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (isDrawing) {
        setMousePosition({
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        });
      }
    },
    [isDrawing]
  );

  const handleMapClick = useCallback(
    (e) => {
      if (isDrawing) {
        const newPoint = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        };
        setCurrentPath((prev) => [...prev, newPoint]);
      }
    },
    [isDrawing]
  );

  const onEdit = useCallback((id) => {
    if (polygonRefs.current[id]) {
      const nextPath = polygonRefs.current[id]
        .getPath()
        .getArray()
        .map((latLng) => ({
          lat: latLng.lat(),
          lng: latLng.lng(),
        }));

      setPolygons((currentPolygons) => {
        const newPolygons = currentPolygons.map((polygon) =>
          polygon.id === id ? { ...polygon, path: nextPath } : polygon
        );
        return newPolygons;
      });
    }
  }, []);

  const onLoad = useCallback(
    (polygon, id) => {
      if (polygon) {
        polygonRefs.current[id] = polygon;
        const path = polygon.getPath();

        listenersRefs.current[id] = [
          path.addListener("set_at", () => onEdit(id)),
          path.addListener("insert_at", () => onEdit(id)),
          path.addListener("remove_at", () => onEdit(id)),
        ];
      }
    },
    [onEdit]
  );

  const onUnmount = useCallback((id) => {
    if (listenersRefs.current[id]) {
      listenersRefs.current[id].forEach((listener) => {
        if (listener) {
          listener.remove();
        }
      });
      delete polygonRefs.current[id];
      delete listenersRefs.current[id];
    }
  }, []);

  const onOverlayComplete = useCallback((e) => {
    if (e.type === "polygon") {
      const path = e.overlay
        .getPath()
        .getArray()
        .map((latLng) => ({
          lat: latLng.lat(),
          lng: latLng.lng(),
        }));

      const newPolygon = {
        id: generateId(),
        path,
        editable: false,
      };

      setPolygons((current) => {
        const updatedPolygons = [...current, newPolygon];
        savePolygonsToStorage(updatedPolygons);
        return updatedPolygons;
      });

      e.overlay.setMap(null);
      setIsDrawing(false);
      setCurrentPath([]);
      setMousePosition(null);
    }
  }, []);

  const toggleDrawing = () => {
    setIsDrawing(!isDrawing);
    if (!isDrawing) {
      setPolygons((current) =>
        current.map((polygon) => ({ ...polygon, editable: false }))
      );
      setSelectedPolygon(null);
      setCurrentPath([]);
      setMousePosition(null);
    } else {
      setCurrentPath([]);
      setMousePosition(null);
    }
  };

  const toggleEdit = (id) => {
    setPolygons((current) => {
      const newPolygons = current.map((polygon) => {
        if (polygon.id === id && polygon.editable) {
          setTimeout(() => {
            const polygonsToSave = current.map((p) => ({
              ...p,
              editable: false,
            }));
            savePolygonsToStorage(polygonsToSave);
          }, 0);
        }
        return {
          ...polygon,
          editable: polygon.id === id ? !polygon.editable : false,
        };
      });
      return newPolygons;
    });
    setSelectedPolygon(id);
  };

  const deletePolygon = (id) => {
    setPolygons((current) => {
      const updatedPolygons = current.filter((polygon) => polygon.id !== id);
      savePolygonsToStorage(updatedPolygons);
      return updatedPolygons;
    });
    onUnmount(id);
    if (selectedPolygon === id) {
      setSelectedPolygon(null);
    }
  };

  useEffect(() => {
    const savedPolygons = localStorage.getItem("savedPolygons");
    if (savedPolygons) {
      try {
        setPolygons(JSON.parse(savedPolygons));
      } catch (error) {
        console.error("Error loading saved polygons:", error);
      }
    }
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <div
        style={{
          padding: "10px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <button
          onClick={toggleDrawing}
          style={{
            marginRight: "10px",
            padding: "8px 16px",
            backgroundColor: isDrawing ? "#ff4444" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {isDrawing ? "Cancel Drawing" : "New Polygon"}
        </button>
      </div>

      <div
        style={{
          position: "absolute",
          top: "70px",
          left: "10px",
          zIndex: 1,
          backgroundColor: "#fff",
          padding: "10px",
          borderRadius: "4px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <select
          onChange={(e) => {
            const [action, id] = e.target.value.split("|");
            if (action === "edit") toggleEdit(id);
            if (action === "delete") deletePolygon(id);
            e.target.value = "";
          }}
          value=""
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            cursor: "pointer",
            minWidth: "150px",
          }}
        >
          <option value="">Select Polygon</option>
          {polygons.map((polygon, index) => (
            <optgroup key={polygon.id} label={`Polygon ${index + 1}`}>
              <option value={`edit|${polygon.id}`}>
                {polygon.editable ? "Done Editing" : "Edit"}
              </option>
              <option value={`delete|${polygon.id}`}>Delete</option>
            </optgroup>
          ))}
        </select>
      </div>

      <LoadScript googleMapsApiKey="" libraries={libraries}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          onLoad={onMapLoad}
          onMouseMove={handleMouseMove}
          onClick={handleMapClick}
        >
          {isDrawing && (
            <DrawingManager
              onOverlayComplete={onOverlayComplete}
              options={{
                drawingMode: "polygon",
                drawingControl: false,
                polygonOptions: {
                  fillColor: "#FF0000",
                  fillOpacity: 0.2,
                  strokeWeight: 2,
                  strokeColor: "#FF0000",
                  editable: true,
                },
              }}
            />
          )}

          {isDrawing && currentPath.length > 0 && mousePosition && (
            <Polyline
              path={[currentPath[currentPath.length - 1], mousePosition]}
              options={{
                strokeColor: "#FFFFFF",
                strokeWeight: 2,
                strokeOpacity: 1,
              }}
            />
          )}

          {isDrawing && currentPath.length > 1 && (
            <Polyline
              path={currentPath}
              options={{
                strokeColor: "#FF0000",
                strokeWeight: 2,
                strokeOpacity: 1,
              }}
            />
          )}

          {polygons.map((polygon) => (
            <Polygon
              key={polygon.id}
              path={polygon.path}
              editable={polygon.editable}
              draggable={polygon.editable}
              onMouseUp={() => polygon.editable && onEdit(polygon.id)}
              onDragEnd={() => onEdit(polygon.id)}
              onLoad={(p) => onLoad(p, polygon.id)}
              onUnmount={() => onUnmount(polygon.id)}
              options={{
                fillColor: polygon.editable ? "#00FF00" : "#FF0000",
                fillOpacity: 0.2,
                strokeWeight: 2,
                strokeColor: polygon.editable ? "#00FF00" : "#FF0000",
              }}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapComponent;

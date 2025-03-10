import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";

const Map = () => {
    const reports = [
        {
          id: 1,
          title: "Road Blocked",
          location: {
            lat: 40.7128,
            lng: -74.006,
            address: "123 Main St, New York, NY",
          },
          severity: "high",
        },
        {
          id: 2,
          title: "Minor Accident",
          location: {
            lat: 34.0522,
            lng: -118.2437,
            address: "456 Sunset Blvd, Los Angeles, CA",
          },
          severity: "medium",
        },
        {
          id: 3,
          title: "Pothole",
          location: {
            lat: 41.8781,
            lng: -87.6298,
            address: "789 Lakeshore Dr, Chicago, IL",
          },
          severity: "low",
        },
      ];
            
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userLoc);
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  }, []);

  // Custom marker icons
  const getMarkerIcon = (severity) => {
    return L.divIcon({
      className: `custom-marker ${severity}`,
      html: `<div class='marker-icon ${severity}'></div>`,
    });
  };

  const centerOnUser = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.setView([userLocation.lat, userLocation.lng], 15);
    }
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={userLocation || [43.7749, -131.4194]}
        zoom={4}
        style={{ height: "100vh", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          url="http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          subdomains={["mt0", "mt1", "mt2", "mt3"]}
          attribution='&copy; <a href="https://www.google.com/maps">Google Hybrid</a>'
        />

        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.location.lat, report.location.lng]}
            icon={getMarkerIcon(report.severity)}
          >
            <Popup>
              <strong>{report.title}</strong>
              <p>{report.location.address}</p>
              <span className={report.severity}>
                {report.severity} severity
              </span>
            </Popup>
          </Marker>
        ))}

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>You are here</Popup>
          </Marker>
        )}
      </MapContainer>

      <div className="absolute bottom-4 right-4">
        <Button variant="outline" size="icon" onClick={centerOnUser}>
          <Navigation className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Map;

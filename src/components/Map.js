      'use client';
      import React from 'react';
      import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
      import { darkMapStyle } from '../lib/map-styles';

      const containerStyle = {
        width: '100%',
        height: '100%',
      };

      const defaultMapOptions = {
        disableDefaultUI: true,
        clickableIcons: false,
        scrollwheel: true,
        styles: darkMapStyle
      };

      const Map = ({ markers, center, options = {} }) => {
        const { isLoaded } = useJsApiLoader({
          id: 'google-map-script',
          googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
          libraries: ['places']
       });
     
       const zoom = center.lat === 20 && center.lng === 0 ? 2 : 12;
       const combinedOptions = { ...defaultMapOptions, ...options };
     
       return isLoaded ? (
         <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={zoom} options={combinedOptions}>
           {markers && markers.map((marker) => (
             <Marker 
               key={marker.id} 
               position={{ lat: marker.lat, lng: marker.lon }}
               icon={{
                 path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
                 fillColor: "#CCFF00",
                 fillOpacity: 1,
                 strokeWeight: 2,
                 strokeColor: "#000000",
                 scale: 1.5,
               }}
             />
           ))}
         </GoogleMap>
       ) : <div className="w-full h-full bg-black animate-pulse" />;
     };
     
     export default Map;
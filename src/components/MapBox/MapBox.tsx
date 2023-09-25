import { useState, useRef, useEffect } from 'react';
import mapboxgl, { Map as MapGl } from 'mapbox-gl';
import './MapBox.scss';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;


interface MapBoxProps {
    setNewLat: React.Dispatch<React.SetStateAction<number>>;
    setNewLng: React.Dispatch<React.SetStateAction<number>>;
  }

function MapBox({setNewLng, setNewLat}: MapBoxProps) {
    const latitude = parseFloat(sessionStorage.getItem('latitude')?.toString() ?? '') || 0;
    const longitude = parseFloat(sessionStorage.getItem('longitude')?.toString() ?? '') || 0;
  
    const [lat, setLat] = useState<number>(latitude);
    const [lng, setLng] = useState<number>(longitude);
    const [zoom, setZoom] = useState<number>(10);
    const [markers, setMarkers] = useState<mapboxgl.LngLat[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<MapGl | null>(null);
    const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;
    
    try{
      mapRef.current = new MapGl({
        container: mapContainer.current,
        style: 'mapbox://styles/paopao98/clmsa1af202fa01r739c31p87',
        center: [lng, lat],
        zoom: zoom
    });
    const map: MapGl = mapRef.current;

    if (markerRef.current) {
      markerRef.current.remove();
    }

     new mapboxgl.Marker({ color: '#842d8d' }).setLngLat([lng, lat]).addTo(map);

    map.on('move', () => {
      const position = map.getCenter();
      setLat(Number(position.lat.toFixed(4)));
      setLng(Number(position.lng.toFixed(4)));
      setZoom(map.getZoom());
    });

    map.on('click', (e) => {
      setNewLat(e.lngLat.lat);
      setNewLng(e.lngLat.lng);
      setMarkers([...markers, e.lngLat]);
    });
    } catch (error){
      setErrorMessage('An error occured while initializing the map')
    }
  }, [lng, lat, zoom, setLng, setLat, setZoom, setNewLat, setNewLng]);

  useEffect(() => {
    if (mapRef.current && markers.length > 0) {
      markers.forEach((markerCoords) => (
        new mapboxgl.Marker({color: '#11adb5'})
          .setLngLat(markerCoords)
          .addTo(mapRef.current as MapGl)
      ));
    }
  }, [markers]);

  return (
    <section className='mapbox'>
      {errorMessage && <p className='error'>{errorMessage}</p>}
      <div ref={mapContainer} style={{ height: '400px' }} className='map-container'></div>
      <p className='error'>Your start position: latitude: {lat}  longitude: {lng}</p>
    </section>
  );
}

export default MapBox;
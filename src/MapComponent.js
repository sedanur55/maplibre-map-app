import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './styles.css';
import NavBar from './Navbar';
import { useForm } from 'react-hook-form';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import iconUrl from '/public/assets/icons/cluster5.png';
import { useDispatch, useSelector } from 'react-redux';

const MapComponent = ({ data }) => {
    console.log('MapComponent');

    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [popup, setPopup] = useState(null); // Pop-up nesnesini saklamak için durum
    const [selectedFeature, setSelectedFeature] = useState(null); // Seçili özelliği saklamak için durum
    const [editDialogOpen, setEditDialogOpen] = useState(false); // Düzenleme diyaloğunu açma/kapama
    const { register, handleSubmit, reset } = useForm(); // React Hook Form kullanımı

    const baseMaps = {
        'Google Maps': 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
        'Yandex Maps': 'https://core-renderer-tiles.maps.yandex.net/tiles?l=map&lang=tr_TR&x={x}&y={y}&z={z}',
        'OpenStreetMap': 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'Esri Satellite': 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        'Esri Dark': 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        'Esri Shaded Relief': 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
    };

    useEffect(() => {
        const initialLayer = 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}';
        const mapInstance = new maplibregl.Map({
            container: mapRef.current,
            style: {
                version: 8,
                sources: {
                    'raster-tiles': {
                        type: 'raster',
                        tiles: [initialLayer],
                        tileSize: 256,
                    },
                },
                layers: [
                    {
                        id: 'raster-tiles',
                        type: 'raster',
                        source: 'raster-tiles',
                        minzoom: 0,
                        maxzoom: 22,
                    },
                ],
                "glyphs": "/fonts/{fontstack}/{range}.pbf",
            },
            center: [28.9784, 41.0082], // İstanbul koordinatları
            zoom: 10,
        });

        setMap(mapInstance);
        console.log('harita');

        const img = new Image();
        img.src = iconUrl;
        img.onload = () => {
            console.log('img');
            mapInstance.on('load', () => {

                console.log('img.onload -----');

                mapInstance.setPaintProperty('raster-tiles', 'raster-brightness-min', 0.1);
                mapInstance.setPaintProperty('raster-tiles', 'raster-brightness-max', 0.9);
                fetchParkingData(mapInstance, img);
                console.log('mapInstance', mapInstance);
                mapInstance.on('click', 'clusters', (e) => {
                    const features = mapInstance.queryRenderedFeatures(e.point, { layers: ['clusters'] });
                    if (features.length > 0) {
                        const zoomLevel = mapInstance.getZoom();
                        mapInstance.easeTo({
                            center: features[0].geometry.coordinates,
                            zoom: zoomLevel + 1 // Mevcut zoom seviyesini artırarak küme altını açma
                        });
                    }
                });
                mapInstance.on('click', 'unclustered-point', (e) => {
                    const features = mapInstance.queryRenderedFeatures(e.point, { layers: ['unclustered-point'] });
                    if (features.length > 0) {
                        const selectedPoint = features[0];
                        const { name, type, district } = selectedPoint.properties;
                        const coordinates = selectedPoint.geometry.coordinates;

                        const newPopup = new maplibregl.Popup()
                            .setLngLat(coordinates)
                            .setHTML(`
                            <strong>Name:</strong> ${name}<br/>
                            <strong>İlçe:</strong> ${district}<br/>
                            <strong>Tür:</strong> ${type}<br/>
                            <strong>Koordinatlar:</strong> [${coordinates[0]}, ${coordinates[1]}]
                            <br/>
                            <button id="edit-button" >Edit</button>
                        `)
                            .addTo(mapInstance);

                        if (popup) {
                            popup.remove();
                        }

                        setPopup(newPopup);
                        setSelectedFeature(selectedPoint);
                        newPopup.getElement().querySelector('#edit-button').addEventListener('click', () => {
                            setEditDialogOpen(true);
                            reset({ name, type, district });
                        });
                    }
                });

                mapInstance.on('mouseleave', 'clusters', () => {
                    if (popup) {
                        popup.remove();
                        setPopup(null);
                    }
                });


            });
        }

        const handleResize = () => {
            mapInstance.resize();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            mapInstance.remove();
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    async function fetchParkingData(mapInstance, img) {
        console.log('data1-----', data);

        if (!mapInstance) {
            return;
        }

        try {
            // const response = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://data.ibb.gov.tr/api/3/action/datastore_search?resource_id=d588f256-2982-43d2-b372-c38978d7200b&limit=1281'));
            // const data = await response.json();
            // const jsonData = JSON.parse(data.contents);
            console.log('data-----', data);


            const geoJsonData = {
                type: 'FeatureCollection',
                features: data.map((entry) => {
                    const coordinates = entry['KOORDINAT\n(Yatay , Dikey)'].split(',').map(coord => parseFloat(coord.trim()));
                    return {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [coordinates[1], coordinates[0]],
                        },
                        properties: {
                            name: entry['MAHAL ADI'],
                            district: entry['ILCE'],
                            type: entry['TUR'],
                        },
                    };
                }),
            };

            if (mapInstance) {
                const sourceExists = mapInstance.getSource('parking-locations');
                if (sourceExists) {
                    sourceExists.setData(geoJsonData);
                } else {
                    mapInstance.addImage('map-icon', img);

                    mapInstance.addSource('parking-locations', {
                        type: 'geojson',
                        data: geoJsonData,
                        cluster: true,
                        clusterMaxZoom: 14,
                        clusterRadius: 50
                    });

                    mapInstance.addLayer({
                        id: 'clusters',
                        type: 'symbol',
                        source: 'parking-locations',
                        filter: ['has', 'point_count'],
                        layout: {
                            'icon-image': 'map-icon', // Yüklenen icon ismi
                            'icon-size': 0.4,
                            'icon-allow-overlap': true,
                        },

                    });

                    mapInstance.addLayer({
                        id: 'cluster-count',
                        type: 'symbol',
                        source: 'parking-locations',
                        filter: ['has', 'point_count'],
                        layout: {
                            'text-field': '{point_count_abbreviated}',
                            'text-font': ['Manrope ExtraLight'],
                            'text-size': 12,
                            'text-offset': [0, -0.3],
                            'text-anchor': 'center'
                        },
                        paint: {
                            'text-color': 'black',
                        }
                    });

                    mapInstance.addLayer({
                        id: 'unclustered-point',
                        type: 'symbol',
                        source: 'parking-locations',
                        filter: ['!', ['has', 'point_count']],
                        layout: {
                            'icon-image': 'map-icon', // Yüklenen icon ismi
                            'icon-size': 0.4,
                            'icon-allow-overlap': true,
                        },
                        // paint: {
                        //     'circle-color': '#f96e29',
                        //     'circle-radius': 9.5,
                        //     'circle-stroke-width': 1,
                        //     'circle-stroke-color': '#f96e29'
                        // }
                    });
                };

                let animationFrame;

                mapInstance.on('zoom', () => {
                    let startRadius = 10;
                    let startTextSize = 12;
                    const endRadius = 20;
                    const endTextSize = 16;
                    const duration = 500;
                    const startTime = performance.now();

                    function animateCircleAndText() {
                        const elapsed = performance.now() - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        const currentRadius = startRadius + (endRadius - startRadius) * progress;
                        const currentTextSize = startTextSize + (endTextSize - startTextSize) * progress;

                        // mapInstance.setPaintProperty('clusters', 'circle-radius', currentRadius);
                        // mapInstance.setLayoutProperty('cluster-count', 'text-size', currentTextSize);

                        if (progress < 1) {
                            animationFrame = requestAnimationFrame(animateCircleAndText);
                        }
                    }

                    cancelAnimationFrame(animationFrame);
                    animateCircleAndText();
                });



                mapInstance.on('mouseleave', 'clusters', () => {
                    if (popup) {
                        popup.remove();
                        setPopup(null);
                    }
                });
                // }
            }
        } catch (error) {
            console.error('Error fetching parking data:', error);
        }
    }

    const handleLayerChange = (layerUrl) => {
        if (map) {
            const source = map.getSource('raster-tiles');
            if (source) {
                source.tiles = [layerUrl];
                map.style.sourceCaches['raster-tiles'].clearTiles();
                map.style.sourceCaches['raster-tiles'].update(map.transform);
            }
        }
    };

    const onSubmit = async (data) => {
        if (!selectedFeature) return;

        const updatedProperties = {
            ...selectedFeature.properties,
            ...data
        };

        try {
            const response = await fetch('https://data.ibb.gov.tr/api/3/action/datastore_upsert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resource_id: '1',
                    records: [
                        {
                            ...updatedProperties
                        }
                    ]
                }),
            });
            const result = await response.json();
            if (result.success) {
                alert('Data updated successfully');

                // Haritada güncellenmiş veriyi işaretleyici ile ekleyin
                const coordinates = selectedFeature.geometry.coordinates;
                new maplibregl.Marker({ color: 'red' })
                    .setLngLat(coordinates)
                    .addTo(map);

                // Pop-up'ı güncelleyin
                if (popup) {
                    popup.remove();
                    setPopup(null);
                }

                // Veriyi güncelleyin
                fetchParkingData(map);

                setEditDialogOpen(false);
            } else {
                alert('Failed to update data');
            }
        } catch (error) {
            console.error('Update error:', error);
        }
    };

    return (
        <div>
            <div ref={mapRef} className="map-container"></div>
            <div className="button-container">
                {Object.keys(baseMaps).map((key) => (
                    <button key={key} onClick={() => handleLayerChange(baseMaps[key])}>
                        {key}
                    </button>
                ))}
            </div>
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Edit Information</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            label="Name"
                            fullWidth
                            margin="normal"
                            {...register('name', { required: true })}
                        />
                        <TextField
                            label="District"
                            fullWidth
                            margin="normal"
                            {...register('district', { required: true })}
                        />
                        <TextField
                            label="Type"
                            fullWidth
                            margin="normal"
                            {...register('type', { required: true })}
                        />
                        <DialogActions>
                            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" variant="contained" color="primary">Save</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MapComponent;

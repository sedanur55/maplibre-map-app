import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { updateFeature, setActivePopup, setMapState, setSnackbar } from '../dataSlice';
import mapIconUrl from '/public/assets/icons/cluster5.png';
import LayerControl from './LayerControl';
import PopupComponent from './PopupComponent';
import SnackbarComponent from './SnackbarComponent';
import Panel from './Panel';
import Navbar from './Navbar';
import { setupMapInteractions, generateGeoJsonData, baseMaps, setupMapLayers, } from '../utils/common';

const MapComponent = () => {
    const mapRef = useRef(null);
    const dispatch = useDispatch();
    const { activePopup, mapState, data } = useSelector((state) => state.data);
    const [map, setMap] = useState(null);
    const [filteredData, setFilteredData] = useState(data);


    const togglePanel = () => {
        dispatch(setMapState({
            isPanelOpen: !mapState.isPanelOpen,
        }))
    };
    useEffect(() => {
        const mapInstance = new maplibregl.Map({
            container: mapRef.current,
            style: {
                version: 8,
                sources: {
                    'raster-tiles': {
                        type: 'raster',
                        tiles: [baseMaps[mapState.selectedBaseMap]],
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
            center: [28.9784, 41.0082],
            zoom: 10,
        });
        setMap(mapInstance);
        const img = new Image();
        img.src = mapIconUrl;
        img.onload = () => {
            mapInstance.on('load', () => {
                setupMapLayers(mapInstance, img, generateGeoJsonData(filteredData));
                setupMapInteractions(mapInstance, filteredData, dispatch);

            });
        }
        const handleResize = () => {
            mapInstance.resize();
        };
        console.log('render')

        window.addEventListener('resize', handleResize);

        return () => {
            mapInstance.remove();
            window.removeEventListener('resize', handleResize);
        };
    }, [mapState.selectedBaseMap, filteredData]);

    useEffect(() => {
        if (map) {
            setupMapInteractions(map, data, dispatch);
        }
    }, [data, filteredData, map]);

    const handleUpdateFeature = async (feature, updatedData) => {
        const updatedProperties = {
            ...feature.data,
            ...updatedData
        };
        try {
            dispatch(updateFeature({
                id: feature.data.id,
                updatedProperties
            }));
            dispatch(setActivePopup({
                isActive: false,
                data: {}
            }));
            dispatch(setSnackbar({
                isOpen: true,
                message: 'Data updated successfully',
                severity: 'success'
            }));
        } catch (error) {
            console.error('Update error:', error);
            dispatch(setSnackbar({
                message: error.message,
                severity: 'error'
            }))
        } finally {
            dispatch(setSnackbar({
                isOpen: true,
            }))

        }
    };
    const handlePopupClose = () => {
        dispatch(setActivePopup({
            isActive: false,
            data: {}
        }))
    };
    const handleNewMap = (newMap) => {
        dispatch(setMapState({
            selectedBaseMap: newMap,
        }))
    };

    return (
        <div id="mapContent" style={{ width: '100%', height: '100%' }}>
            <div style={{ position: 'relative', zIndex: 2000 }}>
                <LayerControl
                    baseMaps={baseMaps}
                    map={map}
                    selectedBaseMap={mapState.selectedBaseMap}
                    onBaseMapChange={(newMap) => handleNewMap(newMap)}
                />
            </div>
            <Navbar map={map} onTogglePanel={togglePanel} />
            {mapState.isPanelOpen && (
                <div
                    style={{
                        position: 'absolute',
                        left: '10px',
                        top: '10px',
                        bottom: '10px',
                        height: 'auto',
                        width: '240px',
                        backgroundColor: 'rgb(74 74 74 / 96%)',
                        zIndex: 2000,
                        boxShadow: '10px 25px 40px -15px rgba(0, 0, 0, 0.8)',

                        borderRadius: '12px',
                        color: 'white'
                    }}
                >
                    <Panel filteredData={filteredData} setFilteredData={setFilteredData} map={map} />
                </div>
            )}
            <SnackbarComponent />
            {
                activePopup.isActive &&
                <PopupComponent
                    onSave={handleUpdateFeature}
                    onClose={handlePopupClose}
                    mapInstance={map}
                />
            }
            <div className='map-container' id='map' ref={mapRef}></div>
        </div>
    );
};

export default MapComponent;

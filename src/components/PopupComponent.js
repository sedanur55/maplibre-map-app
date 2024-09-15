import React, { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import ReactDOM from 'react-dom/client';
import { useSelector } from 'react-redux';
import PopupContent from './PopupContent'

const PopupComponent = ({ onSave, onClose, mapInstance }) => {
    const popupRef = useRef(null);
    const pointData = useSelector((state) => state.data.activePopup);

    useEffect(() => {
        if (pointData.isActive) {
            const popupContent = document.createElement('div');
            popupRef.current = popupContent;

            const newPopup = new maplibregl.Popup()
                .setLngLat({
                    lat: pointData.data?.coordinates[0] ?? 0,
                    lon: pointData.data?.coordinates[1] ?? 0,
                })
                .setDOMContent(popupContent)
                .addTo(mapInstance)
                .on('close', () => {
                    onClose();
                });

            const root = ReactDOM.createRoot(popupContent);
            root.render(
                <PopupContent
                    defaultValues={{ name: pointData?.data?.name, district: pointData?.data?.district, type: pointData?.data?.type }}
                    onSaveed={(data) => {
                        onSave(pointData, data);
                    }}
                />
            );

            return () => {
                newPopup.remove();
            };
        }
    }, [pointData.isActive, mapInstance, onClose, onSave]);

    return null;
};

export default PopupComponent;
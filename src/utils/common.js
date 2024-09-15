import debounce from 'lodash.debounce';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { updateFeature, setActivePopup } from '../dataSlice';



export const turkishToEnglish = (str) => {
    console.log('-------------', str)
    return str
        .replace(/ğ/g, 'g')
        // .replace(/Ğ/g, 'G')
        .replace(/ü/g, 'u')
        // .replace(/Ü/g, 'U')
        .replace(/ş/g, 's')
        // .replace(/Ş/g, 'S')
        .replace(/ı/g, 'i')
        // .replace(/İ/g, 'I')
        .replace(/ç/g, 'c')
        // .replace(/Ç/g, 'C')
        .replace(/ö/g, 'o')
    // .replace(/Ö/g, 'O');
};

export const transformFields = (filterParameter) => {
    switch (filterParameter) {
        case 'Name':
            return 'name';
        case 'District':
            return 'district';
        case 'Type':
            return 'type';
        case 'Filter':
            return ['name', 'district', 'type'];
        default:
            return null;
    }
};

export const baseMaps = {
    'Google': 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    'Yandex': 'https://core-renderer-tiles.maps.yandex.net/tiles?l=map&lang=tr_TR&x={x}&y={y}&z={z}',
    'OSM': 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
    'Satellite': 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    // 'Dark': 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    // 'Esri Shaded Relief': 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
};


export const generateGeoJsonData = (data) => {
    return {
        type: 'FeatureCollection',
        features: data.map((entry) => {
            const coordinates = entry.coordinates;
            return {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [coordinates[1], coordinates[0]],
                },
                properties: {
                    id: entry.id,
                    name: entry.name,
                    district: entry.district,
                    type: entry.type,
                },
            };
        }),
    };
};

export const initializeMap = (mapRef, selectedBaseMap) => {
    return new maplibregl.Map({
        container: mapRef.current,
        style: {
            version: 8,
            sources: {
                'raster-tiles': {
                    type: 'raster',
                    tiles: [baseMaps[selectedBaseMap]],
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
            glyphs: "/fonts/{fontstack}/{range}.pbf",
        },
        center: [28.9784, 41.0082],
        zoom: 10,
    });
};

export const setupMapLayers = (mapInstance, img, data) => {
    mapInstance.addImage('map-icon', img);
    mapInstance.addSource('parking-locations', {
        type: 'geojson',
        data: data,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
    });

    mapInstance.addLayer({
        id: 'clusters',
        type: 'symbol',
        source: 'parking-locations',
        filter: ['has', 'point_count'],
        layout: {
            'icon-image': 'map-icon',
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
            'text-size': 9,
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
            'icon-image': 'map-icon',
            'icon-size': 0.3,
            'icon-allow-overlap': true,
        },
    });
};


export const handleFilter = (filter, filterParameter, data, setFilteredData) => {
    const filterFields = transformFields(filterParameter);
    if (!filterFields) {
        setFilteredData(data);
        return;
    }

    const filterValue = turkishToEnglish(filter.toLowerCase());
    console.log(filterValue);
    const filtered = data.filter(item => {
        if (Array.isArray(filterFields)) {
            return filterFields.some(field => {
                console.log(item[field].toLowerCase())
                const itemField = item[field] ? item[field].toLowerCase() : '';
                return itemField.includes(filterValue);
            });
        } else {
            const itemField = item[filterFields] ? item[filterFields].toLowerCase() : '';
            return itemField.includes(filterValue);
        }
    });
    setFilteredData(filtered);
};

export const setupMapInteractions = (mapInstance, data, dispatch) => {
    mapInstance.on('click', 'clusters', (e) => {
        const features = mapInstance.queryRenderedFeatures(e.point, { layers: ['clusters'] });
        if (features.length > 0) {
            const zoomLevel = mapInstance.getZoom();
            mapInstance.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoomLevel + 1
            });
        }
    });
    mapInstance.on('click', 'unclustered-point', (e) => {
        const features = mapInstance.queryRenderedFeatures(e.point, { layers: ['unclustered-point'] });
        if (features.length > 0) {
            const selectedPoint = features[0];
            const id = selectedPoint.properties.id;
            const reduxFeatureData = data.find(feature => feature.id == id);
            dispatch(setActivePopup({
                isActive: true,
                data: reduxFeatureData
            }))
        }
    });
};

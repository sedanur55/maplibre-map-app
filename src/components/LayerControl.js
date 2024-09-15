import React, { useState } from 'react';
import LayersIcon from '@mui/icons-material/Layers';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const LayerControl = ({ baseMaps, map, selectedBaseMap, onBaseMapChange }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleBaseMapChange = (mapName) => {
        if (map) {
            const source = map.getSource('raster-tiles');
            if (source) {
                source.tiles = [baseMaps[mapName]];
                map.style.sourceCaches['raster-tiles'].clearTiles();
                map.style.sourceCaches['raster-tiles'].update(map.transform);
            }
        }
        onBaseMapChange(mapName);
        handleMenuClose();
    };

    return (
        <div style={{ borderRadius: '20px', zIndex: 2000 }}>
            <IconButton
                aria-controls={open ? 'layer-menu' : undefined}
                aria-haspopup="true"
                onClick={handleMenuClick}
                style={{ position: 'absolute', top: 10, right: 10, opacity: 1 }}
            >
                <LayersIcon />
            </IconButton>
            <Menu
                id="layer-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                sx={{
                    zIndex: 2000,
                    '& .MuiMenu-paper': {
                        borderRadius: '12px',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                        maxHeight: '200px',
                        width: '100px',
                        zIndex: 2000,

                    },
                    '& .MuiPaper-elevation': {

                        backgroundColor: '#576451',
                        color: 'white'

                    },
                    '& .Mui-selected': {

                        backgroundColor: '#576451',
                        color: 'white'

                    },
                }}


            >
                {Object.keys(baseMaps).map((mapName) => (
                    <MenuItem
                        key={mapName}
                        onClick={() => handleBaseMapChange(mapName)}
                        selected={selectedBaseMap === mapName}
                        sx={{
                            zIndex: 2000,
                            fontSize: '10px',
                            fontWeight: selectedBaseMap === mapName ? 'bold' : 'normal',
                            color: 'white',
                            backgroundColor: selectedBaseMap === mapName ? '#434d3e' : 'inherit',

                            '&:hover': {
                                backgroundColor: '#434d3e',
                            },

                        }}
                    >
                        {mapName}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
};

export default LayerControl;

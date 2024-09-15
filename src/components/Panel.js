import React, { useState, useRef, useEffect, useCallback } from 'react';
import { List, ListItem, ListItemText, TextField, Button, Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import PageviewIcon from '@mui/icons-material/Pageview';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Filter from '@mui/icons-material/Filter';
import Avatar from '@mui/material/Avatar';
import { orange } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import { handleFilter } from '../utils/common';
import debounce from 'lodash.debounce';
import { closePopup, openPopup } from '../dataSlice';
import { useDispatch, useSelector } from 'react-redux';


const Panel = ({ filteredData, setFilteredData, map, }) => {
    const dispatch = useDispatch();
    const { data, maxHeight } = useSelector((state) => state.data);
    const panelRef = useRef(null);
    const [filter, setFilter] = useState('');
    const [filterParameter, setFilterParameter] = useState('Filter');
    const [anchorEl, setAnchorEl] = useState(null);
    const [panelHeight, setPanelHeight] = useState('auto');
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelectItem = (item) => {
        const reduxFeatureData = data.find(feature => feature.id === item['id']);
        const [latitude, longitude] = reduxFeatureData.coordinates;
        if (map) {
            dispatch(closePopup(reduxFeatureData));
            map.flyTo({
                center: [longitude, latitude],
                zoom: map.getZoom() + 1,
                essential: true
            });
            map.once('moveend', () => {
                dispatch(openPopup(reduxFeatureData));
            });
        }
    };
    const handleFilterParameter = (event) => {
        const value = event.target.getAttribute('name');
        setFilterParameter(value);
    };

    const handleFilterChange = useCallback(
        debounce((value) => {
            handleFilter(value, filterParameter, data, setFilteredData);
        }, 500),
        [filterParameter, filteredData]
    );

    const onFilterChange = (event) => {
        const value = event.target.value;
        setFilter(value);
        handleFilterChange(value);
    };


    return (

        <Box ref={panelRef}
            p={2}
            sx={{
                position: 'relative',
                padding: '8px',


            }}>
            <Box sx={{ display: 'flex', }}>
                <TextField
                    label={filterParameter}
                    variant="standard"
                    value={filter}
                    autoComplete="off"
                    onChange={onFilterChange}
                    sx={{
                        mb: 2, height: '10px', top: '1px', color: 'white', fontSize: '10px', padding: '2px', marginLeft: '5px',
                        '& .MuiInput-root::after': {
                            borderBottomColor: 'white',
                        },
                        '& .MuiInput-root::before': {
                            borderBottomColor: 'white',
                        },
                        '& .css-r5in8e-MuiInputBase-root-MuiInput-root': {
                            color: 'white',
                        },
                        '& .css-19fz36k-MuiFormLabel-root-MuiInputLabel-root': {
                            color: '#ffffff80',
                        },
                        '& .css-nmluci-MuiFormLabel-root-MuiInputLabel-root.Mui-focused': {
                            color: '#ffffff80',
                        },
                    }}
                />
                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2, mt: 1 }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Avatar sx={{ bgcolor: orange[500] }}>
                        <PageviewIcon />
                    </Avatar>
                </IconButton>
            </Box>



            <List sx={{
                maxHeight: maxHeight, top: '10px', overflowY: 'auto', overflowX: 'hidden', '&::-webkit-scrollbar': {
                    width: '3px',
                    height: '3px',
                },
                '&::-webkit-scrollbar-track': {
                    background: '#888',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: '#f1f1f1',
                    borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    background: '#555',
                },


            }}>
                {filteredData.map((item) => (
                    <ListItem button key={item.id} onClick={() => handleSelectItem(item)} sx={{
                        padding: '3px',
                        margin: '3px',
                        width: '220px',
                        borderRadius: '12px',
                        '&:hover': {
                            backgroundColor: '#313131f5',
                            borderRadius: '12px'
                        },
                    }}>
                        <ListItemText primary={item.name} secondary={`${item.district || ''}/${item.type || ''}`} sx={{
                            padding: '3px',
                            margin: '3px',
                            '& .MuiListItemText-primary': {
                                fontSize: '0.6rem',
                            },
                            '& .MuiListItemText-secondary': {
                                fontSize: '0.5rem',
                                color: '#c1bebe',
                            },
                        }} />
                    </ListItem>
                ))}
            </List>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                sx={{ zIndex: 2000, fontSize: '0.8rem', paddingRight: '2px', marginRight: 0 }}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 5,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >

                <MenuItem onClick={handleFilterParameter} sx={{ fontSize: '0.8rem', }} name="Name" selected={filterParameter === "Name"}>
                    <ListItemIcon sx={{ padding: 0, margin: 0 }}>
                        <FilterAltIcon fontSize="small" />
                    </ListItemIcon>
                    Name
                </MenuItem>
                <MenuItem onClick={handleFilterParameter} sx={{ fontSize: '0.8rem' }} name="District" selected={filterParameter === "District"}>
                    <ListItemIcon sx={{ padding: 0 }}>
                        <FilterAltIcon fontSize="small" />
                    </ListItemIcon>
                    District
                </MenuItem>
                <MenuItem onClick={handleFilterParameter} sx={{ fontSize: '0.8rem' }} name="Type" selected={filterParameter === "Type"}>
                    <ListItemIcon sx={{ padding: 0 }}>
                        <FilterAltIcon fontSize="small" />
                    </ListItemIcon>
                    Type
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleFilterParameter} sx={{ fontSize: '0.8rem' }} name="Filter" selected={filterParameter === "Filter"}>
                    <ListItemIcon sx={{ padding: 0 }} >
                        <Filter fontSize="small" />
                    </ListItemIcon>
                    All
                </MenuItem>
            </Menu>

        </Box >

    );
};
export default Panel;

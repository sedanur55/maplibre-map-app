import React, { useState, useEffect, useRef } from 'react';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import Tooltip from '@mui/material/Tooltip';
import styles from './styles.css';


const NavBar = ({ map, }) => {
  const handleZoomIn = () => {
    if (map) {
      map.setZoom(map.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      map.setZoom(map.getZoom() - 1);
    }
  };


  const handleToggleFullscreen = () => {

  };

  return (
    <div className='card text-bg-secondary mainNavBar' id="mainNavBar" style={{ display: 'flex', alignItems: 'center' }}>
      <div className='navItems'>

        <div className='navItems'>
          <Tooltip title="Full Screen" enterDelay={0} leaveDelay={100}
            placement="top"
            PopperProps={{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, -5],
                  },
                },
              ],
            }}>

            <FullscreenIcon
              viewBox='2 2 20 21'
              // titleAccess='Full Screen'
              onClick={handleToggleFullscreen}
              sx={{
                'color': 'white',
                fontSize: {
                  xs: '20px',  // small screen
                  sm: '25px',  // medium screen
                  md: '28px',  // large screen
                  lg: '34px',  // extra large screen
                },
                '&:hover': {
                  color: '#eab30d', // hover durumunda renk değişimi
                  transform: 'scale(1.1)', // hafif büyütme efekti
                  transition: 'transform 0.3s ease-in-out', // animasyon efekti
                },
              }}
              className="MuiSvgIcon-root"
            />
          </Tooltip>
        </div>
        <div className={styles.navItem}>
          <Tooltip title="Zoom In" enterDelay={0} leaveDelay={100}
            placement="top"
            PopperProps={{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, -5],
                  },
                },
              ],
            }}>
            <ZoomInIcon
              viewBox='2 2 20 21'
              // titleAccess='Zoom In'
              onClick={handleZoomIn}
              sx={{
                'color': 'white',
                fontSize: {
                  xs: '20px',  // small screen
                  sm: '25px',  // medium screen
                  md: '28px',  // large screen
                  lg: '34px',  // extra large screen
                },
                '&:hover': {
                  color: '#eab30d', // hover durumunda renk değişimi
                  transform: 'scale(1.1)', // hafif büyütme efekti
                  transition: 'transform 0.3s ease-in-out', // animasyon efekti
                },
              }}
              className="MuiSvgIcon-root"
            />
          </Tooltip>
        </div>
        <div className={styles.navItem}>
          <Tooltip title="Zoom Out" enterDelay={0} leaveDelay={100}
            placement="top"
            PopperProps={{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, -5],
                  },
                },
              ],
            }}>
            <ZoomOutIcon
              viewBox='2 2 20 21'
              // titleAccess='Zoom Out'
              onClick={handleZoomOut}
              sx={{
                'color': 'white',
                fontSize: {
                  xs: '20px',  // small screen
                  sm: '25px',  // medium screen
                  md: '28px',  // large screen
                  lg: '34px',  // extra large screen
                },
                '&:hover': {
                  color: '#eab30d', // hover durumunda renk değişimi
                  transform: 'scale(1.1)', // hafif büyütme efekti
                  transition: 'transform 0.3s ease-in-out', // animasyon efekti
                },
              }}
              className="MuiSvgIcon-root"
            />
          </Tooltip>
        </div>

      </div>
    </div>

  );
};

export default NavBar;

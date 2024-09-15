import React from 'react';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import Tooltip from '@mui/material/Tooltip';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { orange } from '@mui/material/colors';
import { setMaxHeight } from '../dataSlice';
import { useDispatch } from 'react-redux';

const NavBar = ({ map, onTogglePanel }) => {
  const dispatch = useDispatch();
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
    const mapElement = document.getElementById('mapContent');
    if (document.fullscreenElement) {
      document.exitFullscreen();
      dispatch(setMaxHeight('480px'));
    } else {
      if (mapElement.requestFullscreen) {
        mapElement.requestFullscreen();
      } else if (mapElement.mozRequestFullScreen) {
        mapElement.mozRequestFullScreen();
      } else if (mapElement.webkitRequestFullscreen) {
        mapElement.webkitRequestFullscreen();
      } else if (mapElement.msRequestFullscreen) {
        mapElement.msRequestFullscreen();
      }
      dispatch(setMaxHeight('580px'));
    }
  };

  return (
    <div className="card text-bg-secondary mainNavBar" id="mainNavBar" style={{ display: 'flex', alignItems: 'center' }}>
      <div className="navItems">

        <div className="navItems">
          <Tooltip title="Filter" enterDelay={0} leaveDelay={100}
            placement="top"
            PopperProps={{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                  },
                },
              ],
            }}>

            <MenuOpenIcon
              viewBox='2 2 20 21'
              onClick={() => onTogglePanel()}
              sx={{
                'color': 'white',
                fontSize: "22px",
                '&:hover': {
                  color: orange[500],
                  transform: 'scale(1.1)',
                  transition: 'transform 0.3s ease-in-out',
                },
              }}
              className="MuiSvgIcon-root"
            />
          </Tooltip>
        </div>
        <div className="navItems">
          <Tooltip title="Full Screen" enterDelay={0} leaveDelay={100}
            placement="top"
            PopperProps={{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                  },
                },
              ],
            }}>

            <FullscreenIcon
              viewBox='2 2 20 21'
              onClick={handleToggleFullscreen}
              sx={{
                'color': 'white',
                fontSize: "22px",
                '&:hover': {
                  color: orange[500],
                  transform: 'scale(1.1)',
                  transition: 'transform 0.3s ease-in-out',
                },
              }}
              className="MuiSvgIcon-root"
            />
          </Tooltip>
        </div>
        <div className="navItems">
          <Tooltip title="Zoom In" enterDelay={0} leaveDelay={100}
            placement="top"
            PopperProps={{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                  },
                },
              ],
            }}>
            <ZoomInIcon
              viewBox='2 2 20 21'
              onClick={handleZoomIn}
              sx={{
                'color': 'white',
                fontSize: "22px",
                '&:hover': {
                  color: orange[500],
                  transform: 'scale(1.1)',
                  transition: 'transform 0.3s ease-in-out',
                },
              }}
              className="MuiSvgIcon-root"
            />
          </Tooltip>
        </div>
        <div className="navItems">
          <Tooltip title="Zoom Out" enterDelay={0} leaveDelay={100}
            placement="top"
            PopperProps={{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                  },
                },
              ],
            }}>
            <ZoomOutIcon
              viewBox='2 2 20 21'
              onClick={handleZoomOut}
              sx={{
                'color': 'white',
                fontSize: "22px",
                '&:hover': {
                  color: orange[500],
                  transform: 'scale(1.1)',
                  transition: 'transform 0.3s ease-in-out',
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

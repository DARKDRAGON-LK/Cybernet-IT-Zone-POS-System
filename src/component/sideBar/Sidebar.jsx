import React, { useState, useEffect, useContext } from 'react';
import './Sidebar.css';
import { sidebarData } from '../../Data/Data';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../AuthProvider/AuthProvider';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import { styled } from '@mui/material/styles';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const MemoizedAvatar = React.memo(({ user }) => (
  <div className='profilePic'>
    <StyledBadge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant="dot"
    >
      <Avatar alt={user} src="usericon.png" />
    </StyledBadge>
  </div>
));

function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const SidebarData = sidebarData(user)
  const location = useLocation();
  const [selected, setSelected] = useState(
    parseInt(localStorage.getItem('selectedItem')) || 0
  );

  const handleItemClick = (index) => {
    setSelected(index);
    localStorage.setItem('selectedItem', index);
  };

  useEffect(() => {
    const selectedItem = SidebarData.findIndex(item => item.path === location.pathname);
    if (selectedItem !== -1) {
      setSelected(selectedItem);
    }
  }, [location.pathname]);

  return (
    <div className='Sidebar'>
      <div className='Profile'>
        <MemoizedAvatar user={user} />
        <div className='profileInfo'>
          <div className='nameRow'>
            <span className='profileName'>{user}</span>
          </div>
          <div className='permissionRow'>
            <span className='profilePermission'>{user === "Admin" ? "Administrator" : "Local User"}</span>
          </div>
        </div>
      </div>
      <div className='Actions'>
        {SidebarData.map((item, index) => (
          <div className='itemlist' key={index}>
            <div className='menuItem'>
              <Link
                to={item.path}
                className={selected === index ? "menuItem active" : "menuItem"}
                onClick={() => handleItemClick(index)}
              >
                <item.icon />
                <span className='Iheading'>{item.heading}</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;

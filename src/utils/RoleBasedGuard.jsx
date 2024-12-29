import StaffNotAllowed from '../pages/StaffNotAllowed';
import { Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Fixed import

import PropTypes from 'prop-types';

const RoleBasedGuard = ({ allowedRoles }) => {
  const hasAccess = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      return false;
    }

    try {
      const user = jwtDecode(token);
      console.log(user);

      return allowedRoles.includes(user.role); // Check if user.role is in allowedRoles
    } catch (error) {
      console.error('Token decoding error:', error);
      return false;
    }
  };

  return hasAccess() ? <Outlet /> : <StaffNotAllowed />;
};

export default RoleBasedGuard;

RoleBasedGuard.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

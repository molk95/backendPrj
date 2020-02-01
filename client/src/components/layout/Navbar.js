import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";
const Navbar = ({ auth: { isAuthenticated, loading }, logout
  // , user
 }) => {
  const authUserLinks = (
    <ul>
      <li>
        <a onClick={logout} href="#!">
          <i className="fas fa-sign-out-alt" />{" "}
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </ul>
  );
  // const adminLinks = (
  //   <ul>
  //     <li>
  //       <Link to="/profiles">Photographers/Freelancers</Link>
  //     </li>
  //     <li>
  //       <a onClick={logout} href="#!">
  //         <i className="fas fa-sign-out-alt" />{" "}
  //         <span className="hide-sm">Logout</span>
  //       </a>
  //     </li>
  //   </ul>
  // );
  const guestLinks = (
    <ul>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </ul>
  );
  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-camera-retro"></i> FreeTaswira
        </Link>
      </h1>
      {!loading && (
        <Fragment>
          {/* {isAuthenticated && user.role === "admin"
            ? adminLinks
            : isAuthenticated && user.role === "user"
            ? authUserLinks
            : guestLinks} */}
            {isAuthenticated?authUserLinks:guestLinks}
        </Fragment>
      )}
    </nav>
  );
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logout })(Navbar);

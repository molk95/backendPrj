import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";
const Navbar = (
  {
    auth: { isAuthenticated, loading, user },
    logout
    // , user
  },
  firstname
) => {
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
  const authLinks = (
    <ul>
      <li>
        <Link to="/profiles">Photographers|Freelancers</Link>
      </li>
      <li></li>
      <li>
        <Link to="/photos">
          <i class="fas fa-image"></i> <span className="hide-sm"> Photos</span>
        </Link>
      </li>
      <li>
        <Link to="/dashboard">
          <i className="fas fa-user" />{" "}
          <span className="hide-sm">{user && user.firstname}</span>
        </Link>
      </li>
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
  //       <Link to="/profiles">Photographers|Freelancers</Link>
  //     </li>
  //     <li>
  //       <a onClick={logout} href="#!">
  //         <i className="fas fa-sign-out-alt" />{" "}
  //         <span className="hide-sm">Logout</span>
  //       </a>
  //     </li>
  //   </ul>
  // );

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-camera-retro" /> FreeTaswira
        </Link>
      </h1>
      <input />
      {/* {!loading && ( */}
      {isAuthenticated ? authLinks : guestLinks}
      {/* )} */}
    </nav>
  );
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logout })(Navbar);

// {isAuthenticated && user.role === "admin"
// ? adminLinks
// : isAuthenticated && user.role === "user"
// ? authUserLinks
// : guestLinks}

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import NavLink from '../modules/NavLink';

const App = ({ children }) =>
  <main role="main">
    <header>
      <Link to="/">Arthur</Link>
      <nav>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/articles">About</NavLink>
        <NavLink to="/talks">About</NavLink>
      </nav>
    </header>

    <div className="container">
      { children }
    </div>

    <footer>
      footer...
    </footer>
  </main>;

App.propTypes = {
  children: PropTypes.object
};

export default App;

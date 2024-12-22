import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BreadCrumb = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);
  
    return (
      <nav>
        <ul className="breadcrumb">
          {pathnames.length > 0 ? (
            <li>
              <Link to="/">Home</Link>
            </li>
          ) : (
            <li>Home</li>
          )}
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            return isLast ? (
              <li key={to}>{value}</li>
            ) : (
              <li key={to}>
                <Link to={to}>{value}</Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  };
export default BreadCrumb

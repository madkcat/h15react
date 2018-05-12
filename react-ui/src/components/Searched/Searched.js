import React from "react";
import "./Searched.css";

export const Searched = ({children}) => (
  <div className="list-overflow-container">
      <ul className="searched-items list-group">
        {children}
      </ul>
    </div>
);

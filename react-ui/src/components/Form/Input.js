import React from "react";
import "./Form.css";

export const Input = props => (
  <div className="form-group input-fields">
  	<input className="form-control" {...props} />
  </div>
);
import React from "react";

/**
 * Component to separate different parts in pages
 * @param { String } props - String with what is wanted in the separation
 * @return { Promise React.Component }
 */
export function Separation(props) {
      var color;
      if (props.color) {
            color = props.color
      }
	return (
            <div className="divider" style={{color:color}}>{props.value}</div>
      )
}



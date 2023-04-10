import React from "react";

/**
 * Component to separate different parts in pages
 * @param { String } props - String with what is wanted in the separation
 * @return { Promise React.Component }
 */
export function Separation(props) {
	return (
            <div className="divider">{props.value}</div>
      )
}



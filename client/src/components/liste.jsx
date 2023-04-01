import React, { useEffect } from "react";

export function Liste(element, funct, list) {

	return (<div style={{display:"flex", flexWrap:"wrap"}}>
		<ul>
			{
				list.map((info, index) => (
					<li onClick={funct} style={{backgroundColor:"red", flex:"800px"}}>
						{element(info)}
					</li>
				))
			}
		</ul>
		<div id="container" style={{backgroundColor:"blue"}}></div>
	</div>)
}
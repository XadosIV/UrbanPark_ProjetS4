import React from "react";

/**
 * Components of a list of element wich uses a function on click (for the test period, use a list to be create)
 * @param { React.Component } element
 * @param { function } funct
 * @param { list: element } list
 * @return { Promise React.Component } Liste
 */
export function List(element, funct, list) {

	
	return (<div style={{display:"flex", flexWrap:"wrap", justifyContent:"center"}}>
		<ul style={{minWidth:"60%", maxWidth:"100%"}}>
			{
				list.map((info, index) => (
					<li onClick={funct} style={{backgroundColor:"red", listStyle:"none"}}>
						{element(info)}
					</li>
				))
			}
		</ul>
		<div id="container" style={{backgroundColor:"blue", maxWidth:"30%", transitionDuration:"0.5s"}}></div>
	</div>)
}
/**
 * InputHandler
 * Needed to use searchs in list - Execute the function given in parameter with what is in the TextField
 * 
 * @param fun - The function to execute
 * @returns the function
 */
export let InputHandler = fun => { 
    return (e) => {
        fun(e.target.value.toLowerCase());
    }
};

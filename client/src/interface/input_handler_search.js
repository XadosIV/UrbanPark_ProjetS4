export let InputHandler = fun => { 
    return (e) => {
        fun(e.target.value.toLowerCase());
    }
};

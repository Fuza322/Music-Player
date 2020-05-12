let Error404 = {

    render : async () => {
        let view =  /*html*/`
            <section class="section">
                <h1> 404 Error </h1>
            </section>
            <section id='musicplayer' class="fixed-music-player-container">
            </section>
        `
        return view
    }
    , after_render: async () => {
    }
}
export default Error404;

let Error404 = {

    render : async () => {
        let view =  /*html*/`
            <section class="section-error">
                <img id="error-pic" src="https://sun2.dataix-by-minsk.userapi.com/sl3hY3IDrvAFOKSk96kUDLHD-TCdNPz0MQXE0A/8brr06Usaxg.jpg">
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

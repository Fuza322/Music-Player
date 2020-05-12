let MusicPlayer = {
    render: async () => {
        let view =  /*html*/`
          <div>
            Здесь будет фиксированный section, в котором будет распологать плеер с текущей проигрываемой композиции (закрывает footer, пофикфу позже с помощью JS)
          </div>
        `
        return view
    },
    after_render: async () => {
    }

}

export default MusicPlayer;

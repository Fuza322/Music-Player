let Navbar = {
    render: async () => {
        let view =  /*html*/`
          <h1 class="sections-text">Главное</h1>
          <div id="main-nav-box-items">
              <a class="navigation-ref" href="#CreatePlaylist">Создать плейлист</a>
              <a class="navigation-ref" href="#MusicGenre">Музыкальные жанры</a>
              <a class="navigation-ref" href="#MusicArtists">Исполнители</a>
              <a class="navigation-ref" href="#Feedback">Обратная связь</a>
          </div>
        `
        return view
    }
}

export default Navbar;

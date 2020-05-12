async function getPlaylists(){
  const snapshot = await firebase.database().ref('/playlists').once('value');

  return snapshot.val();
}

let Index = {
    render : async () => {
        let view =  /*html*/`
            <nav id='navbar' class="main-nav-container">
            </nav>
            <!----------->
            <section class="playlist-container">
                <h2 class="sections-text" id="CreatePlaylist">Создать плейлист</h2>
                <p class="description-text">
                    Слушайте плейлист с подходящей именно для вас музыкой.<br>
                    Можете создать сразу несколько плейлистов, добавляя в них ваши любимые композиции.
                </p>
                <div class="div-li-buttons">
                    <ul id='playlists-container' class="box-items">
                        <li class="li-buttom"> <a href="/#/playlist"><img class="size-image-add-playlist" src="assets/images/AddPlaylist.png" alt="AddPlaylistImage"></img></a> </li>
                    </ul>
                </div>
            </section>
            <!----------->
            <section class="musicGenre-container">
                <h2 class="sections-text" id="MusicGenre">Музыкальные жанры</h2>
                <p class="description-text">
                    Выберите жанр музыки, который интересен вам в данный момент.
                </p>
                <div class="div-li-buttons">
                    <ul class="box-items">
                        <li class="li-buttom"> <a href="/#/genres/rock"><img class="size-image-genre" src="assets/images/musicGenresMainPage/RockGenreText.png" alt="RockGenreImage"></img></a> </li>
                        <li class="li-buttom"> <a href="/#/genres/hip_hop"><img class="size-image-genre" src="assets/images/musicGenresMainPage/HipHopGenreText.png" alt="HipHopGenreImage"></img></a> </li>
                        <li class="li-buttom"> <a href="/#/genres/electronic"><img class="size-image-genre" src="assets/images/musicGenresMainPage/ElectronicGenreText.png" alt="ElectronicGenreImage"></img></a> </li>
                        <li class="li-buttom"> <a href="/#/genres/folk"><img class="size-image-genre" src="assets/images/musicGenresMainPage/FolkGenreText.png" alt="FolkGenreImage"></img></a> </li>
                        <li class="li-buttom"> <a href="/#/genres/pop"><img class="size-image-genre" src="assets/images/musicGenresMainPage/PopGenreText.png" alt="PopGenreImage"></img></a> </li>
                        <li class="li-buttom"> <a href="/#/genres/classic"><img class="size-image-genre" src="assets/images/musicGenresMainPage/ClassicGenreText.png" alt="ClassicGenreImage"></img></a> </li>
                    </ul>
                </div>
            </section>
            <!----------->
            <section class="music-artists-container">
                <h2 class="sections-text" id="MusicArtists">Исполнители</h2>
                <div class="description-text">
                    Слушайте композиции ваших любимых исполнителей.
                </div>
                <div class="div-music-artists-list">
                    <ul class="box-items-artists" type="circle">
                        <li><a class="music-artists-ref" href="/#/artists/slot">Слот</a></li>
                        <li><a class="music-artists-ref" href="/#/artists/arctic_monkeys">Arctic Monkeys</a></li>
                        <li><a class="music-artists-ref" href="/#/artists/noize_mc">Noize MC</a></li>
                        <li><a class="music-artists-ref" href="/#/artists/eminem">Eminem</a></li>
                        <li><a class="music-artists-ref" href="/#/artists/daft_punk">Draft Punk</a></li>
                        <li><a class="music-artists-ref" href="/#/artists/prodigy">Prodigy</a></li>
                        <li><a class="music-artists-ref" href="/#/artists/melnica">Мельница</a></li>
                        <li><a class="music-artists-ref" href="/#/artists/fiddlers_green">Fiddler's Green</a></li>
                        <li><a class="music-artists-ref" href="/#/artists/adele">Adele</a></li>
                        <li><a class="music-artists-ref" href="/#/artists/dana_sokolova">Dana Sokolova</a></li>
                        <li><a class="music-artists-ref" href="/#/artists/bach">Johann Bach</a></li>
                        <li><a class="music-artists-ref" href="/#/artists/bethoven">Van Bethoven</a></li>
                    </ul>
                </div>
                <div>
                <div>
            </section>
            <section id='musicplayer' class="fixed-music-player-container">
            </section>
        `
        return view
    }
    , after_render: async () => {
        document.getElementById('page_container').className = 'main-container';
        const playlistsContainer = document.getElementById('playlists-container');
        const playlists = await getPlaylists();

        function renderPlaylists(){
          if (playlists){
            playlists.forEach(function(playlist){
              let playlistA = document.createElement('A');
              playlistA.href = `/#/playlists/${playlist.id}`;
              playlistA.className = 'playlist-name';
              playlistA.innerHTML = `<li class="li-buttom">
                                          <p>${playlist.name}</p>
                                      </li>`;
              playlistsContainer.appendChild(playlistA);
            });
          }
        }

        renderPlaylists();
    }

}

export default Index;

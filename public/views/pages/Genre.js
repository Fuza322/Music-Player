import Utils        from './../../services/Utils.js'

async function getGenre(id){
  const snapshot = await firebase.database().ref('/genres/' + id).once('value');

  return snapshot.val();
}

async function insertGenrePic(id, img){
  const storageRef = firebase.storage().ref();
  storageRef.child(`genres/${id}.png`).getDownloadURL().then(function(url){
    img.src = url;
  }).catch(function(error){
    alert(error.message);
  });
}

let Genre = {

    render : async () => {
        let view =  /*html*/`
          <nav id='navbar' class="main-nav-container">
          </nav>
          <section class="current-genre-container">
            <div class="div-current-genre">
              <h2 class="sections-text" id="MusicGenre">Выбранный жанр:</h2>
              <div class="div-current-genre-info">
                <div class="div-genre-img"><img id='genre-pic' class="genre-image"></div>
                <p class="genre">Музыкальный жанр:</p>
                        <p id='genre-name' class="genre-name"></p>
                      </div>
                  </div>
                  <div class="div-song-list">
                  </div>
                   <button class="btn-on-main-page" onclick="window.location.href='/'">На главную</button>
          </section>
          <section id='musicplayer' class="fixed-music-player-container">
          </section>
        `
        return view
    },
    after_render: async () => {
      document.getElementById('page_container').className = 'main-container';
      const request = Utils.parseRequestURL();
      const genrePic = document.getElementById('genre-pic');
      const genre = await getGenre(request.id);
      await insertGenrePic(request.id, genrePic);

      const genre_name = document.getElementById('genre-name');
      genre_name.innerText = genre.name;
    }
}
export default Genre;

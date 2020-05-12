import Utils        from './../../services/Utils.js'

async function getArtist(id){
  const snapshot = await firebase.database().ref('/artists/' + id).once('value');

  return snapshot.val();
}

let Artist = {

    render : async () => {
        let view =  /*html*/`
          <nav id='navbar' class="main-nav-container">
          </nav>
          <section class="current-artist-container">
            <div class="div-current-artist">
              <h2 class="sections-text" id="MusicGenre">Выбранный исполнитель:</h2>
              <div class="div-current-artist-info">
                <div class="div-artist-img"><img id='artist_img' class="artist-image"></div>
                <p id='artist_name' class="artist-name"></p>
                        <p id='artist_genre' class="artist-genre"></p>
                      </div>
                  </div>
                  <div id='audio-container' class="div-song-list">
                    <ul class='audio-list' id=audio-list>
                    </ul>
                  </div>
                  <button class="btn-on-main-page" onclick="window.location.href='/'">На главную</button>
          </section>
          <section id='player-container' class="fixed-music-player-container">
            <audio id='audio-player' controls='true'>
          </section>
        `
        return view
    }
    , after_render: async () => {
      document.getElementById('page_container').className = 'main-container';
      const request = Utils.parseRequestURL();
      const storageRef = firebase.storage().ref();
      const musicPlayer = document.getElementById('audio-player');
      const artistPic = document.getElementById('artist_img');
      const artistName = document.getElementById('artist_name');
      const artistGenre = document.getElementById('artist_genre');
      const audioContainer = document.getElementById('audio-container');
      const audioList = document.getElementById('audio-list');

      function insertArtistPic(id, img){
        storageRef.child(`artists/${id}.png`).getDownloadURL().then(function(url){
          img.src = url;
        }).catch(function(error){
          alert(error.message);
        });
      }

      function getAudio(id, list){
        storageRef.child(`audio/artists/${id}`).listAll().then(function(res){
          res.items.forEach(function(itemRef){
            let songContainer = document.createElement('LI');
            songContainer.className = 'song-container';
            songContainer.id = `${itemRef.fullPath}`;
            songContainer.innerText = `${itemRef.name}`;
            list.appendChild(songContainer);
          });
        }).catch(function(error){
          alert(error.message);
        });
      }

      function dowloadSong(id){
        storageRef.child(id).getDownloadURL().then(function(url){
          musicPlayer.src = url;
        }).catch(function(error){
          alert(error.message);
        });
      }

      insertArtistPic(request.id, artistPic);
      getAudio(request.id, audioList);
      const artist = await getArtist(request.id);

      artistName.innerText = artist.name;
      artistGenre.innerText = `Жанр исполнителя: ${artist.genre}`;

      audioList.onclick = function(event) {
        let target = event.target;

        if (target.tagName != 'LI') {
          return; }
        else {
          dowloadSong(target.id);
        }
      }

    }
}
export default Artist;

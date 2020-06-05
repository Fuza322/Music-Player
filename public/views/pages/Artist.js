import Utils        from './../../services/Utils.js'
import * as DS from './../../services/DS.js'

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
                  <div id='audio-container' class="div-song-list-artist">
                    <ul class='ul-audio-list-artist' id=audio-list>
                    </ul>
                  </div>
                  <button class="btn-on-main-page" onclick="window.location.href='/'">На главную</button>
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
      const artist = await getArtist(request.id);

      function insertArtistPic(id, img){
        storageRef.child(`artists/${id}.png`).getDownloadURL().then(function(url){
          img.src = url;
        }).catch(function(error){
          alert(error.message);
        });
      }

      async function getAudio(id, list){
        let snapshot = await firebase.database().ref('/song');
        snapshot.on("value", async function(snapshot) {
          console.log(snapshot.val());
          let songsList = snapshot.val();
          songsList.forEach(function(itemRef, index){
            if (itemRef.author == artist.name){
              let songLi = document.createElement('LI');
              songLi.className = 'li-audio-list-artist';
              //songLi.id = `${itemRef.fullPath}`;
              songLi.innerHTML = `
                                    <div class="div-play-audio-image-artist">
                                        <img id="${index}" class="play-audio-image-artist" src="assets/images/playerImages/playButton.png" alt="Play-audio-button">
                                    </div>
                                    <div class="div-audio-name-artist">
                                      <div>
                                        <p class="audio-name-artist">${itemRef.name + " - " + itemRef.author}</p>
                                      </div>
                                    </div>
                                 `
              // songLi.innerText = `${itemRef.name}`;
              list.appendChild(songLi);
            }
          });
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
      await getAudio(request.id, audioList);
     

      artistName.innerText = artist.name;
      //artistGenre.innerText = `Жанр исполнителя: ${artist.genre}`;

       audioList.addEventListener("click",async function(e) {
            console.log(e.target.nodeName);
            if(e.target && e.target.nodeName == "IMG") {
                console.log(e.target.id);
                if (firebase.auth().currentUser){
                    DS.pushPlaylist(firebase.auth().currentUser.email, [e.target.id]);
                }else{
                    alert("Login first.")
                }
                //firebase.database().ref('/playlists/' + playlistId + "/song_list/" + e.target.id).remove();
            }
        });

    }
}
export default Artist;

import Utils from './../../services/Utils.js'
import * as DS from './../../services/DS.js'
async function getGenre(id){
  const snapshot = await firebase.database().ref('/genres/' + id ).once('value');

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
                  <div class="div-song-list-genre">
                    <ul class='ul-audio-list-genre' id="audio-list">
                    </ul>
                  </div>
                   <button class="btn-on-main-page" onclick="window.location.href='/'">На главную</button>
          </section>
        `
        return view
    },
    after_render: async () => {
      
      const request = Utils.parseRequestURL();
      const genrePic = document.getElementById('genre-pic');
      const genre = await getGenre(request.id);
      await insertGenrePic(request.id, genrePic);

      const genre_name = document.getElementById('genre-name');
      genre_name.innerText = genre.name;

      async function getAudio(id, list){
        let snapshot = await firebase.database().ref('/song');
        snapshot.on("value", async function(snapshot) {
          console.log(snapshot.val());
          let songsList = snapshot.val();
          songsList.forEach(function(itemRef,index){
            if (itemRef.genre.toLowerCase() == request.id.toLowerCase()){
              let songLi = document.createElement('LI');
              songLi.className = 'li-audio-list-genre';
              //songLi.id = `${itemRef.fullPath}`;
              songLi.innerHTML = `
                                    <div class="div-play-audio-image-genre">
                                        <img id="${index}" class="play-audio-image-genre" src="assets/images/playerImages/playButton.png" alt="Play-audio-button">
                                    </div>
                                    <div class="div-audio-name-genre">
                                      <div>
                                        <p class="audio-name-genre">${itemRef.name + " - " + itemRef.author}</p>
                                      </div>
                                    </div>
                                 `
              // songLi.innerText = `${itemRef.name}`;
              list.appendChild(songLi);
            }
          });
        });
      }

      const audioList = document.getElementById('audio-list');
      await getAudio(request.id, audioList);

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
export default Genre;

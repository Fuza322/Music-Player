import Utils from './../../services/Utils.js'
import * as DS from './../../services/DS.js'

async function getLastId(){
  const snapshot = await firebase.database().ref('/playlist_counter/id').once('value');

  return snapshot.val();
}

let PlaylistNew = {

    render : async () => {
        let view =  /*html*/`
          <nav id='navbar' class="main-nav-container">
          </nav>
          <section class="create-playlist-container">
            <div class="div-create-playlist">
              <h2 class="sections-text" id="MusicGenre">Редактирование плейлиста:</h2>
              <div class="div-create-playlist-info">
                <div class="div-create-playlist-img">
                  <img class="add-playlist-image" src="assets/images/AddPlaylist.png" alt="AddPlaylistImage">
                </div>
                <p class="help-text-playlist-name">Название плейлиста:</p>
                <input id='playlist-name' class="input-playlist-name" type="text" placeholder="Введите название плейлиста">
              </div>
              <p class="help-text-added-music">Добавленные песни:</p>
              <div class="div-song-list-create-playlist">
                <ul id='audio-list' class='ul-audio-list-create-playlist'>
                </ul>
              </div>

              <p class="help-text-search-music">Поиск песен на сайте:</p>

              <input id='search-input' class="input-search-song" type="text" placeholder="Введите исполнителя и название песни">
              <div class="div-song-list-create-playlist">
                <ul id='search-ul' class='ul-audio-list-create-playlist'>
                </ul>
              </div>
              <button class="btn-create-playlist" id='submitBtn'>Сохранить</button>
            </div>
          </section>
          <section id='musicplayer' class="fixed-music-player-container">
          </section>
        `
        return view
    }
    ,
    after_render: async () => {
      const request = Utils.parseRequestURL();
      const searchInput = document.getElementById('search-input');
      const searchContainer = document.getElementById('search-ul');
      const songsContainer = document.getElementById('audio-list');

      async function update(){
        songsContainer.innerHTML ="";
        let snapshot = await firebase.database().ref('/playlists/' + request.id + '/song_list').once("value");
        //snapshot.on("value", async function(snapshot) {
            let idList = snapshot.val();
            console.log(idList);
            //idList.forEach(async function(itemRef){
            for(const itemRef of idList){
                if (!itemRef)continue;
                let songId = itemRef.id;
                let songSnapshot = await firebase.database().ref('/song/' + songId).once('value');
                let song = songSnapshot.val();
                let playlistLI = document.createElement('LI');
                playlistLI.className = 'li-audio-list-create-playlist';
                playlistLI.innerHTML = `
                    <div class="div-play-audio-image-current-playlist">
                                      <img id=${songId} class="play-audio-image-current-playlist" src="assets/images/playerImages/playButton.png" alt="Play-audio-button">
                                  </div>
                                  <div class="div-audio-name-current-playlist">
                                    <div>
                                      <p class="audio-name-current-playlist">${song.name} - ${song.author}</p>
                                    </div>
                                  </div>
                                  <div class="div-delete-audio-image-create-playlist">
                                      <img data-delete="yes" id=${songId} class="delete-audio-image-create-playlist" src="assets/images/playerImages/deleteAudio.png" alt="Delete-audio-button">
                                  </div>

                `;
                songsContainer.appendChild(playlistLI);

            }
      }

      function pushSongId(id) {
            firebase.database().ref('/playlists/' + request.id + "/song_id").set(id);
        }

      await update();
      searchInput.addEventListener('keyup',async function(event) {
            let query = searchInput.value.toLowerCase();
            const snapshot = await firebase.database().ref('/song');
            snapshot.on("value", async function(snapshot) {
                let songsList = snapshot.val();
                searchContainer.innerHTML = "";
                songsList.forEach(async function(itemRef, index){
                    if (itemRef.name.toLowerCase().includes(query) || itemRef.author.toLowerCase().includes(query)){

                        let songLI = document.createElement('LI');
                        songLI.className = 'li-audio-list-current-playlist';
                        songLI.id = index;
                        songLI.innerHTML = `<div class="div-play-audio-image-current-playlist">
                                      <img id="${index}" class="play-audio-image-current-playlist" src="assets/images/playerImages/playButton.png" alt="Play-audio-button">
                                  </div>
                                  <div id="${index}" class="div-audio-name-current-playlist">
                                    <div>
                                      <p class="audio-name-current-playlist">${itemRef.name} - ${itemRef.author}</p>
                                    </div>
                                  </div>
                                        `;
                    searchContainer.appendChild(songLI);
                    }
                });
            }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
            });
        });


        searchContainer.addEventListener("click",async function(e) {
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

        searchContainer.addEventListener("click",async function(e) {
            console.log(e.target.nodeName);
            event.preventDefault();
            if(e.target && e.target.nodeName == "DIV") {
                console.log(e.target.id + " was clicked");

                const snapshot = await firebase.database().ref('/playlists/' + request.id  + "/song_id").once('value');
                const lastSongId = snapshot.val();
                console.log('/playlists/' + request.id  + "/song_id");
                pushSongId(lastSongId + 1);
                firebase.database().ref('/playlists/' + request.id + "/song_list/" + lastSongId).set({
                    id : e.target.id
                }, function(error) {
                    if (error) {
                        alert(error.message);
                    }
                });
                //console.log("UPDATE")
                await update();
            }
        });

         songsContainer.addEventListener("click",async function(e) {
            console.log(e.target.nodeName);
            if(e.target && e.target.nodeName == "IMG") {
                if (firebase.auth().currentUser && !e.target.dataset.delete){
                    DS.pushPlaylist(firebase.auth().currentUser.email, [e.target.id]);
                }else{
                  if (e.target.dataset.delete){
                    firebase.database().ref('/playlists/' + request.id + "/song_list/" + e.target.id).remove();
                    update();
                  }else{
                    alert("Login first.")
                  }

                }
            }
        });


         const submit = document.getElementById('submitBtn');
         const name = document.getElementById('playlist-name');
         submit.addEventListener("click",async function(e) {
            firebase.database().ref('/playlists/' + request.id + "/name").set(name.value);
            //console.log(playlistId+1);
            //firebase.database().ref('/playlist_id/id').set(playlistId+1);
            document.location.href ="/#/playlists/" + request.id;
        });



    }
}
export default PlaylistNew;

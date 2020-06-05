import Utils        from './../../services/Utils.js'
import * as DS from './../../services/DS.js'

async function getPlaylistName(id){
  const snapshot = await firebase.database().ref('/playlists/' + id).once('value');

  return snapshot.val();
}


let Playlist = {

    render : async () => {
        let view =  /*html*/`
          <nav id='navbar' class="main-nav-container">
          </nav>
          <section class="custom-playlist-container">
      			<div class="div-custom-playlist">
      				<h2 class="sections-text" id="MusicGenre">Ваш плейлист:</h2>
      				<div class="div-custom-playlist-info">
      					<div class="div-custom-playlist-name"><p id='playlist-name' class="custom-playlist-name"></p></div>
                <div class="div-btn-edit-playlist">
                  <button id="edit-button" class="btn-edit-playlist" >Редактировать плейлист</button>
                </div>
              </div>
                  <div class="div-song-list-custom-playlist">
                    <ul class='audio-list-current-playlist' id=audio-list>
                    </ul>
                  </div>
                  <button id='deleteBtn' class="btn-delete-playlist">Удалить плейлист</button>
                  <button class="btn-on-main-page" onclick="window.location.href='/#/'">На главную</button>

      		</section>
        `
        return view
    }
    , after_render: async () => {
      document.getElementById('page_container').className = 'main-container';
      const request = Utils.parseRequestURL();
      const storageRef = firebase.storage().ref();
      const musicPlayer = document.getElementById('audio-player');
      const playlistNameContainer = document.getElementById('playlist-name');
      const audioList = document.getElementById('audio-list');
      const deleteBtn = document.getElementById('deleteBtn');
      const playlistName = await getPlaylistName(request.id);
      playlistNameContainer.innerText = playlistName.name;


       const songsContainer = document.getElementById('audio-list');

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
                playlistLI.className = 'li-audio-list-current-playlist';
                playlistLI.innerHTML = `
                    <div class="div-play-audio-image-current-playlist">
                                      <img id=${songId} class="play-audio-image-current-playlist" src="assets/images/playerImages/playButton.png" alt="Play-audio-button">
                                  </div>
                                  <div class="div-audio-name-current-playlist">
                                    <div>
                                      <p class="audio-name-current-playlist">${song.name} - ${song.author}</p>
                                    </div>
                                  </div>

                `;
                songsContainer.appendChild(playlistLI);

            }

      songsContainer.addEventListener("click",async function(e) {
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

      const editButton = document.getElementById('edit-button');
      editButton.addEventListener("click",async function(e) {

          document.location.href ="/#/edit/" + request.id;
        });

      deleteBtn.addEventListener("click",async function(e) {
          firebase.database().ref('/playlists/' + request.id).remove();
          document.location.href ="/#/";
        });
    }
}
export default Playlist;

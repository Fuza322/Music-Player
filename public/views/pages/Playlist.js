import Utils        from './../../services/Utils.js'

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
                      </div>
                  <div class="div-song-list">
                    <ul class='audio-list' id=audio-list>
                    </ul>
                  </div>
                  <button id='deleteBtn' class="btn-delete-playlist">Удалить плейлист</button>
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
      const playlistNameContainer = document.getElementById('playlist-name');
      const audioList = document.getElementById('audio-list');
      const deleteBtn = document.getElementById('deleteBtn');
      const playlistName = await getPlaylistName(request.id);
      playlistNameContainer.innerText = playlistName.name;

      function getAudio(id, list){
        storageRef.child(`audio/playlists/${id}`).listAll().then(function(res){
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

      getAudio(request.id, audioList);

      audioList.onclick = function(event) {
        let target = event.target;

        if (target.tagName != 'LI') {
          return; }
        else {
          dowloadSong(target.id);
        }
      }

      deleteBtn.onclick = function(){
        firebase.database().ref('/playlists/' + request.id).remove();
        storageRef.child(`/audio/playlists/${request.id}`).listAll().then(function(res){
          res.items.forEach(function(itemRef){
            storageRef.child(itemRef.fullPath).delete();
          });
          window.location.href = '/';
        });
      }


    }
}
export default Playlist;

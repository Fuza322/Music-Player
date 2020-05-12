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
      				<h2 class="sections-text" id="MusicGenre">Создание плейлиста:</h2>
      				<div class="div-create-playlist-info">
      					<div class="div-create-playlist-img">
                  <img class="add-playlist-image" src="assets/images/AddPlaylist.png" alt="AddPlaylistImage">
                </div>
    					  <p class="help-text-playlist-name">Название плейлиста:</p>
                <input id='playlist-name' class="input-playlist-name" type="text" placeholder="Введите название плейлиста">
              </div>
              <p class="help-text-load-music">Загрузите треки:</p>
              <input class="btn-shose-file" type='file' id='file' accept="audio/mpeg">
              <div class="div-song-list">
              	<ul id='audio-list' class='audio-list'>
                </ul>
              </div>
              <button class="btn-create-playlist" id='submitBtn'>Создать</button>
            </div>
      		</section>
          <section id='musicplayer' class="fixed-music-player-container">
          </section>
        `
        return view
    }
    ,
    after_render: async () => {
      document.getElementById('page_container').className = 'main-container';
      const file = document.getElementById('file');
      const playlistName = document.getElementById('playlist-name');
      const fileList = document.getElementById('audio-list');
      const submitBtn = document.getElementById('submitBtn');
      const storageRef = firebase.storage().ref();
      const lastId = await getLastId();
      let files = [];

      function displayFileName(file) {
        let songContainer = document.createElement('LI');
        songContainer.innerHTML = `<span>${file.name}</span>`;
        fileList.appendChild(songContainer);
      }

      function pushId(id) {
         firebase.database().ref('/playlist_counter').set({ id });
       }

      function saveAudio(){
        let audioRef = storageRef.child(`/audio/playlists/${lastId}`);
        for (let i = 0; i < files.length; i++){
          audioRef.child(`${files[i].name}`).put(files[i]).then(function(snapshot){
            window.location.href = `/#/playlists/${lastId}`;
          }).catch(function(error){
            alert(error.message);
          });
        }
      }

      function saveName(){
       firebase.database().ref('playlists/' + lastId).set({
         name: playlistName.value,
         id: lastId
       }, function(error) {
         if (error) {
           alert(error.message);
         } else {
           console.log('data saved succsessfully!');
         }
       });
      }

      function savePlaylist(){
        saveName();
        saveAudio();
        pushId(lastId + 1);
      }

      file.onfocus = function(){
        file.value = '';
      }

      file.onchange = function(){
        let fileTmp;
        fileTmp = file.files[0];
        displayFileName(fileTmp);
        files.push(fileTmp);
        this.blur();
      }

      submitBtn.onclick = function(){
        savePlaylist();
      }
    }
}
export default PlaylistNew;

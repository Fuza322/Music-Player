import * as DS from './../../services/DS.js'

let Search = {

    render : async () => {
        let view =  /*html*/`
        <section class="search-all-songs-container">
  				<h2 class="sections-text">Поиск песен на сайте</h2>
  				<div class="description-text">
  					Введите название трека или исполнителя, чтобы найти интересующую вас композицию. <br>
  					Для поиска песни нажмите "Enter" или кнопку ввода.
  				</div>
          <div class="div-input-search-all-songs">
  				    <input id='search-input' class="input-search-all-songs" type="text" placeholder="Поиск">
          </div>
          <div class="div-song-list-search-all-songs">
  	       	<ul id='search-container' class='ul-audio-listsearch-all-songs'>
  	        </ul>
  	      </div>
			</section>
        	`
    		return view
    	},
        after_render: async () => {
        	const searchInput = document.getElementById('search-input');
        	const searchContainer = document.getElementById('search-container');

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
                                      <img id="${index}"" class="play-audio-image-current-playlist" src="assets/images/playerImages/playButton.png" alt="Play-audio-button">
                                  </div>
                                  <div class="div-audio-name-current-playlist">
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

        }
    }

export default Search;

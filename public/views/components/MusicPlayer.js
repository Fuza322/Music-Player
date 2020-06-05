let MusicPlayer = {
    render: async () => {
        let view =  /*html*/`
        <section id="player-section" class="audio-player-section">
            <div class="player-input-div">
                <input type="range" min="0" max="300" value="0" id="range">
            </div>

            <div class="player-content">
                <div class="player-song-details">
                    <p class="player-song-name" id="player-name-p"></p>
                    <p class="player-song-author" id="player-author-p"></P>
                </div>

                <div class="div-player-inteface">
                    <button class="player-img-button" id="player-prev">
                         <img class="player-img" id=player-prev-img src="assets/images/playerImages/preSong.png">
                    </button>
                    <button class="player-img-button" id="player-pause">
                        <img class="player-img" id="player-pause-img" src="assets/images/playerImages/playButton.png" />
                    </button>
                    <button class="player-img-button" id="player-next">
                        <img class="player-img" id=player-next-img src="assets/images/playerImages/nextSong.png">
                    </button>
                </div>

                 <div class="player-duration-div">
                    <!--p id="duration">test</p-->
                    <p class="player-duration-time" id="current-time">0:00</p>
                </div>
            </div>

            <audio id="player">
                <!--source src="track.ogg" type="audio/ogg"/-->
                <!--source src="track.mp3" type="audio/mpeg"/-->
                Your browser does not support the audio element.
            </audio>
        </section>
        `
        return view
    },
    after_render: async () => {
        const playButton = document.getElementById('player-pause');
        const player = document.getElementById('player');
        const nextButton = document.getElementById('player-next');
        const prevButton = document.getElementById('player-prev');
        const duration = document.getElementById('duration');
        const curTime = document.getElementById('current-time');
        const pic = document.getElementById('song-image');

        const playPic = document.getElementById('player-pause-img');
        const nameP = document.getElementById('player-name-p');
        const authorP = document.getElementById('player-author-p');
        const section = document.getElementById('player_container');

        let first = true;
        let currentSong  = 0;
        let currentUser;
        let songsQueue = [];

        async function getPlaylist(){
            console.log('started loading');
            let snapshot = await firebase.database().ref('/play_queue');
            snapshot.on("value", async function(snapshot) {
                let idList = snapshot.val();
                //idList.forEach(async function(itemRef){
                for(const [index,itemRef] of idList.entries()){
                    if (!itemRef)continue;
                   
                    if (itemRef.user == currentUser){

                        const queueSongSnapshot = await firebase.database().ref('/play_queue/' + index + '/songs_list').once('value');
                        let songs = queueSongSnapshot.val();
                        songsQueue = [];
                        if (first && songs == null){
                            section.classList.add("hide");
                            break;
                        }else{
                            section.classList.remove("hide");
                        }
                        for(const song of songs){
                            if (!song) continue;
                            songsQueue.push(song.id);
                        }

                        currentSong = 0;
                        await getSong();
                        break;
                    }
                }
                if (!first){
                    play();
                }
                first = false;
            });
        }

        async function getSong(){
            let snapshot = await firebase.database().ref('/song/' + songsQueue[currentSong]).once('value');
            let songRef = snapshot.val();

            let ref= firebase.storage().ref();
            const fullRef = ref.child("/mp3/" + songRef.name + " - " + songRef.author + ".mp3");
            const downloadURL = await fullRef.getDownloadURL();

            player.src = downloadURL;
            nameP.innerHTML = songRef.name;
            authorP.innerHTML = songRef.author;
        }

        firebase.auth().onAuthStateChanged(async firebaseUser => {
            if (firebaseUser){
                //console.log("tut true");
                first = true;
                currentUser = firebase.auth().currentUser.email;
                await getPlaylist();
                section.classList.remove("hide");
            }else{
                pause();
                section.classList.add("hide");
                console.log('not cool((');
            }
        });

        function play() {
            playPic.src = "assets/images/playerImages/pauseButton.png";
            isPlay = true;
            player.play();
        }

        function pause() {
            playPic.src = "assets/images/playerImages/playButton.png";
            isPlay = false;
            player.pause();
        }

        async function next(){
            currentSong = currentSong + 1;
            if (currentSong == songsQueue.length){
                currentSong = 0;
            }
            await getSong();
            play();
        }

        async function prev(){
            currentSong = currentSong - 1;
            if (currentSong == -1){
                currentSong = songsQueue.length - 1;
            }
            await getSong();
            play();
        }

        let isPlay = false;
        //playButton.innerHTML = "PLAY";

        playButton.addEventListener("click",async function(e) {
            if (isPlay){
                pause();
            }else{
                play();
            }
        });

        nextButton.addEventListener("click", async function(e){
            await next();
        });

        prevButton.addEventListener("click", async function(e){
            await prev();
        });

        player.addEventListener("ended", async function() {
            next();
        });

        /*player.addEventListener("durationchange", function() {
            duration.innerHTML = (player.duration / 60 | 0) + ":" + (player.duration % 60 | 0);
        });*/

        player.addEventListener("timeupdate", function() {
            if (player.currentTime % 60 < 10){
                curTime.innerHTML = (player.currentTime / 60 | 0) + ":0" + (player.currentTime % 60 | 0);
            }else{
                curTime.innerHTML = (player.currentTime / 60 | 0) + ":" + (player.currentTime % 60 | 0);
            }
            range.value = (player.currentTime / player.duration) * 300 | 0;
        });

        range.addEventListener('input', function () {
            player.currentTime = range.value / 300 * player.duration;
        }, false);
    }

}

export default MusicPlayer;

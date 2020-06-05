export async function pushPlaylist(user, list){
   
    console.log(user);

    const snapshot = await firebase.database().ref('/play_queue').once('value');
    const queues = snapshot.val();
    let findedUserId = 0;

    for(let [index,queue] of queues.entries()){
        if (!queue) continue;

        if (queue.user == user){
            findedUserId = index;
            break;
        }
    }

    console.log(findedUserId);

    firebase.database().ref('/play_queue/' + findedUserId + '/songs_list/').remove();
    let i = 1;
    for(let songId of list){
        firebase.database().ref('/play_queue/' + findedUserId + '/songs_list/' + i + '/id').set(songId);
        i = i + 1;
    }
    
}
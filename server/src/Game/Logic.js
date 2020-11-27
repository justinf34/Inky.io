const Lobby = require("./Lobby");
const db = require("../../config/db");

module.exports = function () {

	//Return the score getting for a sucessful guess
  function updateSucessGuess (questionPoint, timeLeft, totalTime){
      return questionPoint * (timeLeft / totalTime);
		}
		
  //Generate rondom wordList from db
  function getWordList (number){
    var word_list = [];
      for (var i = 0; i < number; i++){
        db.collection('Words').where(db.FieldPath.documentID(), '>=', db.collection('Words')).limit(1).get
        .then(snapshot => {
          if(snapshot.size > 0){
            snapshot.forEach(doc => {
              word_list.push(snapshot.data().word);  
            });  
          }
          else {
            db.collection('Words').where(db.FieldPath.documentID(), '>=', db.collection('Words')).limit(1).get
            .then(snapshot => {
							snapshot.forEach(doc => {
								word_list.push(snapshot.data().word);  
							});
            })
          }  
				 })
				 .catch(err =>{
					 console.log("error getting random document in Words")
				 })  
			}
			return word_list;
  }

	return{
		updateSucessGuess,
		getWordList,
	}
}
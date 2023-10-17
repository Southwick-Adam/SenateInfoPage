// Use the fetch() method to retrieve the JSON data
fetch("./senators.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP Error: status ${response.status}`);
    }
    return response.json(); //parse JSON data
  })
  .then((data) => func(data)) //if everything is good send JSON objects to func
  .catch((error) => {
    console.error("Error:", error); //send the error to the console
  });

//3 globals
let senArr = []; //array for holding new senator obj
let leaderArr = []; //array for holding new leader obj
let parties = {}; //object to act like dictionary and hold party names as keys and counts as values.

//new senator class with all info we need to load onto page
class senator {
  constructor(
    name,
    party,
    state,
    gender,
    rank,
    office,
    birthday,
    startdate,
    twitterid,
    youtubeid,
    website
  ) {
    this.name = name;
    this.party = party;
    this.state = state;
    this.gender = gender;
    this.rank = rank;
    this.office = office;
    this.birthday = birthday;
    this.startdate = startdate;
    this.twitterid = twitterid;
    this.youtubeid = youtubeid;
    this.website = website;
  }
}

//new leader class with all info we need to load onto page
class leader {
  constructor(leadership_title, name, party) {
    this.leadership_title = leadership_title;
    this.name = name;
    this.party = party;
  }
}

//function we send JSON objects to
function func(data) {
  for (let s of data.objects) {
    //each s is a senator object
    //we send JSON data to functions that populate our 3 globals
    partyCount(s.party);
    if (s.leadership_title != null) {
      fillLeaderArr(s);
    }
    fillSenArr(s);
  }
  //these 3 functions use global arrays/objects so no need to pass anything in
  generatePartyList();
  generateLeaderList();
  generateSenatorList();
}

//creates object attributes for each party and has Senator count as value
function partyCount(p) {
  if (Object.keys(parties).includes(p)) {
    parties[p] += 1;
  } else {
    parties[p] = 1;
  }
}

//passes in JSON data to create new Senator objects and pushes to senArr
function fillSenArr(s) {
  let name = s.person.firstname + " " + s.person.lastname;
  const sen = new senator(
    name,
    s.party,
    s.state,
    s.person.gender,
    s.senator_rank,
    s.extra.office,
    s.person.birthday,
    s.startdate,
    s.person.twitterid,
    s.person.youtubeid,
    s.website
  );
  senArr.push(sen);
}

//passes in JSON data to create new Leader objects and pushes to leaderArr
function fillLeaderArr(s) {
  let name = s.person.firstname + " " + s.person.lastname;
  const l = new leader(s.leadership_title, name, s.party);
  leaderArr.push(l);
}

//creates html elements for party div
function generatePartyList() {
  for (p in parties) {
    const newDiv = document.createElement("div");
    const partyName = document.createElement("div");
    const partyNum = document.createElement("div");
    partyName.innerHTML = p;
    partyNum.innerHTML = parties[p];
    newDiv.appendChild(partyName);
    newDiv.appendChild(partyNum);
    document.getElementById("parties").appendChild(newDiv);
  }
}

//creates html info table for leader div
function generateLeaderList() {
  for (l of leaderArr) {
    //each l is a leader
    const newRow = document.createElement("tr");
    for (a in l) {
      //each a is an attribute
      const newEntry = document.createElement("td");
      newEntry.innerHTML = l[a];
      newRow.appendChild(newEntry);
    }
    document.getElementById("lTable").appendChild(newRow);
  }
}

//creates html info table for senator div
function generateSenatorList() {
  for (s of senArr) {
    //each s is a senator
    const newRow = document.createElement("tr");
    newRow.addEventListener("click", senSelect(s)); //adding an onclick to select senators //DOES NOT WORK YET!!!!!----------------
    for (a in s) {
      //each a is an attribute
      const newEntry = document.createElement("td");
      //create a link instead of just write info in for website
      if (a == "website") {
        const link = document.createElement("a");
        link.text = s.website;
        link.href = s.website;
        newEntry.appendChild(link);
      } else {
        newEntry.innerHTML = s[a];
      }
      newRow.appendChild(newEntry);
    }
    document.getElementById("sTable").appendChild(newRow);
  }
}

//DOES NOT WORK YET!!!!!----------------
//read sentor data and fill in Info div
function senSelect(s) {
  console.log("test");
}

// Use the fetch() method to retrieve the JSON data
fetch("../JSON/senators.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network Response Problem");
    }
    return response.json(); //parse JSON data
  })
  .then((data) => func(data)) //if everything is good send JSON objects to func
  .catch((error) => {
    console.error(error); //send the error to the console
    alert(error);
  });

//function we send JSON objects to
function func(data) {
  let leaderArr = [];
  let senArr = [];
  for (let s of data.objects) {
    //s -> senator object
    partyCount(s.party);
    if (s.leadership_title != null) {
      leaderArr.push(createLeaderObj(s));
    }
    senArr.push(createSenObj(s));
  }
  //send both arrays to sorting function to group by party
  leaderArr = attributeSort(leaderArr, "party");
  senArr = attributeSort(senArr, "party");
  //send sorted senate data to global dictionary
  populateSenDict(senArr);
  //functions to interact with html
  generatePartyList();
  generateLeaderList(leaderArr);
  generateSenatorList(senArr);
}

let senDict = {}; //dictionary of senators by sid
let parties = {}; //dictionary of party size by party

//new senator class with relavent info
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
    website,
    sid
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
    this.sid = sid;
  }
}

//new leader class with relavent info
class leader {
  constructor(leadership_title, name, party) {
    this.leadership_title = leadership_title;
    this.name = name;
    this.party = party;
  }
}

//creates object attributes for each party and has # of Senators as value
function partyCount(p) {
  if (Object.keys(parties).includes(p)) {
    parties[p] += 1;
    return;
  }
  parties[p] = 1;
}

function createLeaderObj(s) {
  const name = s.person.firstname + " " + s.person.lastname;
  const l = new leader(s.leadership_title, name, s.party);
  return l;
}

function createSenObj(s) {
  const name = s.person.firstname + " " + s.person.lastname;
  const sen = new senator(
    name,
    s.party,
    s.state,
    s.person.gender_label,
    s.senator_rank_label,
    s.extra.office,
    s.person.birthday,
    s.startdate,
    s.person.twitterid,
    s.person.youtubeid,
    s.website,
    s.person.bioguideid
  );
  return sen;
}

function populateSenDict(senArr) {
  for (s of senArr) {
    //s -> senator Object
    senDict[s.sid] = s;
  }
}

//html for party div
function generatePartyList() {
  for (p in parties) {
    //p -> party name (key)
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

//html for leader div
function generateLeaderList(leaderArr) {
  for (l of leaderArr) {
    //l -> leader Object
    const newRow = document.createElement("tr");
    for (a in l) {
      //a -> attribute
      const newEntry = document.createElement("td");
      newEntry.innerHTML = l[a];
      newRow.appendChild(newEntry);
    }
    document.getElementById("LTable").appendChild(newRow);
  }
}

//creates html info table for senator div
function generateSenatorList() {
  for (s in senDict) {
    //s -> senDict key
    const senObj = senDict[s];
    const newRow = document.createElement("tr");
    //row ID = senator ID
    newRow.setAttribute("id", senObj.sid);
    //add click event handler to each row
    newRow.addEventListener("click", function () {
      senSelect(senDict[newRow.id]);
    });
    for (a in senObj) {
      //a -> attribute
      if (a == "office") {
        //dont want to add last 6 attributes
        break;
      }
      //a -> attribute
      const newEntry = document.createElement("td");
      newEntry.innerHTML = senObj[a];
      newRow.appendChild(newEntry);
    }
    document.getElementById("STable").appendChild(newRow);
  }
}

//populate Info div : takes senator Object
function senSelect(s) {
  //s -> senator Object
  document.getElementById("office").innerHTML = s.office;
  document.getElementById("startdate").innerHTML = s.startdate;
  document.getElementById("twitterid").innerHTML = s.twitterid;
  document.getElementById("youtubeid").innerHTML = s.youtubeid;
  const web = document.getElementById("website");
  web.href = s.website;
  web.textContent = s.website;
}

//returns array sorted by attribute
function attributeSort(arr, attr) {
  //sort using compare function
  arr.sort((a, b) => {
    const a1 = a[attr];
    const b2 = b[attr];
    //comparing party alphabetically
    if (a1 < b2) {
      return -1;
    }
    if (a1 > b2) {
      return 1;
    }
    return 0;
  });
  return arr;
}

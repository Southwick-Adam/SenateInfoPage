// Use the fetch() method to retrieve the JSON data
fetch("./senators.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP Error: status ${response.status}`);
    }
    return response.json(); //parse JSON data
  })
  .then((data) => funcc(data))
  .catch((error) => {
    console.error("Error:", error); //send the error to the console
  });

let senArr = [];
let leaderArr = [];
let parties = {};

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
    this.gender = rank;
    this.office = office;
    this.birthday = birthday;
    this.startdate = startdate;
    this.twitterid = twitterid;
    this.youtubeid = youtubeid;
    this.website = website;
  }
}

class leader {
  constructor(leadership_title, name, party) {
    this.leadership_title = leadership_title;
    this.name = name;
    this.party = party;
  }
}

function funcc(data) {
  for (let s of data.objects) {
    //each s is a senator object
    partyCount(s.party);
    if (s.leadership_title != null) {
      fillLeaderArr(s);
    }
    fillSenArr(s);
  }
  generatePartyList();
  generateLeaderList();
  generateSenatorList();
}

function partyCount(p) {
  if (Object.keys(parties).includes(p)) {
    parties[p] += 1;
  } else {
    parties[p] = 1;
  }
}

function fillSenArr(s) {
  let name = s.person.firstname + " " + s.person.lastname;
  const sen = new senator(
    name,
    s.party,
    s.state,
    s.person.gender,
    s.rank,
    s.extra.office,
    s.person.birthday,
    s.startdate,
    s.person.twitterid,
    s.person.youtubeid,
    s.website
  );
  senArr.push(sen);
}

function fillLeaderArr(s) {
  let name = s.person.firstname + " " + s.person.lastname;
  const l = new leader(s.leadership_title, name, s.party);
  leaderArr.push(l);
}

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

function generateLeaderList() {
  for (l of leaderArr) {
    //each l is a leader
    const newRow = document.createElement("tr");
    for (i in l) {
      //each i is an attribute
      const newEntry = document.createElement("td");
      newEntry.innerHTML = l[i];
      newRow.appendChild(newEntry);
    }
    document.getElementById("lTable").appendChild(newRow);
  }
}

function generateSenatorList() {
  for (s of senArr) {
    //each s is a senator
    const newRow = document.createElement("tr");
    for (i in s) {
      //each i is an attribute
      const newEntry = document.createElement("td");
      if (i == "website") {
        const link = document.createElement("a");
        link.href = s.website;
        newEntry.appendChild(link); //this line isnt working for some reason
        newEntry.innerHTML = link; //just to show the website for now
      } else {
        newEntry.innerHTML = s[i];
      }
      newRow.appendChild(newEntry);
    }
    document.getElementById("sTable").appendChild(newRow);
  }
}

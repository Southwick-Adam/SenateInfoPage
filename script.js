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
    fillSenArr(s);
    partyCount(s.party); //seperate into parties
    if (s.leadership_title != "null") {
      leaderInfo(s);
    }
  }
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
    s.gender,
    s.rank,
    s.extra.office,
    s.birthday,
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

// Use the fetch() method to retrieve the JSON data
fetch("../JSON/senators.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network Response Problem');
    }
    return response.json(); //parse JSON data
  })
  .then((data) => func(data)) //if everything is good send JSON objects to func
  .catch((error) => {
    console.error(error); //send the error to the console
    alert(error);
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
  //send both arrays to sorting function to group by party
  attributeSort(leaderArr, "party")
  attributeSort(senArr, "party")
  //these 3 functions use global arrays/objects so no need to pass anything in
  generatePartyList();
  generateLeaderList();
  generateSenatorList();
}

//POPULATING 3 GLOBALS FUNCTIONS
//creates object attributes for each party and has Senator count as value
function partyCount(p) {
  if (Object.keys(parties).includes(p)) {
    parties[p] += 1;
  } else {
    parties[p] = 1;
  }
}

//passes in JSON data to create new Leader objects and pushes to leaderArr
function fillLeaderArr(s) {
  let name = s.person.firstname + " " + s.person.lastname;
  const l = new leader(s.leadership_title, name, s.party);
  leaderArr.push(l);
}

//passes in JSON data to create new Senator objects and pushes to senArr
function fillSenArr(s) {
  let name = s.person.firstname + " " + s.person.lastname;
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
    s.website
  );
  senArr.push(sen);
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
    document.getElementById("LTable").appendChild(newRow);
  }
}

//creates html info table for senator div
function generateSenatorList() {
  //iterate by index instead of object so we can access the index of the array
  for (s of senArr) {
    //each s is a senator
    const newRow = document.createElement("tr");
    //add a click event handler to each row
    newRow.addEventListener("click", function () {
      let parent = document.getElementById("STable");
      //iterate through all parent tables children to find which one we clicked on as a number
      for (c = 0; c < parent.childElementCount; c++) {
        //once we find that number we can use it as an index for senArr to say which senator we are calling to Info.
        if (parent.children[c] == newRow) {
          senSelect(senArr[c - 1]); // c-1 bc the array starts at 0, but the child count starts at 1
        }
      }
    });
    for (a in s) {
      if (a == "office") {
        //dont want to add last 6 attributes to table
        break;
      }
      //each a is an attribute
      const newEntry = document.createElement("td");
      newEntry.innerHTML = s[a];
      newRow.appendChild(newEntry);
    }
    document.getElementById("STable").appendChild(newRow);
  }
}

//read sentor data and fill in Info div
function senSelect(s) {
  document.getElementById("office").innerHTML = s.office;
  document.getElementById("startdate").innerHTML = s.startdate;
  document.getElementById("twitterid").innerHTML = s.twitterid;
  document.getElementById("youtubeid").innerHTML = s.youtubeid;
  const web = document.getElementById("website");
  web.href = s.website;
  web.textContent = s.website;
}

//FUNCTION TO SORT BY ATTRIBUTE
function attributeSort(arr, attr) {
  arr.sort((a, b) => {
    const a1 = a[attr];
    const b2 = b[attr];
    if (a1 < b2) {
      return -1;
    }
    if (a1 > b2) {
      return 1;
    }
    return 0;
  });
}

//TEST
//FUCK APRLI
  
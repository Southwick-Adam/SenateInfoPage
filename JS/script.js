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
    populateFilters(s.party, s.state, s.senator_rank_label);
    countPartyMembers(s.party);
    if (s.leadership_title != null) {
      leaderArr.push(createLeaderObj(s));
    }
    senArr.push(createSenObj(s));
  }
  //send arrays to sorting function -> sort by party
  leaderArr = attributeSort(leaderArr, "party");
  senArr = attributeSort(senArr, "party");
  //send sorted senate data to global dictionary
  populateSenDict(senArr);
  //functions to interact with html
  generatePartyList();
  generateLeaderList(leaderArr);
  generateSenatorList(senArr);
  return;
}

let senDict = {}; //dictionary of senators by sid
let parties = {}; //dictionary of party size by party

//dictionaries of filter options
//key = option, value = bool (whether they are showing or not)
let partyFilter = { all: true };
let stateFilter = { all: true };
let rankFilter = { all: true };

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
    this.row = null;
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
//takes senator.party as argument
function countPartyMembers(p) {
  if (Object.keys(parties).includes(p)) {
    parties[p] += 1;
    return;
  }
  parties[p] = 1;
  return;
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

//adds new senate objects to the senate dictionary object
//takes array of new senate objects as argument
function populateSenDict(senArr) {
  for (s of senArr) {
    //s -> senator Object
    senDict[s.sid] = s;
  }
  return;
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
  return;
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
  return;
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
    senObj.row = newRow;
    newRow.setAttribute("class", "senateListRow");
    document.getElementById("STable").appendChild(newRow);
  }
  return;
}

//populate Info div
//takes senator Object as argument
function senSelect(s) {
  //s -> senator Object
  document.getElementById("office").innerHTML = s.office;
  document.getElementById("startdate").innerHTML = s.startdate;
  document.getElementById("twitterid").innerHTML = s.twitterid;
  document.getElementById("youtubeid").innerHTML = s.youtubeid;
  const web = document.getElementById("website");
  web.href = s.website;
  web.textContent = s.website;
  return;
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

//populate the 3 filters with options
//takes senator.party, senator.state, senator.rank as arguments
function populateFilters(p, s, r) {
  if (!Object.keys(partyFilter).includes(p)) {
    partyFilter[p] = false;
    populateFilterOption(p, "PFlist");
  }
  if (!Object.keys(stateFilter).includes(s)) {
    stateFilter[s] = false;
    populateFilterOption(s, "SFlist");
  }
  if (!Object.keys(rankFilter).includes(r)) {
    rankFilter[r] = false;
    populateFilterOption(r, "RFlist");
  }
  return;
}

//creates list element, gives it an onClick function and adds to filter
//takes senator.party/state/rank and the filterList ID as arguments
function populateFilterOption(option, filterListID) {
  const newLi = document.createElement("li");
  newLi.innerHTML = option;
  newLi.addEventListener("click", function () {
    changeOptionInFilter(option, filterListID);
  });
  addOptionToFilter(option, filterListID);
  document.getElementById(filterListID).appendChild(newLi);
}

//adds the selected option to appropriate filter dict
//takes option as argument
function addOptionToFilter(option, id) {
  let dict;
  if (id == "PFlist") {
    dict = partyFilter;
  } else if (id == "SFlist") {
    dict = stateFilter;
  } else if (id == "RFlist") {
    dict = rankFilter;
  }
  dict[option] = true;
}

function changeOptionInFilter(option, id) {
  let dict;
  let attr;
  let hideClass;
  if (id == "PFlist") {
    dict = partyFilter;
    attr = "party";
    hideClass = "partyHide";
  } else if (id == "SFlist") {
    dict = stateFilter;
    attr = "state";
    hideClass = "stateHide";
  } else if (id == "RFlist") {
    dict = rankFilter;
    attr = "rank";
    hideClass = "rankHide";
  }
  if (dict.all) {
    removeAllInFilter(dict);
  }
  dict[option] = !dict[option];
  runFilter(dict, attr, hideClass);
}

//sets all options is filter to false
//takes filter as argument
function removeAllInFilter(dict) {
  for (i in dict) {
    dict[i] = false;
  }
}

//goes through a filter list and hides anything not on it
function runFilter(dict, attr, hideClass) {
  for (s in senDict) {
    //s -> senDict key
    const senObj = senDict[s];
    if (dict[senObj[attr]]) {
      document.getElementById(senObj.sid).classList.remove(hideClass);
    } else {
      document.getElementById(senObj.sid).classList.add(hideClass);
    }
  }
}

// Use the fetch() method to retrieve the JSON data
fetch("JSON/senators.json")
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
    document.getElementById("loading").innerHTML = "Failed to Load.";
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
  //send leaders to sorting function -> sort by party
  leaderArr = attributeSort(leaderArr, "party");
  //send senators to sorting function -> sort by state -> sort by party
  senArr = attributeSort(senArr, "state");
  senArr = attributeSort(senArr, "party");
  //sort filter lists
  filterKeySort(partyFilter);
  filterKeySort(stateFilter);
  filterKeySort(rankFilter);
  //send sorted senate data to global dictionary
  populateSenDict(senArr);
  //functions to interact with html
  generatePartyList();
  generateLeaderList(leaderArr);
  generateSenatorList(senArr);
  //generate filter list HTML
  for (let pf in partyFilter) {
    generateFilter(pf, "PFlist");
  }
  for (let sf in stateFilter) {
    generateFilter(sf, "SFlist");
  }
  for (let rf in rankFilter) {
    generateFilter(rf, "RFlist");
  }
  //add 'all' atribute to each filter
  partyFilter.all = true;
  stateFilter.all = true;
  rankFilter.all = true;

  //add selected counter to each filter
  partyFilter.count = 0;
  stateFilter.count = 0;
  rankFilter.count = 0;

  fixStripes();

  document.getElementById("main").classList.remove("notLoaded");
  document.getElementById("loading").classList.add("notLoaded");

  return;
}

let senDict = {}; //dictionary of senators by sid
let parties = {}; //dictionary of party size by party

//dictionaries of filter options
//key = option, value = bool (show -> true, hide -> false)
let partyFilter = {};
let stateFilter = {};
let rankFilter = {};

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
    if (twitterid == null) {
      this.twitterid = "N/A";
    } else {
      this.twitterid = twitterid;
    }
    if (youtubeid == null) {
      this.youtubeid = "N/A";
    } else {
      this.youtubeid = youtubeid;
    }
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
//takes senator.party as argument
function countPartyMembers(p) {
  if (Object.keys(parties).includes(p)) {
    parties[p] += 1;
    return;
  }
  parties[p] = 1;
  return;
}

//returns new leader object
//takes JSON senator object as argument
function createLeaderObj(s) {
  const name = s.person.firstname + " " + s.person.lastname;
  const l = new leader(s.leadership_title, name, s.party);
  return l;
}

//returns new senator object
//takes JSON senator object as argument
function createSenObj(s) {
  const name = s.person.firstname + " " + s.person.lastname;
  const dob = clarifyDate(s.person.birthday);
  const start = clarifyDate(s.startdate);
  const sen = new senator(
    name,
    s.party,
    s.state,
    s.person.gender_label,
    s.senator_rank_label,
    s.extra.office,
    dob,
    start,
    s.person.twitterid,
    s.person.youtubeid,
    s.website,
    s.person.bioguideid
  );
  return sen;
}

//takes the date in the JSON format as argument
//returns fixed nicer date
function clarifyDate(date) {
  let dateArr = date.split("-");
  let monthArr = [
    "January",
    "Febuary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let suffixArr = ["th", "st", "nd", "rd"];
  let day;
  if (dateArr[2][0] == "0") {
    day = dateArr[2][1];
  } else {
    day = dateArr[2];
  }
  //add suffix to day
  let dayEnd = Number(day) % 20;
  if (dayEnd < 4) {
    day += suffixArr[dayEnd];
  } else {
    day += "th";
  }
  let month = monthArr[Number(dateArr[1]) - 1];
  const finalDate = month + " " + day + ", " + dateArr[0];
  return finalDate;
}

//adds new senate objects to the senate dictionary object
//takes array of new senate objects as argument
function populateSenDict(senArr) {
  for (let s of senArr) {
    //s -> senator Object
    senDict[s.sid] = s;
  }
  return;
}

//html for party div
function generatePartyList() {
  for (let p in parties) {
    //p -> party name (key)
    const newDiv = document.createElement("div");
    const partyName = document.createElement("div");
    const partyNum = document.createElement("div");
    partyName.innerHTML = p;
    partyNum.innerHTML = parties[p];
    newDiv.appendChild(partyName);
    newDiv.appendChild(partyNum);
    document.getElementById("parties").appendChild(newDiv);

    newDiv.classList.add("newDiv");
    partyNum.classList.add("partyNum");

    //party background colours
    if (p === "Republican") {
      newDiv.style.backgroundColor = "#e6948e";
    } else if (p === "Democrat") {
      newDiv.style.backgroundColor = "#9fbded";
    } else {
      newDiv.style.backgroundColor = "#ebe7ab";
    }
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
  for (let s in senDict) {
    //s -> senDict key
    const senObj = senDict[s];
    const newRow = document.createElement("tr");
    //row ID = senator ID
    newRow.setAttribute("id", senObj.sid);
    //add click event handler to each row
    newRow.addEventListener("click", function () {
      senSelect(senDict[newRow.id]);
      let inSelectedArr = document.getElementsByClassName("selected");
      if (inSelectedArr.length != 0) {
        inSelectedArr[0].classList.remove("selected");
      }
      newRow.classList.add("selected");
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
    newRow.classList.add("senateListRow");
    document.getElementById("STable").appendChild(newRow);
  }
  return;
}

//populate Info div
//takes senator Object as argument
function senSelect(s) {
  //s -> senator Object
  document.getElementById("office").innerHTML = s.office;
  document.getElementById("birthday").innerHTML = s.birthday;
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

//sorts filters alphabettically by key
//takes filter as input
function filterKeySort(dict) {
  const keys = Object.keys(dict);
  keys.sort((a, b) => {
    //comparing party alphabetically
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  });
  for (let i in dict) {
    delete dict[i];
  }
  for (let j of keys) {
    dict[j] = true;
  }
  return;
}

//populate the 3 filters with options
//takes senator.party, senator.state, senator.rank as arguments
function populateFilters(p, s, r) {
  if (!Object.keys(partyFilter).includes(p)) {
    partyFilter[p] = true;
  }
  if (!Object.keys(stateFilter).includes(s)) {
    stateFilter[s] = true;
  }
  if (!Object.keys(rankFilter).includes(r)) {
    rankFilter[r] = true;
  }
  return;
}

//creates list element, gives it an onClick function and adds to filter
//takes senator.party/state/rank and the filterList ID as arguments
function generateFilter(option, filterListID) {
  let addClass;
  if (filterListID == "PFlist") {
    addClass = "partyDrop";
  } else if (filterListID == "SFlist") {
    addClass = "stateDrop";
  } else if (filterListID == "RFlist") {
    addClass = "rankDrop";
  }
  const newLi = document.createElement("li");
  newLi.classList.add(addClass);
  newLi.classList.add("filterDrop");
  newLi.innerHTML = option;
  let boldClass = filterListID + "bold";
  newLi.addEventListener("click", function () {
    changeOptionInFilter(option, filterListID);
    newLi.classList.toggle(boldClass);
  });
  document.getElementById(filterListID).appendChild(newLi);
  return;
}

//add or remove an option from the filter list
//takes option, and filter List id as argumentS
function changeOptionInFilter(option, id) {
  let dict;
  let attr;
  if (id == "PFlist") {
    dict = partyFilter;
    attr = "party";
  } else if (id == "SFlist") {
    dict = stateFilter;
    attr = "state";
  } else if (id == "RFlist") {
    dict = rankFilter;
    attr = "rank";
  }
  let hideClass = attr + "Hide";
  let allID = attr + "All";
  let allElement = document.getElementById(allID);
  //if click all, show all
  if (option == "all") {
    allElement.classList.add("bold");
    let boldClass = id + "bold";
    const boldElementsLength =
      document.getElementsByClassName(boldClass).length;
    for (let b = 0; b < boldElementsLength; b++) {
      document.getElementsByClassName(boldClass)[0].classList.remove(boldClass);
    }
    allInFilter(dict, true);
    runFilter(dict, attr, hideClass);
    return;
  }
  //if attribute all is true, hide all except new choice
  if (dict.all) {
    allElement.classList.remove("bold");
    allInFilter(dict, false);
  }
  dict[option] = !dict[option];
  //adding an option from the filter
  if (dict[option]) {
    dict.count += 1;
    //removing an option to the filter
  } else {
    dict.count -= 1;
    //if you remove all options automatically activate all
    if (dict.count == 0) {
      allElement.classList.add("bold");
      allInFilter(dict, true);
    }
  }
  runFilter(dict, attr, hideClass);
  return;
}

//sets all options is filter to bool
//takes filter and bool as argument
function allInFilter(dict, bool) {
  for (i in dict) {
    dict[i] = bool;
  }
  dict.count = 0;
  return;
}

//goes through a filter list and hides anything not on it
function runFilter(dict, attr, hideClass) {
  for (let s in senDict) {
    //s -> senDict key
    const senObj = senDict[s];
    if (dict[senObj[attr]]) {
      document.getElementById(senObj.sid).classList.remove(hideClass);
    } else {
      document.getElementById(senObj.sid).classList.add(hideClass);
    }
  }
  fixStripes();
  return;
}

//goes through showing senate list items and adds stipes
function fixStripes() {
  let showingArr = [];
  let bool = true;
  for (let i of document.getElementsByClassName("senateListRow")) {
    if (
      !i.classList.contains("partyHide") &&
      !i.classList.contains("stateHide") &&
      !i.classList.contains("rankHide")
    ) {
      showingArr.push(i);
    }
  }
  for (let j of showingArr) {
    if (bool) {
      j.style.backgroundColor = "rgb(239, 239, 239)";
    } else {
      j.style.backgroundColor = "white";
    }
    bool = !bool;
  }
}

//open/close dropdown menus for filters
function filterBtn(listID) {
  document.getElementById(listID).classList.toggle("show");
  return;
}

function resetFilters() {
  let listArr = ["PFlist", "SFlist", "RFlist"];
  for (l of listArr) {
    changeOptionInFilter("all", l);
  }
}

//triggered by text in the search bar
//filters to options starting with that letter
function searchOption(bar, list) {
  let input = document.getElementById(bar).value.toUpperCase();
  let li = document.getElementById(list).getElementsByTagName("li");
  for (let i = 0; i < li.length; i++) {
    txtValue = li[i].innerText;
    if (txtValue.toUpperCase().search(input) == 0) {
      li[i].style.display = "block";
    } else {
      li[i].style.display = "none";
    }
  }
  return;
}

//EVENT HANDLERS
// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
  if (document.getElementsByClassName("show").length == 0) {
    return;
  }
  //party
  let dropdownP = document.getElementById("partyFilterDiv");
  if (
    !event.target.matches(".partyDrop") &&
    dropdownP.classList.contains("show")
  ) {
    document.getElementById("partyFilterSearchBar").value = "";
    dropdownP.classList.remove("show");
  }
  //state
  let dropdownS = document.getElementById("stateFilterDiv");
  if (
    !event.target.matches(".stateDrop") &&
    dropdownS.classList.contains("show")
  ) {
    document.getElementById("stateFilterSearchBar").value = "";
    searchOption("stateFilterSearchBar", "SFlist");
    dropdownS.classList.remove("show");
  }
  //rank
  let dropdownR = document.getElementById("rankFilterDiv");
  if (
    !event.target.matches(".rankDrop") &&
    dropdownR.classList.contains("show")
  ) {
    document.getElementById("rankFilterSearchBar").value = "";
    dropdownR.classList.remove("show");
  }
  return;
};

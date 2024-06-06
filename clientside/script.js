let createBtn = document.querySelector("#showAccountPop-up");
let memberBtns = document.querySelectorAll(".withYellowBg");
let formContainer = document.querySelector("#formCont");
let recommationTag = document.querySelector("#recommededFood");
let dataPage = document.querySelector('.dataPage');
let recommendationBody = document.querySelector('.recommendationBody');
let backBtn = document.querySelector('.backBtn');

const houseMembersData = [
  {
    name: "Simon",
    age: 20,
    gender: "Male",
  },
  {
    name: "Elaine",
    age: 14,
    gender: "Female",
  },
  {
    name: "Jaine",
    age: 11,
    gender: "Male",
  },
  {
    name: "Rhiana",
    age: 33,
    gender: "Female",
  },
  {
    name: "Sunil",
    age: 50,
    gender: "Male",
  },
];

let getMemberData = async () => {
  let houseMemberDetails = await fetch("http://localhost:3000/api/getApi");
  let response = await houseMemberDetails.json();
  return response;
};

let memberAgeRange;
let chemicalData;

backBtn.addEventListener('click', () => {
  dataPage.classList.remove('hidden');
  recommendationBody.classList.add('hidden');
});

//ADDING EVENT LISTENER TO EACH FAMILY BUTTON
memberBtns.forEach((btn) => {
  btn.addEventListener("click", async () => {
    const memberName = btn.id;
    dataPage.classList.add('hidden');
    recommendationBody.classList.remove('hidden')
    let fittedMember = houseMembersData.find(
      (memberData) => memberData.name === memberName
    );
    let memberActualAge = fittedMember.age;
    if (memberActualAge >= 0 && memberActualAge <= 0.5) {
      memberAgeRange = "0 t0 0.5";
    } else if (memberActualAge >= 0.5 && memberActualAge <= 1) {
      memberAgeRange = "0.5 to 1";
    } else if (memberActualAge >= 1 && memberActualAge <= 3) {
      memberAgeRange = "1 to 3";
    } else if (memberActualAge >= 4 && memberActualAge <= 8) {
      memberAgeRange = "4 to 8";
    } else if (memberActualAge >= 9 && memberActualAge <= 13) {
      memberAgeRange = "9 to 13";
    } else if (memberActualAge >= 14 && memberActualAge <= 18) {
      memberAgeRange = "14 to 18";
    } else if (memberActualAge >= 19 && memberActualAge <= 30) {
      memberAgeRange = "19 to 30";
    } else if (memberActualAge >= 31 && memberActualAge <= 50) {
      memberAgeRange = "31 to 50";
    } else if (memberActualAge >= 51 && memberActualAge <= 70) {
      memberAgeRange = "51 to 70";
    } else if (memberActualAge >= 70) {
      memberAgeRange = "70 plus";
    } else {
      alert("your age is not included");
      return;
    }

    let { name, gender, ...age } = fittedMember;

    let objectForBackend = {
      Memberage: memberAgeRange,
      Membername: name,
      Gender: gender,
    };

    try {
      // Prepare the data to send to the backend
      const dataToSend = objectForBackend;

      try {
        // Make a POST request to the backend with the fetched nutrient data
        const response = await fetch(
          "http://localhost:3000/api/sendNutrientData",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
          }
        )
          .then((response) => {
            // Check if the response is OK (status 200-299)
            if (!response.ok) {
              throw new Error(
                "Network response was not ok " + response.statusText
              );
            }
            // Parse the JSON from the response
            return response.json();
          })
          .then((data) => {
            // Handle the data from the response
            recommationTag.innerHTML = data
          })
          .catch((error) => {
            // Handle any errors that occurred during the fetch
            console.error(
              "There was a problem with the fetch operation:",
              error
            );
          });
      } catch (error) {
        console.error("Error sending nutrient data to the backend:", error);
      }

      // receiveAllFood();
    } catch (error) {
      console.log("Error getting member data:", error);
    }
  });
});

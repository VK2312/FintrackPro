const register = document.querySelector("a");
const loginForm = document.querySelector("#login-form");
const registerForm = document.querySelector("#register-form");
const dashboard = document.querySelector("#dashboard");
const logoutBtn = document.querySelector("#logoutBtn")
const addTranxBtn = document.querySelector("#addTranxBtn");
const addTranxForm = document.querySelector("#addTranxForm");
const dashboardUser = document.querySelector("#dashboardUser");
const resetBtn = document.querySelector("#resetBtn");
const intelTable = document.querySelector(".intelTable");
// const editBtn = document.querySelector("#edit");
// const delBtn = document.querySelector("#delete");


const userArr = [];
let allTransaction = [];
const userTranx = [];

//function for registering the user
function registerUser(e){
    let userArr = JSON.parse(localStorage.getItem("userArr")) || []; 
    // let userId = Date.now();
    let username = e.target[0].value;
    let password = e.target[1].value;
    if(username.trim() === "" || password.trim() === ""){
        alert("Please fill all the details");
        return;
    }
    let obj = {
        // userId,
        username,
        password,
    }

    const exists = userArr.find(user => user.username === username);

    //checking if the username is unique or not
    if (exists) {
        alert("Username already exists");
        return;
        }

    userArr.push(obj);
    localStorage.setItem("userArr", JSON.stringify(userArr));

    alert("User registered successfully. Now you can proceed with login.");

    registerForm.reset();
    console.log(userArr);
    loginForm.style.display = "flex";
    registerForm.style.display = "none";
}

register.addEventListener('click', (e)=> {
    e.preventDefault();
    loginForm.style.display = "none";
    registerForm.style.display = "flex";
    
})

//Add event listener for creating user and storing them into Arr
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //RegisterUser Function calling for registering the user
    registerUser(e);

})

function userAuth(username, password){
    const userArr = JSON.parse(localStorage.getItem("userArr")) || [];
    // console.log(userArr);
    // console.log(userArr[0].username, userArr[0].password);
    const user = userArr.find((e) => e.username === username && e.password === password);

    if(user){
        alert("Login Successful");
        //saving the data of current user in local storage for tracking
        localStorage.setItem("currentUser", JSON.stringify(user));
        loginForm.style.display = "none";
        dashboard.style.display = "flex";
        renderBalance();
    } else {
        alert("Please Join us by registering");
    }

}

//LOGIN AUTHENTICATION
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let username = e.target[0].value;
    let password = e.target[1].value

    userAuth(username, password);
    loginForm.reset();

})

//Logout Logic
logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();

    localStorage.removeItem("currentUser");
    dashboard.style.display = "none";
    loginForm.style.display = "flex";
})


addTranxBtn.addEventListener('click', (e) => {
    e.preventDefault();
    addTranxForm.style.display = "flex";
})

addTranxForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("currentUser")) || [];
    
    // let user = userArr.username;
    let type = e.target[0].value;
    let description = e.target[1].value;
    let amount = Number(e.target[2].value);
    let date = e.target[3].value;
    let category = e.target[4].value;

    if(type.trim() === "" || description.trim() === ""){
        alert("Please fill all the details");
        return;
    }

    let obj = {
        id: Date.now(),
        username: user.username,
        type,
        description,
        amount,
        date,
        category
    }

    let allTransaction = JSON.parse(localStorage.getItem("allTransaction")) || [];
    allTransaction.push(obj);
    localStorage.setItem("allTransaction", JSON.stringify(allTransaction));

    // console.log(user, type, description, amount, date, category)
    renderBalance();
    addTranxForm.style.display = "none";
    renderTranxTable();
    
})


function currentBalance(){

    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let allTranx = JSON.parse(localStorage.getItem('allTransaction')) || [];

    //applying filter to filter the particular user data
    let currentUserTranx = allTranx.filter(tranx => tranx.username === currentUser.username);

    let currentBalance = 0;
    let totalIncome = 0;
    let totalExpense = 0;
    let count = 0;
    let totalTranx = 0;

    currentUserTranx.forEach(tranx => {
        if(tranx.type === 'income'){
            totalIncome += Number(tranx.amount);
            count += 1;
        } else if(tranx.type === 'expense'){
            totalExpense += Number(tranx.amount);
            count += 1;
        }
    })

    totalTranx = count;
    let balance = totalIncome - totalExpense;

    let obj = {
        currentUser,
        totalIncome,
        totalExpense,
        balance,
        totalTranx
    }

    return {totalIncome, totalExpense, balance, totalTranx};
}

//Render function taaki baar baar render na karne pade
function renderBalance() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const {totalIncome, totalExpense, balance, totalTranx} = currentBalance();
    document.querySelector("#income").innerText = totalIncome;
    document.querySelector("#expense").innerText = totalExpense;
    document.querySelector("#balance").innerText = balance;
    document.querySelector("#transaction").innerText = totalTranx;
    dashboardUser.innerText = currentUser.username;
}


window.addEventListener("load", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser) {
        loginForm.style.display = "none";
        dashboard.style.display = "flex";

        renderBalance();
        renderTranxTable();
    } else {
        dashboard.style.display = "none";
        loginForm.style.display = "flex";
    }
});


resetBtn.addEventListener("click", (e) => {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let allTranx = JSON.parse(localStorage.getItem('allTransaction')) || [];
    
    const remainingTranx = allTranx.filter( tranx => currentUser.username !== tranx.username);

    localStorage.setItem("allTransaction", JSON.stringify(remainingTranx));
    renderBalance();
    renderTranxTable();
    alert(`${currentUser.username} all transaction were taken by Cheel`);

});

function renderTranxTable() {

    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let allTranx = JSON.parse(localStorage.getItem('allTransaction')) || [];

    let currentUserTranx = allTranx.filter(
        tranx => tranx.username === currentUser.username
    );

    let tranxTableBody = document.querySelector("#tranxTableBody")
    tranxTableBody.innerHTML = "";

        currentUserTranx.forEach(tranx => {
        let row = document.createElement("tr");
        row.innerHTML = `
                <td class="tabElem" required>${tranx.date}</td>
                <td class="tabElem" required>${tranx.description} </td>
                <td class="tabElem" required>${tranx.category} </td>
                <td class="tabElem" required>${tranx.amount} </td>
                <td class="tabElem" required> 
                <button class = "edit" data-id="${tranx.id}" style="width: 35px;">Edit</button> 
                <button class="delete" data-id="${tranx.id}" style="width: 25px;">X</button> 
                </td>
        `
        tranxTableBody.appendChild(row);
    })

            document.querySelectorAll(".delete").forEach(btn => {
            btn.addEventListener("click", () => {
            deleteTranx(Number(btn.dataset.id));
        });
        });

            document.querySelectorAll(".edit").forEach(btn => {
            btn.addEventListener("click", () => {
            editTranx(Number(btn.dataset.id));
        });
        });

}

renderTranxTable();

const update = () => {
    addTranxForm.style.display = 'flex';

}

function deleteTranx(id) {
    let allTranx = JSON.parse(localStorage.getItem("allTransaction")) || [];
    let updated = allTranx.filter(tranx => tranx.id !== id);
    localStorage.setItem("allTransaction", JSON.stringify(updated));
    renderBalance();
    renderTranxTable();
}

function editTranx(id) {
    let allTranx = JSON.parse(localStorage.getItem("allTransaction")) || [];
    let tranx = allTranx.find(t => t.id === id);

    // Fill the form data
    if(tranx){
        addTranxForm.style.display = "flex";
        addTranxForm[0].value = tranx.type;
        addTranxForm[1].value = tranx.description;
        addTranxForm[2].value = tranx.amount;
        addTranxForm[3].value = tranx.date;
        addTranxForm[4].value = tranx.category;

    // On submit, update instead of push
        addTranxForm.onsubmit = (e) => {
            e.preventDefault();
            tranx.type = e.target[0].value;
            tranx.description = e.target[1].value;
            tranx.amount = Number(e.target[2].value);
            tranx.date = e.target[3].value;
            tranx.category = e.target[4].value;

            localStorage.setItem("allTransaction", JSON.stringify(allTranx));
            addTranxForm.style.display = "none";
            renderBalance();
            renderTranxTable();
        };
    }
}


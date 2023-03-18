async function GetAllCategories() {
    let categories = new Array();

    await fetch("http://localhost:5678/api/categories")
        .then(data => data.json())
        .then(jsonCategoriesList => {
            /**add the name of the first category button */
            categories.push([0, "Tous"]);

            for (let jsonCategory of jsonCategoriesList) {
                categories.push([jsonCategory.id, jsonCategory.name]);
            }
        });
    return categories;
}

function RemoveAllWorksFromThePage() {
    let gallery = document.querySelector(".gallery");
    while (gallery.firstChild) {
        gallery.removeChild(gallery.firstChild);
    }
}

async function GetWorks(id) {
    await fetch("http://localhost:5678/api/works")
        .then(data => data.json())
        .then(jsonListArticle => {
            for (let jsonArticle of jsonListArticle) {
                if (id === 0 || jsonArticle.category.id === id) {
                    CreateObjectsHTMLStructure(jsonArticle);
                }
            }
        });
}

function AddCategoryButtonsToDocument(categories) {
    let categoryButtonsDiv = document.querySelector(".categories");

    for (let categoryButton of categories) {
        console.log(categoryButton);
        let button = document.createElement("div");

        /**add event listener to a category button*/
        AddEventListenerToCategoryButton(button, categoryButton[0]);
        /**adds styling class to a category button */
        button.classList.add("category-button");
        if (categoryButton[0] === 0) {
            button.classList.add("category-btn-selected");
        }
        /**adds id to a category button */
        button.setAttribute("categoryId", categoryButton[0]);
        /**adds name to a category button*/
        button.innerText = categoryButton[1];
        categoryButtonsDiv.appendChild(button);
    }
}

function AddEventListenerToCategoryButton(button, categoryID) {
    button.addEventListener("click", () => {
        /**remove "selected" styling from any other button
         * and style button that has beed clicked on
        */
        document.querySelectorAll(".category-btn-selected")
            .forEach(e => e.classList.remove("category-btn-selected"));

        button.classList.add("category-btn-selected");
        /*remove previous selection of works before
        adding another one*/
        RemoveAllWorksFromThePage();
        /*rendering new selection of works on page*/
        GetWorks(categoryID);
    });
}

function CreateObjectsHTMLStructure(jsonArticle) {
    let article = new Article(jsonArticle);

    let figure = document.createElement("figure");

    let img = document.createElement("img");
    img.setAttribute("src", article.imageUrl);
    img.setAttribute("alt", article.title);

    let figcaption = document.createElement("figcaption");
    figcaption.innerText = article.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);

    document.querySelector(".gallery").appendChild(figure);
}

function AdjustLayoutIfLoggedIn() {
    //make sure that the modal window doesn't display
    //document.querySelector(".modal").style.display="none";

    if (window.localStorage.getItem("token")) {
        /*authorized - layout for edit*/
        document.querySelector(".categories").style.visibility = "hidden";

        document.querySelector("#login").innerText = "logout";
        document.querySelectorAll(".modify-link")
            .forEach(item => item.style.display = "initial");

        //add eventlistener for modify link - it will open the modal window
        document.querySelectorAll(".modify-link")
            .forEach(item => {
                item.addEventListener("click", (event) => {
                    //show the modal window
                    document.querySelector(".modal").style.display = null;
                })
            })

        //event listener to close the modal window
        document.querySelector(".close-icon")
            .addEventListener("click", (e)=>{
                /*alert("clicked");*/
                document.querySelector(".modal").style.display = "none";
            } );


        //add event listener - if user logs out, redirect to index.html
        document.querySelector("#login").addEventListener("click", (event) => {
            event.preventDefault();
            window.localStorage.removeItem("token");
            window.location.href = "./index.html";
        })
    } else {
        /*not authorized*/
        document.querySelector(".black-header").style.display = "none";
        /*document.querySelector(".modify-link").style.display = "none";*/
        document.querySelectorAll(".modify-link").
            forEach(item => item.style.display = "none");


        //display: invisible - the gap will stay in place 
        document.querySelector(".categories").style.visibility = "visible";
        document.querySelector("#login").innerText = "login";
    }
}

async function Start() {


    //remove any works before rendering the page anew
    RemoveAllWorksFromThePage();
    /* initial render - show all works*/
    GetWorks(0);

    let categories = await GetAllCategories();
    AddCategoryButtonsToDocument(categories);

    AdjustLayoutIfLoggedIn();

}

Start();




